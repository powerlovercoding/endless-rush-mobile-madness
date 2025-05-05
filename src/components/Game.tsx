
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
  calculateObstacleRate,
  shouldIncreaseSpeed
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
      status: "playing",
      lastSpeedUpTime: Date.now() // Initialize the speed up timer when starting
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
      touched: false
    };
    
    setGameState(prev => ({
      ...prev,
      obstacles: [...prev.obstacles, newObstacle]
    }));
  }, [gameState.status, gameState.speed]);

  // Game loop - updated to handle speed increase and touch effects
  const gameLoop = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => {
      // Process obstacles and check for collisions (which now means successful touches)
      let touchedInThisFrame = 0;
      let missedInThisFrame = 0;
      
      const updatedObstacles = prev.obstacles.map(obstacle => {
        // Check if this obstacle is being touched now
        const isTouched = 
          !obstacle.touched && // Only count first touch
          obstacle.distance > 80 && // Must be near bottom of screen
          obstacle.distance < 110 && // Must be near bottom of screen
          obstacle.position === prev.playerPosition; // Must be in same lane
        
        if (isTouched) {
          // Count touched obstacles in this frame
          touchedInThisFrame++;
        }
        
        // Move obstacle down - very slow movement
        return {
          ...obstacle,
          distance: obstacle.distance + prev.speed * 0.2, // Very slow descent
          touched: obstacle.touched || isTouched,
          touchEffect: isTouched ? true : obstacle.touchEffect // Set touch effect on touch
        };
      });
      
      // Check for obstacles that have gone off-screen without being touched
      const offScreenObstacles = updatedObstacles.filter(o => o.distance >= 110);
      const missedObstacles = offScreenObstacles.filter(o => !o.touched);
      missedInThisFrame = missedObstacles.length;
      
      // Remove obstacles that are off-screen at bottom
      const filteredObstacles = updatedObstacles.filter(obstacle => obstacle.distance < 110);
      
      // Update the missed tiles counter
      const newMissedTiles = prev.missedTiles + missedInThisFrame;
      
      // Check if we should increase speed (every 20 seconds)
      let newSpeed = prev.speed;
      let newLastSpeedUpTime = prev.lastSpeedUpTime;
      
      if (shouldIncreaseSpeed(prev.lastSpeedUpTime)) {
        newSpeed = prev.speed * 1.15; // Increase speed by 15%
        newLastSpeedUpTime = Date.now(); // Reset timer
        
        // Notify the player of speed increase
        setTimeout(() => {
          toast("Speed increased!", {
            position: "top-center",
            duration: 1000
          });
        }, 0);
      }
      
      // End game if too many tiles were missed (20 tiles)
      if (newMissedTiles >= 20) {
        setTimeout(endGame, 0);
      }
      
      // Increment score by the number of obstacles touched in this frame
      return {
        ...prev,
        obstacles: filteredObstacles,
        score: prev.score + touchedInThisFrame,
        missedTiles: newMissedTiles,
        speed: newSpeed,
        lastSpeedUpTime: newLastSpeedUpTime
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
      
      {/* Score display - updated to show both score and missed tiles */}
      <div className="score-display">
        <div className="flex flex-col items-end">
          <span>SCORE: {formatScore(gameState.score)}</span>
          <span className="text-red-300 text-sm">MISSED: {gameState.missedTiles}/20</span>
        </div>
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
      
      {/* Game over screen - updated to show both score and missed tiles */}
      <GameOver 
        score={gameState.score}
        missedTiles={gameState.missedTiles}
        onRestart={startGame}
        show={gameState.status === "game-over"}
      />
    </div>
  );
};

export default Game;
