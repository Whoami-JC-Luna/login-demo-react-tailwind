import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePageTransition } from "../../context/TransitionContext";
import Container from "./Container";
import logo from "../../assets/mi-logo.png";

interface NavbarProps {
  variant: "landing" | "auth" | "dashboard";
  onAccessClick?: () => void;
}

export default function Navbar({ variant, onAccessClick }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { navigateTo } = usePageTransition();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-gray-300 px-4 py-6 md:p2 relative">
      <Container>
        {/* Desktop */}
        <div className="hidden md:grid grid-cols-12 gap-5 items-center">
          <div className="col-span-3">
            <img src={logo} alt="JC Luna" className="h-12 w-auto" />
          </div>
          <div className="col-start-8 col-span-3 flex justify-end items-center gap-10 text-[#012E40]">
            <a href="https://github.com/Whoami-JC-Luna" target="_blank" className="text-sm hover:underline">GitHub</a>
            <a href="https://www.linkedin.com/in/juan-carlos-luna-samaniego" target="_blank" className="text-sm hover:underline">LinkedIn</a>
            <a href="mailto:jcluna.tech@gmail.com" className="text-sm hover:underline">Contacto</a>
          </div>
          <div className="col-start-11 col-span-2 flex justify-end">
            {variant === "landing" && (
              <button onClick={() => onAccessClick?.()} className="bg-[#026773] text-white rounded-2xl px-4 py-2 text-sm hover:bg-cyan-950 transition-colors">
                Acceder a la demo
              </button>
            )}
            {variant === "auth" && (
              <button onClick={() => navigateTo("/", "Home")} className="text-sm hover:underline">← Volver</button>
            )}
            {variant === "dashboard" && (
              <button onClick={handleLogout} className="text-sm hover:underline">Logout</button>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center justify-between">
          <img src={logo} alt="JC Luna" className="h-10 w-auto" />

          <div className="flex items-center gap-4">
            {variant === "auth" && (
              <button onClick={() => navigateTo("/", "Home")} className="text-sm hover:underline">← Volver</button>
            )}
            {variant === "dashboard" && (
              <button onClick={handleLogout} className="text-sm hover:underline">Logout</button>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col gap-1.5 p-1">
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-gray-800 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu desplegable */}
        {menuOpen && (
          <div className="md:hidden flex flex-col gap-4 pt-4 pb-2 border-t border-gray-200 mt-4">
            <a href="https://github.com/Whoami-JC-Luna" target="_blank" className="text-sm hover:underline text-[#012E40]">GitHub</a>
            <a href="https://www.linkedin.com/in/juan-carlos-luna-samaniego" target="_blank" className="text-sm hover:underline text-[#012E40]">LinkedIn</a>
            <a href="mailto:jcluna.tech@gmail.com" className="text-sm hover:underline text-[#012E40]">Contacto</a>
          </div>
        )}
      </Container>
    </nav>
  );
}