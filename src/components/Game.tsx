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
  shouldIncreaseDifficulty,
  calculateSpeed,
  calculateObstacleRate
} from "../utils/gameUtils";

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({...INITIAL_GAME_STATE});
  const gameLoopRef = useRef<number | null>(null);
  const obstacleGeneratorRef = useRef<NodeJS.Timeout | null>(null);
  const difficultyTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    toast("Avoid the falling tiles!", {
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
    
    if (difficultyTimerRef.current) {
      clearInterval(difficultyTimerRef.current);
      difficultyTimerRef.current = null;
    }
  }, []);

  // Handle player actions - updated for the new concept
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
      speed: gameState.speed
    };
    
    setGameState(prev => ({
      ...prev,
      obstacles: [...prev.obstacles, newObstacle]
    }));
  }, [gameState.status, gameState.speed]);

  // Update difficulty
  const updateDifficulty = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => {
      if (shouldIncreaseDifficulty(prev.score, prev.lastDifficultyChange)) {
        const newLevel = prev.difficultyLevel + 1;
        
        // Show difficulty increase message
        toast(`Difficulty Increased: Level ${newLevel}!`, {
          position: "top-center",
          duration: 2000
        });
        
        return {
          ...prev,
          difficultyLevel: newLevel,
          speed: calculateSpeed(newLevel),
          lastDifficultyChange: prev.score
        };
      }
      return prev;
    });
  }, [gameState.status]);

  // Game loop - updated for obstacles falling from top
  const gameLoop = useCallback(() => {
    if (gameState.status !== "playing") return;
    
    setGameState(prev => {
      // Update score
      const newScore = prev.score + 1;
      
      // Move obstacles from top to bottom
      const updatedObstacles = prev.obstacles
        .map(obstacle => ({
          ...obstacle,
          distance: obstacle.distance + prev.speed * 0.3
        }))
        .filter(obstacle => obstacle.distance < 110); // Remove obstacles that are off-screen at bottom
      
      // Check for collisions
      const collision = prev.isInvulnerable ? false : prev.obstacles.some(obstacle => 
        checkCollision(prev.playerPosition, prev.playerState, obstacle)
      );
      
      if (collision) {
        // End game on collision
        setTimeout(endGame, 0);
        return {
          ...prev,
          obstacles: updatedObstacles,
          score: newScore
        };
      }
      
      return {
        ...prev,
        obstacles: updatedObstacles,
        score: newScore
      };
    });
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.status, endGame]);

  // Setup game loop and timers when game starts
  useEffect(() => {
    if (gameState.status === "playing") {
      // Start game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      
      // Start obstacle generator
      obstacleGeneratorRef.current = setInterval(
        generateObstacle, 
        calculateObstacleRate(gameState.difficultyLevel)
      );
      
      // Start difficulty timer check
      difficultyTimerRef.current = setInterval(updateDifficulty, 3000);
    }
    
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (obstacleGeneratorRef.current) clearInterval(obstacleGeneratorRef.current);
      if (difficultyTimerRef.current) clearInterval(difficultyTimerRef.current);
    };
  }, [
    gameState.status, 
    gameState.difficultyLevel, 
    gameLoop, 
    generateObstacle, 
    updateDifficulty
  ]);

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
            <p className="text-xl text-game-light mb-2">Avoid the falling tiles!</p>
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
