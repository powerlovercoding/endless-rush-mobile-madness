
import React from "react";
import Game from "../components/Game";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  // We'll always render the game regardless of device type
  return (
    <div className="h-screen w-screen p-0 m-0 overflow-hidden">
      <Game />
    </div>
  );
};

export default Index;
