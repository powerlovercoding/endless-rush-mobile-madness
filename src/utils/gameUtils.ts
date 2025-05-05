
export type Position = "left" | "center" | "right";
export type PlayerState = "running" | "jumping" | "sliding";
export type ObstacleType = "standard" | "tall" | "wide" | "flying";
export type GameStatus = "ready" | "playing" | "game-over";

export interface Obstacle {
  id: number;
  type: ObstacleType;
  position: Position;
  distance: number;
  speed: number;
  touched: boolean;
  touchEffect?: boolean; // Add new property for touch effect animation
}

export interface GameState {
  status: GameStatus;
  score: number;
  missedTiles: number;
  speed: number;
  playerPosition: Position;
  playerState: PlayerState;
  obstacles: Obstacle[];
  isInvulnerable: boolean;
  lastSpeedUpTime: number; // Add timestamp for last speed increase
}

export const INITIAL_GAME_STATE: GameState = {
  status: "ready",
  score: 0,
  missedTiles: 0,
  speed: 1,
  playerPosition: "center",
  playerState: "running",
  obstacles: [],
  isInvulnerable: false,
  lastSpeedUpTime: 0 // Initialize with 0
};

// Calculate position for lane
export const getLanePosition = (position: Position): string => {
  switch (position) {
    case "left": return "left-0";
    case "center": return "left-1/3";
    case "right": return "left-2/3";
    default: return "left-1/3";
  }
};

// Generate a random obstacle type
export const getRandomObstacleType = (): ObstacleType => {
  const types: ObstacleType[] = ["standard", "tall", "wide", "flying"];
  return types[Math.floor(Math.random() * types.length)];
};

// Generate a random position
export const getRandomPosition = (): Position => {
  const positions: Position[] = ["left", "center", "right"];
  return positions[Math.floor(Math.random() * positions.length)];
};

// Format score for display
export const formatScore = (score: number): string => {
  return score.toString().padStart(5, '0');
};

// Check collision between player and falling obstacle
export const checkCollision = (
  playerPosition: Position,
  playerState: PlayerState,
  obstacle: Obstacle
): boolean => {
  // Check if obstacle is in collision zone (near the bottom of the screen)
  if (obstacle.distance > 80 && obstacle.distance < 110) {
    // Same lane collision check
    if (playerPosition === obstacle.position) {
      return true; // Player is touching the obstacle
    }
  }
  return false;
};

// Calculate obstacle generation rate - very slow fixed rate
export const calculateObstacleRate = (): number => {
  return 3000; // Keep the slower fixed rate for obstacle generation (3 seconds between obstacles)
};

// New function to check if speed should increase
export const shouldIncreaseSpeed = (lastSpeedUpTime: number): boolean => {
  // Speed up every 20 seconds (20000 milliseconds)
  return Date.now() - lastSpeedUpTime >= 20000;
};

