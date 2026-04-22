import { useState } from "react";
import SplashScreen from "./components/ui/SplashScreen";
import AppRouter from "./router/AppRouter";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen onFinished={() => setShowSplash(false)} />
      )}
      {!showSplash && <AppRouter />}
    </>
  );
}