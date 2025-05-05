
import React, { useEffect } from "react";

interface GameControlsProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  onSwipeUp, 
  onSwipeDown, 
  onSwipeLeft, 
  onSwipeRight 
}) => {
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let touchEndY = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEndY = e.touches[0].clientY;
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;
      const minSwipeDistance = 50; // Minimum swipe distance in pixels
      
      // Determine if it's a horizontal or vertical swipe
      if (Math.abs(diffY) > Math.abs(diffX)) {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0) {
            onSwipeUp();
          } else {
            onSwipeDown();
          }
        }
      } else {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            onSwipeLeft();
          } else {
            onSwipeRight();
          }
        }
      }
      
      // Reset values
      touchStartY = 0;
      touchEndY = 0;
      touchStartX = 0;
      touchEndX = 0;
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    // For testing on desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          onSwipeUp();
          break;
        case 'ArrowDown':
          onSwipeDown();
          break;
        case 'ArrowLeft':
          onSwipeLeft();
          break;
        case 'ArrowRight':
          onSwipeRight();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight]);
  
  return (
    <div className="control-area">
      <div className="text-white/30 text-center pb-10">
        <p className="text-sm">Swipe to control</p>
      </div>
    </div>
  );
};

export default GameControls;
