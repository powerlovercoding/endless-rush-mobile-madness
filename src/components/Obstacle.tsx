
import React from "react";
import { ObstacleType, Position, getLanePosition } from "../utils/gameUtils";

interface ObstacleProps {
  id: number;
  type: ObstacleType;
  position: Position;
  distance: number;
  speed: number;
}

const Obstacle: React.FC<ObstacleProps> = ({ type, position, distance }) => {
  // Style based on obstacle type
  const getObstacleStyle = () => {
    const baseStyle = {
      right: `${distance}%`,
    };
    
    switch (type) {
      case "standard":
        return {
          ...baseStyle,
          height: "40px",
          width: "40px",
          bottom: "20px",
        };
      case "tall":
        return {
          ...baseStyle,
          height: "80px",
          width: "40px",
          bottom: "20px",
        };
      case "wide":
        return {
          ...baseStyle,
          height: "20px",
          width: "80px",
          bottom: "20px",
        };
      case "flying":
        return {
          ...baseStyle,
          height: "30px",
          width: "30px",
          bottom: "60px", // Higher up to represent flying obstacle
        };
      default:
        return baseStyle;
    }
  };

  // Color based on obstacle type
  const getObstacleColor = () => {
    switch (type) {
      case "standard":
        return "bg-game-obstacle";
      case "tall":
        return "bg-game-danger";
      case "wide":
        return "bg-game-tertiary";
      case "flying":
        return "bg-amber-400";
      default:
        return "bg-game-obstacle";
    }
  };

  return (
    <div
      className={`obstacle absolute ${getLanePosition(position)} ${getObstacleColor()}`}
      style={getObstacleStyle()}
    />
  );
};

export default Obstacle;
