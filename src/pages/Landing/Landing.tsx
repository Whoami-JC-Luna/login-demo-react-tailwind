import { useNavigate } from "react-router-dom";
import Navbar from "../../components/ui/Navbar";
import Guestbook from "../../components/ui/Guestbook";
import Container from "../../components/ui/Container";
import heroImage from "../../assets/landing.jpg";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="absolute inset-0 bg-[#e6dfd77e] md:bg-[#dfd1bf4c]" />
      <Container>
        <Navbar variant="landing" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:min-h-[calc(100vh-95px)]">
          {/* Hero */}
          <div className="col-span-1 md:col-start-1 md:col-span-5 flex flex-col justify-start pt-16 md:pt-30 px-6 md:px-0 min-h-[82vh] md:min-h-0">
            <h1 className="animate-fade-up font-aldrich text-4xl md:text-6xl font-bold mb-4 text-[#024959]">
              Spring Boot - JWT
            </h1>
            <p className="animate-fade-up delay-100 text-lg text-gray-600 mb-15">
              API de Autenticación Segura
            </p>
            <p className="animate-fade-up delay-200 max-w-md text-lg mb-8">
              Backend construido con Spring Boot 3.5 y autenticación JWT stateless. Contraseñas hasheadas con BCrypt, roles gestionados server-side y acceso a recursos validado por ownership.
            </p>
            <p className="animate-fade-up delay-200 max-w-md text-lg mb-8">
              OWASP Top 10 2025 aplicado.
            </p>
            <p className="animate-fade-up delay-300 max-w-md text-lg mb-10 md:mb-20">
              No te olvides de firmar el guestbook.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="animate-fade-up delay-10 text-white bg-[#096772] rounded-4xl px-8 py-4 w-fit text-l hover:bg-cyan-950 hover:scale-105 transition-all mb-5 md:mb-0"
            >
              Acceder a la demo
            </button>

            <div className="md:hidden flex justify-center items-center py-4 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#024959] opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <p className="text-[12px] md:text-[16px] text-gray-500 mb-1 md:mb-auto md:mt-30 text-left">
              ©{new Date().getFullYear()} Designed & developed by <span className="text-[#026773] font-medium">Juan Carlos Luna.</span>
            </p>
          </div>





          {/* Guestbook */}
          <div className="col-span-1 md:col-start-8 md:col-span-5 border-t md:border-t-0 md:border-l border-gray-300 animate-fade-up delay-500">
            <Guestbook />
          </div>
        </div>
      </Container>
    </div>
  );
}