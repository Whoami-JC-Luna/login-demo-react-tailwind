import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ANIMATION_MS = 400;

interface RegisterModalProps {
  onClose: () => void;
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className={`text-xs flex items-center justify-end gap-1 ${ok ? "text-[#2F6B4F]" : "text-gray-400"}`}>
      {label}
      {ok ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 shrink-0">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12.5l2.5 2.5 4.5-5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3 h-3 shrink-0">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M9 9l6 6M15 9l-6 6" />
        </svg>
      )}
    </p>
  );
}

export default function RegisterModal({ onClose }: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

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

  const isUsernameValid = username.length >= 4 && username.length <= 10;
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isUsernameValid || !hasMinLength || !hasUppercase || !hasNumber || !hasSpecialChar) {
      setError("Revisa que el usuario y la contraseña cumplan los requisitos.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) throw new Error("No se pudo completar el registro");

      const data = await res.json();
      login(data.token, data.user);
      onClose();
      navigate("/dashboard");
    } catch {
      setError("No se pudo completar el registro. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    onClose();
    navigate("/login");
  };

  const shown = visible && !closing;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity duration-[400ms] ${shown ? "opacity-100" : "opacity-0"
        }`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-7xl bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] transition-all duration-[400ms] ${shown ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 text-white bg-black/25 hover:bg-black/45 active:bg-black/45 rounded-full w-9 h-9 flex items-center justify-center transition-colors"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 md:min-h-[85vh] max-h-[95vh] overflow-y-auto">
          {/* Formulario */}
          <div className="flex flex-col items-center justify-center px-6 md:px-14 py-12 overflow-y-auto">
            <div className="w-full max-w-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-[#316987] mb-6">
                Lo hacemos sencillo ?
              </h2>

              <p className="text-sm text-gray-600 mb-8">
                Solo necesitas los siguientes datos para registrarte:
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="register-username" className="block text-sm font-medium text-gray-800 mb-1">
                    Nombre de usuario
                  </label>
                  <input
                    id="register-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Introduce tu nombre de usuario"
                    className="w-full border-0 border-b border-gray-300 px-1 py-2 outline-none text-gray-600 focus:border-[#2F6B4F] transition-colors placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70"
                  />
                  <div className="mt-1">
                    <Check ok={isUsernameValid} label="De 4 a 10 caracteres" />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce tu email"
                    className="w-full border-0 border-b border-gray-300 px-1 py-2 outline-none text-gray-600 focus:border-[#2F6B4F] transition-colors placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70"
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-800 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
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
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
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

                <div>
                  <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-800 mb-1">
                    Confirma contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Introduce tu contraseña"
                      className="w-full border-0 border-b border-gray-300 px-1 py-2 pr-8 outline-none text-gray-600 focus:border-[#2F6B4F] transition-colors placeholder:text-sm placeholder:text-gray-400 placeholder:opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
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

                <div className="flex flex-col gap-1">
                  <Check ok={hasMinLength} label="8 caracteres mínimo" />
                  <Check ok={hasUppercase} label="Una mayúscula" />
                  <Check ok={hasNumber} label="Un número" />
                  <Check ok={hasSpecialChar} label="Un carácter especial" />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#316987] text-white rounded-full py-3 mt-2 hover:bg-[#244f66] active:bg-[#244f66] transition-colors disabled:opacity-60"
                >
                  {loading ? "Creando cuenta..." : "Registrarse"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                ¿Ya tienes una cuenta?{" "}
                <button type="button" onClick={goToLogin} className="text-[#316987] font-medium hover:underline active:underline">
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>

          {/* Imagen */}
          <div
            className="relative flex flex-col bg-cover bg-center px-8 md:px-14 py-8"
            style={{ backgroundImage: "url(/b-registro.png)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent to-55%" />

            <div className="relative flex items-center justify-between text-sm text-white">
              <button type="button" onClick={handleClose} className="underline-offset-4 hover:underline active:underline">
                ← Volver
              </button>
              <div className="flex gap-6">
                <a href="https://www.linkedin.com/in/juan-carlos-luna-samaniego" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-70 active:opacity-70 transition-opacity">
                  LinkedIn
                </a>
                <a href="https://github.com/Whoami-JC-Luna/login-demo-react-tailwind" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:opacity-70 active:opacity-70 transition-opacity">
                  GitHub
                </a>
              </div>
            </div>

            <div className="relative mt-auto pt-20">
              <p className="text-center text-lg text-white/90">
                La autenticación utiliza JWT con tokens firmados y expiración definida. Las contraseñas
                se almacenan mediante BCrypt y la autorización se gestiona íntegramente en el backend.
                El correo puede ser ficticio, siempre que cumpla las validaciones de seguridad y formato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
