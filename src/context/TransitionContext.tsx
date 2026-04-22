import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "../components/ui/SplashScreen";

interface TransitionContextType {
  navigateTo: (path: string, label: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [transition, setTransition] = useState<{ path: string; label: string } | null>(null);
  const navigate = useNavigate();

  const navigateTo = (path: string, label: string) => {
    setTransition({ path, label });
  };

  const handleFinished = () => {
    const path = transition!.path;
    setTransition(null);
    navigate(path);
  };

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {transition ? (
        <SplashScreen
          onFinished={handleFinished}
          destination={transition.label}
        />
      ) : (
        children
      )}
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used inside TransitionProvider");
  return ctx;
}