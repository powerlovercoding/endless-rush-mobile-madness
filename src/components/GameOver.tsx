
import React from "react";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  score: number;
  onRestart: () => void;
  show: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart, show }) => {
  return (
    <div className={`game-over ${show ? 'animate-game-over-fade' : ''}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Game Over</h1>
        <p className="text-xl text-game-light mb-8">Your score: {score}</p>
        <Button
          onClick={onRestart}
          className="start-btn"
        >
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameOver;
