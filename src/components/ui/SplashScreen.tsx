import { useEffect, useState } from "react";
import logo from "../../assets/mi-logo-s-screen.png";

interface Props {
  onFinished: () => void;
  destination?: string;
}

export default function SplashScreen({ onFinished, destination }: Props) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const doneTimer = setTimeout(() => onFinished(), 2300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#024959] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <img src={logo} alt="JC Luna logo" className="w-60 md:w-70" />
        <p className="text-[#7ecfda] text-sm tracking-[0.3em] uppercase">
          Spring Boot · JWT
        </p>
        {destination && (
          <p className="text-white/60 text-xs tracking-[0.2em] uppercase animate-fade-up">
            {destination}
          </p>
        )}
        <div className="mt-6 w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    </div>
  );
}