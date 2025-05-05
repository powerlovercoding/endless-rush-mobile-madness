
import React, { useEffect, useState } from "react";
import { Position, PlayerState, getLanePosition } from "../utils/gameUtils";

interface PlayerProps {
  position: Position;
  playerState: PlayerState;
}

const Player: React.FC<PlayerProps> = ({ position, playerState }) => {
  const [animationClass, setAnimationClass] = useState("");
  
  // Set animation class based on player state
  useEffect(() => {
    switch (playerState) {
      case "jumping":
        setAnimationClass("scale-90");
        break;
      case "sliding":
        setAnimationClass("scale-110");
        break;
      default:
        setAnimationClass("");
    }
  }, [playerState]);

  return (
    <div 
      className={`player ${getLanePosition(position)} ${animationClass} h-16 w-12 transition-all duration-200`}
      style={{ bottom: "100px" }}
    >
      <div className="bg-game-light w-full h-full rounded-lg flex items-center justify-center">
        <div className="bg-game-secondary w-8 h-10 rounded-full">
          {/* Player face */}
          <div className="flex justify-around pt-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="w-4 h-1 bg-white mx-auto mt-2 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Player;
