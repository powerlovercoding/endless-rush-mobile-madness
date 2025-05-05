
import React from "react";
import { ObstacleType, Position, getLanePosition } from "../utils/gameUtils";

interface ObstacleProps {
  id: number;
  type: ObstacleType;
  position: Position;
  distance: number;
  speed: number;
  touched: boolean; // New prop to track if obstacle has been touched
}

const Obstacle: React.FC<ObstacleProps> = ({ type, position, distance, touched }) => {
  // Style based on obstacle type
  const getObstacleStyle = () => {
    const baseStyle = {
      top: `${distance}%`,
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
          width: "80px",
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

  // Color based on obstacle type with pulsing animation for untouched tiles
  const getObstacleColor = () => {
    const baseClass = touched ? "opacity-30" : "animate-pulse";
    
    switch (type) {
      case "standard":
        return `bg-game-obstacle ${baseClass}`;
      case "tall":
        return `bg-game-danger ${baseClass}`;
      case "wide":
        return `bg-game-tertiary ${baseClass}`;
      case "flying":
        return `bg-amber-400 ${baseClass}`;
      default:
        return `bg-game-obstacle ${baseClass}`;
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
