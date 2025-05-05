
import React, { useEffect, useState } from "react";
import { ObstacleType, Position, getLanePosition } from "../utils/gameUtils";

interface ObstacleProps {
  id: number;
  type: ObstacleType;
  position: Position;
  distance: number;
  speed: number;
  touched: boolean;
  touchEffect?: boolean; // New prop to handle touch effect
}

const Obstacle: React.FC<ObstacleProps> = ({ type, position, distance, touched, touchEffect }) => {
  const [showEffect, setShowEffect] = useState(false);

  // Handle touch effect animation
  useEffect(() => {
    if (touchEffect) {
      setShowEffect(true);
      // Reset touch effect after animation completes
      const timer = setTimeout(() => {
        setShowEffect(false);
      }, 300); // 300ms animation duration
      
      return () => clearTimeout(timer);
    }
  }, [touchEffect]);

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

  // Color based on obstacle type and touch state
  const getObstacleColor = () => {
    // Base classes including potential touch effect
    const touchClass = showEffect ? "ring-4 ring-white scale-110" : "";
    
    switch (type) {
      case "standard":
        return `${touched ? "bg-game-obstacle opacity-30" : "bg-game-obstacle"} ${touchClass}`;
      case "tall":
        return `${touched ? "bg-game-danger opacity-30" : "bg-game-danger"} ${touchClass}`;
      case "wide":
        return `${touched ? "bg-game-tertiary opacity-30" : "bg-game-tertiary"} ${touchClass}`;
      case "flying":
        return `${touched ? "bg-amber-400 opacity-30" : "bg-amber-400"} ${touchClass}`;
      default:
        return `${touched ? "bg-game-obstacle opacity-30" : "bg-game-obstacle"} ${touchClass}`;
    }
  };

  return (
    <div
      className={`obstacle absolute ${getLanePosition(position)} ${getObstacleColor()} rounded-md transition-all duration-300`}
      style={getObstacleStyle()}
    />
  );
};

export default Obstacle;
