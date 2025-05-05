
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
      top: `${distance}%`, // Now coming from top instead of right
    };
    
    switch (type) {
      case "standard":
        return {
          ...baseStyle,
          height: "40px",
          width: "40px",
        };
      case "tall":
        return {
          ...baseStyle,
          height: "40px", 
          width: "80px", // Wider for the piano-like effect
        };
      case "wide":
        return {
          ...baseStyle,
          height: "40px",
          width: "80px",
        };
      case "flying":
        return {
          ...baseStyle,
          height: "40px",
          width: "60px",
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
      className={`obstacle absolute ${getLanePosition(position)} ${getObstacleColor()} rounded-md`}
      style={getObstacleStyle()}
    />
  );
};

export default Obstacle;
