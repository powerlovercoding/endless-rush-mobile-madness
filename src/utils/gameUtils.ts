
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
}

export interface GameState {
  status: GameStatus;
  score: number;
  speed: number;
  playerPosition: Position;
  playerState: PlayerState;
  obstacles: Obstacle[];
  difficultyLevel: number;
  lastDifficultyChange: number;
  isInvulnerable: boolean;
}

export const INITIAL_GAME_STATE: GameState = {
  status: "ready",
  score: 0,
  speed: 5,
  playerPosition: "center",
  playerState: "running",
  obstacles: [],
  difficultyLevel: 1,
  lastDifficultyChange: 0,
  isInvulnerable: false
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

// Check collision between player and obstacle
export const checkCollision = (
  playerPosition: Position,
  playerState: PlayerState,
  obstacle: Obstacle
): boolean => {
  if (obstacle.distance > 10 && obstacle.distance < 25) {
    // Same lane collision check
    if (playerPosition === obstacle.position) {
      // Type-specific collision checks
      switch (obstacle.type) {
        case "standard":
          return playerState !== "sliding" && playerState !== "jumping";
        case "tall":
          return true; // Always collides (must be avoided by changing lanes)
        case "wide":
          return playerState !== "jumping";
        case "flying":
          return playerState !== "sliding";
        default:
          return true;
      }
    }
  }
  return false;
};

// Calculate difficulty increase
export const shouldIncreaseDifficulty = (
  score: number,
  lastDifficultyChange: number
): boolean => {
  // Increase difficulty every 3 minutes (roughly 180 points)
  return score - lastDifficultyChange >= 180;
};

// Calculate speed based on difficulty level
export const calculateSpeed = (difficultyLevel: number): number => {
  return 5 + (difficultyLevel - 1) * 2;
};

// Calculate obstacle generation rate based on difficulty
export const calculateObstacleRate = (difficultyLevel: number): number => {
  return Math.max(1500 - (difficultyLevel - 1) * 200, 600);
};
