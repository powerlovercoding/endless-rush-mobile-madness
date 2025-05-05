
import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import Player from "./Player";
import Obstacle from "./Obstacle";
import GameOver from "./GameOver";
import GameControls from "./GameControls";
import { Button } from "@/components/ui/button";
import { 
  GameState, 
  INITIAL_GAME_STATE, 
  Obstacle as ObstacleType,
  formatScore,
  getRandomObstacleType,
  getRandomPosition,
  checkCollision,
  calculateObstacleRate
} from "../utils/gameUtils";

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({...INITIAL_GAME_STATE});
  const gameLoopRef = useRef<number | null>(null);
  const obstacleGeneratorRef = useRef<NodeJS.Timeout | null>(null);

  // Reset game state to initial values
  const resetGame = useCallback(() => {
    setGameState({...INITIAL_GAME_STATE});
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    resetGame();
    setGameState(prev => ({
      ...prev,
      status: "playing"
    }));
    
    // Show starting message
    toast("Touch the falling tiles!", {
      position: "top-center",
      duration: 1500
    });
  }, [resetGame]);

  // End the game
  const endGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: "game-over"
    }));
    
    // Show game over message
    toast("Game Over!", {
      position: "top-center",
      duration: 2000
    });
    
    // Clean up timers
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    if (obstacleGeneratorRef.current) {
      clearInterval(obstacleGeneratorRef.current);
      obstacleGeneratorRef.current = null;
    }
  }, []);

  // Handle player actions
  const handleJump = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => ({
      ...prev,
      playerState: "jumping"
    }));
    
    // Reset to running after animation
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        playerState: "running"
      }));
    }, 500);
  }, [gameState.status]);

  const handleSlide = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => ({
      ...prev,
      playerState: "sliding"
    }));
    
    // Reset to running after animation
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        playerState: "running"
      }));
    }, 500);
  }, [gameState.status]);

  const handleMoveLeft = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => ({
      ...prev,
      playerPosition: prev.playerPosition === "center" ? "left" : 
                      prev.playerPosition === "right" ? "center" : "left"
    }));
  }, [gameState.status]);

  const handleMoveRight = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => ({
      ...prev,
      playerPosition: prev.playerPosition === "center" ? "right" : 
                      prev.playerPosition === "left" ? "center" : "right"
    }));
  }, [gameState.status]);

  // Generate new obstacles - updated for falling from top
  const generateObstacle = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    const newObstacle: ObstacleType = {
      id: Date.now(),
      type: getRandomObstacleType(),
      position: getRandomPosition(),
      distance: -10, // Start from above the screen
      speed: gameState.speed,
      touched: false // Add touched property initialized to false
    };
    
    setGameState(prev => ({
      ...prev,
      obstacles: [...prev.obstacles, newObstacle]
    }));
  }, [gameState.status, gameState.speed]);

  // Game loop - updated for touching tiles instead of avoiding them
  const gameLoop = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => {
      // Update score (only for basic time survived)
      const newScore = prev.score + 1;
      
      // Process obstacles and check for collisions (which now means successful touches)
      let scoreBonus = 0;
      const updatedObstacles = prev.obstacles.map(obstacle => {
        // Check if this obstacle is being touched now
        const isTouched = 
          !obstacle.touched && // Only count first touch
          obstacle.distance > 80 && // Must be near bottom of screen
          obstacle.distance < 110 && // Must be near bottom of screen
          obstacle.position === prev.playerPosition; // Must be in same lane
        
        if (isTouched) {
          // Add points when touching an obstacle
          scoreBonus += 10;
        }
        
        // Move obstacle down - slowed down the rate by using a smaller speed multiplier
        return {
          ...obstacle,
          distance: obstacle.distance + prev.speed * 0.2, // Reduced from 0.3 to 0.2 for slower descent
          touched: obstacle.touched || isTouched
        };
      });
      
      // Remove obstacles that are off-screen at bottom
      const filteredObstacles = updatedObstacles.filter(obstacle => obstacle.distance < 110);
      
      // Count missed tiles (tiles that went offscreen without being touched)
      const missedTiles = prev.obstacles.length - updatedObstacles.length - 
        (updatedObstacles.filter(o => o.distance >= 110 && o.touched).length);
      
      // End game if too many tiles were missed
      if (missedTiles >= 5) {
        setTimeout(endGame, 0);
        return {
          ...prev,
          obstacles: filteredObstacles,
          score: newScore + scoreBonus
        };
      }
      
      return {
        ...prev,
        obstacles: filteredObstacles,
        score: newScore + scoreBonus
      };
    });
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.status, endGame]);

  // Setup game loop and timers when game starts
  useEffect(() => {
    if (gameState.status === "playing") {
      // Start game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      
      // Start obstacle generator with fixed rate
      obstacleGeneratorRef.current = setInterval(generateObstacle, calculateObstacleRate());
    }
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (obstacleGeneratorRef.current) clearInterval(obstacleGeneratorRef.current);
    };
  }, [gameState.status, gameLoop, generateObstacle]);

  return (
    <div className="game-container">
      {/* Game background with lanes */}
      <div className="lane left-0"></div>
      <div className="lane left-1/3"></div>
      <div className="lane left-2/3"></div>
      
      {/* Score display */}
      <div className="score-display">
        <span>SCORE: {formatScore(gameState.score)}</span>
      </div>
      
      {/* Player */}
      <Player 
        position={gameState.playerPosition} 
        playerState={gameState.playerState} 
      />
      
      {/* Obstacles */}
      {gameState.obstacles.map(obstacle => (
        <Obstacle 
          key={obstacle.id}
          id={obstacle.id}
          type={obstacle.type}
          position={obstacle.position}
          distance={obstacle.distance}
          speed={obstacle.speed}
          touched={obstacle.touched}
        />
      ))}
      
      {/* Game controls */}
      <GameControls 
        onSwipeUp={handleJump}
        onSwipeDown={handleSlide}
        onSwipeLeft={handleMoveLeft}
        onSwipeRight={handleMoveRight}
      />
      
      {/* Start screen or game over overlay */}
      {gameState.status === "ready" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Color Tiles</h1>
            <p className="text-xl text-game-light mb-2">Touch the falling tiles!</p>
            <p className="text-md text-white/70 mb-8">
              ↑ Shrink | ↓ Grow | ← → Move
            </p>
            <Button 
              onClick={startGame}
              className="start-btn"
            >
              Start Game
            </Button>
          </div>
        </div>
      )}
      
      {/* Game over screen */}
      <GameOver 
        score={gameState.score}
        onRestart={startGame}
        show={gameState.status === "game-over"}
      />
    </div>
  );
};

export default Game;
