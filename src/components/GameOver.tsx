
import React from "react";
import { Button } from "@/components/ui/button";

interface GameOverProps {
  score: number;
  missedTiles: number; // Added missed tiles prop
  onRestart: () => void;
  show: boolean;
}

const GameOver: React.FC<GameOverProps> = ({ score, missedTiles, onRestart, show }) => {
  return (
    <div className={`game-over ${show ? 'animate-game-over-fade' : ''}`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Game Over</h1>
        <p className="text-xl text-game-light mb-2">Your score: {score}</p>
        <p className="text-lg text-red-300 mb-8">Tiles missed: {missedTiles}/20</p>
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
