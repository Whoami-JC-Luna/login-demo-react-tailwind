import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TEST_USER = { email: "test@test.com", password: "test1234" };
const ANIMATION_MS = 400;

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister?: () => void;
  entering?: boolean;
  exiting?: boolean;
  direction?: "left" | "right";
}

export default function LoginModal({ onClose, onSwitchToRegister, entering, exiting, direction = "left" }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, ANIMATION_MS);
  };

  const fillTestUser = () => {
    setEmail(TEST_USER.email);
    setPassword(TEST_USER.password);
    setError(null);

    if (window.matchMedia("(max-width: 767px)").matches) {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();
      login(data.token, data.user);
      onClose();
      navigate("/dashboard");
    } catch {
      setError("No se pudo iniciar sesión. Revisa tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      onClose();
      navigate("/register");
    }
  };

  const shown = visible && !closing;

  const backdropClass = exiting
    ? "pointer-events-none bg-transparent opacity-100"
    : entering
      ? "bg-black/60 opacity-100"
      : `bg-black/60 ${shown ? "opacity-100" : "opacity-0"}`;

  const exitOffset = direction === "right" ? "translate-x-[120%]" : "-translate-x-[120%]";
  const enterOffset = direction === "right" ? "-translate-x-[120%]" : "translate-x-[120%]";

  const boxTranslateClass = exiting
    ? visible
      ? `opacity-100 ${exitOffset}`
      : "opacity-100 translate-x-0"
    : entering
      ? visible
        ? "opacity-100 translate-x-0"
        : `opacity-100 ${enterOffset}`
      : shown
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95";

  return (
    <div
      className={`fixed inset-0 ${exiting ? "z-40" : "z-50"} flex items-center justify-center p-4 transition-opacity duration-[400ms] ${backdropClass}`}
      onClick={exiting ? undefined : handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-7xl bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] transition-all duration-[500ms] ease-out ${boxTranslateClass}`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-2 right-2 z-10 text-[#1B3A2A] text-xl leading-none hover:opacity-70 active:opacity-70 transition-opacity"
        >
          ✕
        </button>
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] md:min-h-[85vh] max-h-[95vh] overflow-y-auto">
          {/* Bienvenida */}
          <div
            className="relative flex flex-col justify-center text-white bg-cover bg-center px-8 md:px-16 py-12"
            style={{ backgroundImage: "url(/b-login.png)" }}
          >
            <div className="absolute inset-0 bg-[#032b21]/80" />

            <div className="absolute top-6 left-8 md:left-16 z-10 flex items-center gap-6 text-sm text-white">
              <a href="https://github.com/Whoami-JC-Luna/login-demo-react-tailwind" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-70 active:opacity-70 transition-opacity">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/juan-carlos-luna-samaniego" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-70 active:opacity-70 transition-opacity">
                LinkedIn
              </a>
            </div>

            <div className="relative max-w-xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-center">Bienvenido</h2>

              <p className="text-white/90 mb-6 text-lg text-center">
                Este es un proyecto backend que forma parte de mi portfolio. Si te interesa ver cómo está construido,
                puedes echarle un vistazo en mi GitHub, donde encontrarás un README con una visión general de su
                arquitectura y funcionamiento.
              </p>

              <p className="text-white/90 mb-10 text-lg text-center">
                Si inicias sesión como como invitado, encontrarás una frase que espero que te inspire. Explora, busca o descubre
                citas al azar, y crea las tuyas propias si estás registrado.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mx-auto mb-10 w-fit">
                <button
                  type="button"
                  onClick={fillTestUser}
                  className="flex flex-col items-center gap-3 w-45 min-w-0 border border-white/40 rounded-2xl py-7 bg-white/5 hover:bg-white/15 active:bg-white/15 transition-colors backdrop-blur-sm"
                >
                  <span className="text-base">Credenciales</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9">
                    <circle cx="12" cy="8" r="3.5" />
                    <path strokeLinecap="round" d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
                  </svg>
                  <span className="text-base"> Invitado</span>
                </button>

                <button
                  type="button"
                  onClick={goToRegister}
                  className="flex flex-col items-center gap-3 w-45 min-w-0 border border-white/40 rounded-2xl py-7 bg-white/5 hover:bg-white/15 active:bg-white/15 transition-colors backdrop-blur-sm"
                >
                  <span className="text-base">Regístrate</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-9 h-9">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="9" cy="10" r="0.75" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="10" r="0.75" fill="currentColor" stroke="none" />
                    <path strokeLinecap="round" d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
                  </svg>
                  <span className="text-base">Nuevo Usuario</span>
                </button>
              </div>

              <p className="text-white/90 text-lg text-center">
                Puedes dejar un mensaje en mi guestbook público, visible para todos los visitantes.
                Te lo agradecería mucho.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div ref={formRef} className="flex flex-col items-center justify-center px-6 md:px-10 py-12 overflow-y-auto">
            <div className="w-full max-w-sm">
              <h2 className="text-xl md:text-2xl text-center text-[#2F6B4F] mb-6">
                Gracias por llegar hasta aquí
              </h2>

              <p className="text-center text-sm text-gray-600 mb-8">
                Si decides registrarte, puedes utilizar datos ficticios.
                <br />
                El correo electrónico solo tiene que tener un formato válido; no es necesario que sea real.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="modal-email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full border-0 border-b border-gray-300 px-1 py-2 outline-none text-gray-600 focus:border-[#2F6B4F] transition-colors placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70"
                  />
                </div>

                <div>
                  <label htmlFor="modal-password" className="block text-sm font-medium text-gray-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="modal-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Introduce tu contraseña"
                      className="w-full border-0 border-b border-gray-300 px-1 py-2 pr-8 outline-none text-gray-600 focus:border-[#2F6B4F] transition-colors placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 active:text-gray-700"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58a2 2 0 002.83 2.83M9.88 5.09A9.77 9.77 0 0112 5c5 0 9 4 10 7-.5 1.36-1.4 2.79-2.6 4.02M6.53 6.53C4.6 7.86 3.14 9.72 2 12c1 3 5 7 10 7 1.06 0 2.06-.17 3-.47" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1B3A2A] text-white rounded-full py-3 mt-2 hover:bg-[#12281c] active:bg-[#12281c] transition-colors disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Login"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                ¿No tienes una cuenta?{" "}
                <button type="button" onClick={goToRegister} className="text-[#2F6B4F] font-medium hover:underline active:underline">
                  Regístrate aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
