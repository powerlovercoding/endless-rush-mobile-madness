
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

  // Color based on obstacle type - removed pulsing animation and opacity reduction
  const getObstacleColor = () => {
    // Removed the baseClass with pulsing animation
    // Now tiles remain fully visible until they disappear
    switch (type) {
      case "standard":
        return touched ? "bg-game-obstacle opacity-30" : "bg-game-obstacle";
      case "tall":
        return touched ? "bg-game-danger opacity-30" : "bg-game-danger";
      case "wide":
        return touched ? "bg-game-tertiary opacity-30" : "bg-game-tertiary";
      case "flying":
        return touched ? "bg-amber-400 opacity-30" : "bg-amber-400";
      default:
        return touched ? "bg-game-obstacle opacity-30" : "bg-game-obstacle";
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
