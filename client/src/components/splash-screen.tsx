import { useEffect, useState } from "react";
import logoPath from "@assets/LOGO_ui_1749385809688.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center z-50 transition-opacity duration-300 opacity-0" />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center z-50">
      <div className="text-center text-white animate-fade-in">
        <div className="mb-8">
          <img 
            src={logoPath} 
            alt="Kentronics Solutions" 
            className="w-32 h-32 mx-auto mb-4 object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">Kentronics Solutions</h1>
        <p className="text-xl opacity-90 mb-8">Pool Table Management</p>
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-sm opacity-75">Loading your dashboard...</p>
      </div>
    </div>
  );
}
