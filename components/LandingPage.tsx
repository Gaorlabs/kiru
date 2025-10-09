import React, { useState } from 'react';
import { DentalIcon, PreventionIcon, FillingIcon, EndodonticsIcon, OrthodonticsIcon, OralSurgeryIcon, CosmeticDentistryIcon, TeamIcon } from './icons';
import { AppointmentForm } from './AppointmentForm';
import type { Appointment } from '../types';

interface LandingPageProps {
  onBookAppointment: (appointmentData: Omit<Appointment, 'id'>) => void;
}

const ServiceCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <div className="bg-white p-8 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300 text-center">
        <div className="w-16 h-16 mx-auto mb-6 text-pink-500">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onBookAppointment }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 text-blue-600"><DentalIcon /></div>
            <h1 className="text-2xl font-bold text-slate-900">Kiru</h1>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">Inicio</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Sobre Nosotros</a>
            <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">Servicios</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="hidden md:block bg-pink-600 text-white px-5 py-2 rounded-md hover:bg-pink-700 font-semibold shadow-md transition-all transform hover:scale-105">
            Agenda tu Cita
          </button>
        </nav>
      </header>

      <main>
        <section id="home" className="bg-blue-700 text-white" style={{backgroundImage: 'linear-gradient(to right, #1e3a8a, #3b82f6)'}}>
            <div className="container mx-auto px-6 py-28 flex flex-col md:flex-row items-center relative">
              <div className="md:w-1/2 z-10 text-center md:text-left">
                <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">Mejor Vida a Través de una Mejor Odontología</h2>
                <p className="mb-8 text-blue-200 max-w-lg mx-auto md:mx-0">
                  Únete a nosotros en un ambiente dental amigable y profesional. Nos dedicamos a devolverte la sonrisa que mereces.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                  <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-8 py-3 rounded-md hover:bg-pink-700 font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300">
                    Agenda tu Cita
                  </button>
                  <a href="#about" className="border-2 border-white/80 text-white px-8 py-3 rounded-md hover:bg-white hover:text-blue-700 font-semibold transition-colors duration-300 text-center">
                    Saber Más
                  </a>
                </div>
              </div>
              <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center items-center z-10">
                <div className="w-72 h-72 lg:w-96 lg:h-96 relative text-white/50">
                     <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
                     <DentalIcon />
                </div>
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

       <footer id="contact" className="bg-slate-800 text-white py-16">
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
        {isModalOpen && <AppointmentForm onClose={() => setIsModalOpen(false)} onBookAppointment={onBookAppointment} />}
    </div>
  );
};
