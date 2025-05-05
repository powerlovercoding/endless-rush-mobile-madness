
import React from "react";
import Game from "../components/Game";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-screen p-0 m-0 overflow-hidden">
      {isMobile ? (
        <Game />
      ) : (
        <div className="flex items-center justify-center h-full bg-gradient-to-b from-game-primary to-game-dark text-white">
          <div className="text-center max-w-md p-6">
            <h1 className="text-3xl font-bold mb-4">Endless Rush</h1>
            <p className="mb-8">
              This game is optimized for mobile devices. Please open it on your phone for the best experience.
            </p>
            <div className="border-2 border-white/20 rounded-xl p-6 bg-black/20">
              <div className="relative w-40 h-72 mx-auto bg-black/30 rounded-2xl border-4 border-gray-700 overflow-hidden">
                <div className="w-full h-full bg-gray-900 flex items-center justify-center text-xs">
                  <div className="text-center">
                    <p className="mb-2">For mobile devices only</p>
                    <div className="w-8 h-14 mx-auto border border-white/50 rounded-md animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
