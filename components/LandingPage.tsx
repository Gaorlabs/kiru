
import React, { useState, useEffect } from 'react';
import { DentalIcon, PreventionIcon, FillingIcon, EndodonticsIcon, OrthodonticsIcon, OralSurgeryIcon, CosmeticDentistryIcon, TeamIcon, AppointmentIcon, EmergencyIcon, ClockIcon, GiftIcon, SettingsIcon, CloseIcon, UserIcon, PasswordIcon } from './icons';
import { AppointmentForm } from './AppointmentForm';
import type { Appointment } from '../types';

interface LandingPageProps {
  onBookAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
}

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200/80 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <div className="w-16 h-16 mx-auto mb-6 text-pink-500">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
);


const ServiceCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <div className="bg-white p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 text-center">
        <div className="w-16 h-16 mx-auto mb-6 text-blue-500">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const PromotionModal: React.FC<{onClose: () => void, onBook: () => void}> = ({onClose, onBook}) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl w-full max-w-md text-white overflow-hidden transform animate-scale-in">
            <div className="p-8 text-center relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
                <div className="w-20 h-20 mx-auto mb-4 text-yellow-300 animate-bounce">
                    <GiftIcon />
                </div>
                <h2 className="text-3xl font-extrabold mb-2">¡Promoción Especial de Octubre!</h2>
                <p className="text-lg font-semibold mb-4 text-white/90">¡Tu Diagnóstico Dental Completo es GRATIS!</p>
                <p className="mb-6">
                    Durante todo el mes de Octubre, obtén un chequeo dental completo sin costo alguno. ¡No dejes pasar esta oportunidad de cuidar tu sonrisa!
                </p>
                <button 
                    onClick={() => {
                        onBook();
                        onClose();
                    }} 
                    className="bg-yellow-400 text-purple-700 px-8 py-3 rounded-full hover:bg-yellow-300 font-bold shadow-lg transform hover:scale-105 transition-all duration-300 w-full"
                >
                    ¡Agendar mi Diagnóstico Gratis!
                </button>
            </div>
        </div>
        <style>{`
            @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
            .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            @keyframes scale-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
        `}</style>
    </div>
);

const AdminPanel: React.FC<{onClose: () => void}> = ({onClose}) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col transform animate-scale-in">
             <div className="p-4 flex justify-between items-center border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Panel de Administrador</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 w-8 h-8">
                    <CloseIcon />
                </button>
            </div>
            <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 bg-slate-100 p-3 rounded-lg">Esta es una vista previa del panel de administrador. Desde aquí, podrías editar el contenido de la página, gestionar citas y ver analíticas.</p>
                <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Usuario</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 w-10"><UserIcon /></div>
                        <input type="text" placeholder="admin" className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-11 pr-4 text-slate-900" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Contraseña</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 w-10"><PasswordIcon /></div>
                        <input type="password" placeholder="••••••••" className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-11 pr-4 text-slate-900" />
                    </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                    Iniciar Sesión
                </button>
            </div>
        </div>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onBookAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('promoSeen');
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setShowPromotion(true);
        sessionStorage.setItem('promoSeen', 'true');
      }, 1500); // Show promo after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans">
      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto">
            <nav className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-6 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 text-blue-600"><DentalIcon /></div>
                <h1 className="text-2xl font-bold text-slate-900">Kiru</h1>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Inicio</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Sobre Nosotros</a>
                <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Servicios</a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contacto</a>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="hidden md:block bg-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 font-semibold shadow-md transition-all transform hover:scale-105">
                Agenda tu Cita
              </button>
            </nav>
        </div>
      </header>

      <main>
        <section id="home" className="bg-blue-900 text-white overflow-hidden">
            <div className="container mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center relative">
              <div className="md:w-1/2 z-10 text-center md:text-left">
                <h2 className="text-4xl lg:text-6xl font-extrabold mb-4 leading-tight">Tu Sonrisa, Nuestra Pasión.</h2>
                <p className="mb-8 text-blue-200 max-w-lg mx-auto md:mx-0 text-lg">
                  Descubre una experiencia dental diferente. En Kiru, combinamos tecnología de punta con un trato cálido y personalizado para que te sientas como en casa.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                  <button onClick={() => setIsModalOpen(true)} className="bg-pink-500 text-white px-10 py-4 text-lg rounded-full hover:bg-pink-600 font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300">
                    Agendar Cita Ahora
                  </button>
                  <a href="#about" className="border-2 border-white/80 text-white px-10 py-4 text-lg rounded-full hover:bg-white hover:text-blue-700 font-semibold transition-colors duration-300 text-center">
                    Saber Más
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center items-center z-10">
                <img className="rounded-3xl shadow-2xl max-w-md w-full" src="https://images.unsplash.com/photo-1629904851222-19d3f024c0d0?q=80&w=2070&auto=format&fit=crop" alt="Dentista profesional atendiendo a un paciente con una sonrisa" />
              </div>
            </div>
        </section>
        
        <section id="features" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<AppointmentIcon />}
                        title="Cita Fácil"
                        description="Agenda tu cita en línea en menos de un minuto con nuestro sistema simplificado."
                    />
                    <FeatureCard
                        icon={<EmergencyIcon />}
                        title="Servicio de Emergencia"
                        description="Atendemos urgencias dentales para aliviar tu dolor lo más pronto posible."
                    />
                    <FeatureCard
                        icon={<ClockIcon />}
                        title="Servicio 24/7"
                        description="Nuestra plataforma está disponible a toda hora para que gestiones tus citas cuando prefieras."
                    />
                 </div>
            </div>
        </section>

        <section id="about" className="bg-white py-24">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 text-blue-600">
                    <div className="max-w-md mx-auto">
                       <TeamIcon />
                    </div>
                </div>
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Bienvenido a la Familia Kiru</h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        En Kiru Dental, representamos todo lo que la odontología moderna debería ser. Hemos mejorado la temida cita con el dentista y la hemos transformado en una experiencia relajante y de confianza. Nuestro equipo de profesionales está dedicado no solo a la salud de tu boca, sino también a tu comodidad y bienestar general.
                    </p>
                    <a href="#contact" className="text-pink-600 hover:text-pink-700 font-semibold transition-colors">
                        Contáctanos &rarr;
                    </a>
                </div>
            </div>
        </section>

        <section id="services" className="bg-slate-50 py-24">
          <div className="container mx-auto px-6">
             <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Nuestros Servicios Odontológicos</h2>
                <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Nuestro objetivo es tratar y prevenir enfermedades que afectan a dientes, encías y mandíbula, contribuyendo a una sonrisa saludable y a tu bienestar general.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <ServiceCard 
                    icon={<PreventionIcon />}
                    title="Prevención y Diagnóstico"
                    description="Limpiezas, exámenes de rutina y detección temprana de problemas para mantener tu salud bucal."
                />
                <ServiceCard 
                    icon={<FillingIcon />}
                    title="Restauraciones"
                    description="Reparación de dientes dañados mediante empastes (obturaciones) y coronas de alta calidad."
                />
                <ServiceCard 
                    icon={<EndodonticsIcon />}
                    title="Endodoncia"
                    description="Tratamientos de conducto para salvar dientes severamente dañados, aliviando el dolor y preservando la pieza."
                />
                 <ServiceCard 
                    icon={<OrthodonticsIcon />}
                    title="Ortodoncia"
                    description="Corrección de la posición de los dientes y la mordida para una sonrisa funcional y estéticamente agradable."
                />
                <ServiceCard 
                    icon={<OralSurgeryIcon />}
                    title="Cirugía Bucal"
                    description="Procedimientos quirúrgicos, incluyendo la extracción de muelas del juicio, realizados por expertos."
                />
                 <ServiceCard 
                    icon={<CosmeticDentistryIcon />}
                    title="Estética Dental"
                    description="Mejora la apariencia de tu sonrisa con blanqueamientos, carillas y otros tratamientos cosméticos."
                />
            </div>
          </div>
        </section>
      </main>

       <footer id="contact" className="bg-blue-900 text-white py-16">
            <div className="container mx-auto px-6 text-center">
                 <h2 className="text-3xl font-bold mb-4">Contáctanos</h2>
                 <p className="text-slate-300 mb-8 max-w-xl mx-auto">¿Listo para transformar tu sonrisa? Agenda una cita o contáctanos para más información.</p>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8 text-slate-200">
                    <span>Email: <a href="mailto:info@kiru.com" className="hover:text-pink-400">info@kiru.com</a></span>
                    <span>Teléfono: <a href="tel:+5112345678" className="hover:text-pink-400">(+51) 123 456 78</a></span>
                    <span>Dirección: Av. Sonrisas 123, Lima, Perú</span>
                 </div>
                <p className="text-slate-400 mt-8">&copy; {new Date().getFullYear()} Clínica Dental Kiru. Todos los derechos reservados.</p>
            </div>
        </footer>

        {showPromotion && <PromotionModal onClose={() => setShowPromotion(false)} onBook={() => setIsModalOpen(true)} />}
        {isModalOpen && <AppointmentForm onClose={() => setIsModalOpen(false)} onBookAppointment={onBookAppointment} />}
        {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
        
        <button 
            onClick={() => setShowAdminPanel(true)}
            className="fixed bottom-5 right-5 bg-slate-700 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-colors z-40"
            title="Panel de Administrador"
        >
          <div className="w-6 h-6"><SettingsIcon /></div>
        </button>
    </div>
  );
};
