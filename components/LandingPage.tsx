import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { DentalIcon, PreventionIcon, FillingIcon, EndodonticsIcon, OrthodonticsIcon, OralSurgeryIcon, CosmeticDentistryIcon, TeamIcon, AppointmentIcon, EmergencyIcon, ClockIcon, GiftIcon, CloseIcon, CheckIcon } from './icons';
import { AppointmentForm } from './AppointmentForm';
import type { Appointment, AppSettings, Promotion } from '../types';


interface LandingPageProps {
  onBookAppointment: (appointmentData: Omit<Appointment, 'id' | 'status'>) => void;
  settings: AppSettings;
  onNavigateToLogin: () => void;
  activePromotion: Promotion | null;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.05, translateY: -10 }}
        className="bg-white p-8 rounded-2xl shadow-xl shadow-brand-900/5 border border-brand-100 text-center flex flex-col items-center justify-center relative overflow-hidden group"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="w-16 h-16 mx-auto mb-6 text-brand-500 relative z-10 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold mb-3 text-brand-900 relative z-10">{title}</h3>
        <p className="text-brand-700/80 leading-relaxed relative z-10">{description}</p>
    </motion.div>
);


const ServiceCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({icon, title, description}) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.05, translateY: -10 }}
        className="bg-white p-8 rounded-2xl shadow-xl shadow-brand-900/5 border border-brand-100 transform text-center relative overflow-hidden group"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="w-16 h-16 mx-auto mb-6 text-brand-600 relative z-10 transform group-hover:rotate-6 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold mb-3 text-brand-900 relative z-10">{title}</h3>
        <p className="text-brand-700/80 relative z-10">{description}</p>
    </motion.div>
);

const PromotionModal: React.FC<{
    onClose: () => void;
    onBook: () => void;
    promotion: Promotion;
}> = ({onClose, onBook, promotion}) => (
    <div className="fixed inset-0 bg-brand-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-slate-500 hover:text-brand-900 transition-all z-10 bg-white rounded-full p-2.5 shadow-xl hover:bg-brand-50 hover:scale-110 border border-slate-200"
                aria-label="Cerrar promoción"
            >
                <CloseIcon />
            </button>
            <div className="md:grid md:grid-cols-2 h-full">
                <div className="hidden md:block bg-cover bg-center h-64 md:h-auto" style={{backgroundImage: `url('${promotion.imageUrl}')`}}>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center bg-brand-50 text-brand-900">
                    <motion.div 
                        initial={{ rotate: -15, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-14 h-14 mb-6 text-brand-500 bg-white p-3 rounded-2xl shadow-sm"
                    >
                        <GiftIcon />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-brand-800 leading-tight">{promotion.title}</h2>
                    <p className="text-lg md:text-xl font-medium mb-8 text-brand-700/90" dangerouslySetInnerHTML={{ __html: promotion.subtitle.replace('GRATIS', '<span class="text-brand-600 font-black">GRATIS</span>') }} />

                    <div className="text-left mb-8 bg-white/60 p-6 rounded-2xl border border-white">
                        <ul className="space-y-4 text-brand-800 font-medium">
                           {promotion.details.split('\n').map((detail, index) => (
                                <motion.li 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.1) }}
                                    key={index} 
                                    className="flex items-start"
                                >
                                    <span className="text-brand-500 mr-3 mt-0.5 w-5 h-5 flex-shrink-0"><CheckIcon /></span>
                                    <span>{detail}</span>
                                </motion.li>
                           ))}
                        </ul>
                    </div>

                    <p className="text-sm font-bold text-brand-600/80 mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
                        ¡Cupos muy limitados!
                    </p>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            onBook();
                            onClose();
                        }} 
                        className="bg-brand-600 text-white px-8 py-4 rounded-full hover:bg-brand-500 font-bold shadow-lg shadow-brand-600/20 transition-all duration-300 w-full text-lg"
                    >
                        {promotion.ctaText}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    </div>
);

const happyClients = [
  {
    id: 1,
    name: "Gabriela Mendoza",
    treatment: "Diseño de Sonrisa",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Carlos Villacorta",
    treatment: "Blanqueamiento Láser",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Mariana Rojas",
    treatment: "Ortodoncia Invisible",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Diego Alessandro",
    treatment: "Implante de Titanio",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Vanessa Luján",
    treatment: "Carillas de Porcelana",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Renzo Valdivia",
    treatment: "Rehabilitación Oral",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
  }
];

// Duplicate list for a completely seamless loop on any screen resolution
const duplicatedClients = [...happyClients, ...happyClients];

const SmiliesSlider: React.FC = () => {
  return (
    <div className="bg-brand-950 py-8 overflow-hidden relative border-y border-brand-800">
      {/* Ambient gradient fading on edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-brand-950 via-brand-950/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-brand-950 via-brand-950/80 to-transparent z-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-bold text-brand-300 uppercase tracking-widest">Nuestra Mayor Satisfacción</span>
        </div>
        <h3 className="text-sm font-bold text-white tracking-wider uppercase opacity-90">Kiru Dental — Historias de Éxito Reales</h3>
      </div>

      <div className="flex w-full overflow-hidden">
        <motion.div 
          className="flex gap-6 shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 25,
            repeat: Infinity,
          }}
        >
          {duplicatedClients.map((client, idx) => (
            <div 
              key={`${client.id}-${idx}`}
              className="flex items-center gap-4 bg-brand-900/40 backdrop-blur-md border border-brand-800/40 rounded-full pl-3 pr-6 py-2 shrink-0 shadow-lg shadow-black/10 hover:border-brand-500/50 hover:bg-brand-900 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative shrink-0">
                <img 
                  className="w-12 h-12 rounded-full object-cover border-2 border-brand-400 group-hover:border-emerald-400 transition-colors shadow-inner" 
                  src={client.imageUrl} 
                  alt={client.name} 
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 border border-brand-950">
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </span>
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors uppercase tracking-tight">{client.name}</h4>
                <p className="text-[11px] text-brand-300 font-medium">{client.treatment}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


export const LandingPage: React.FC<LandingPageProps> = ({ onBookAppointment, settings, onNavigateToLogin, activePromotion }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  
  useEffect(() => {
    if (!activePromotion) return;

    const promoSeenKey = `promoSeen_${activePromotion.id}`;
    const hasSeenPromo = sessionStorage.getItem(promoSeenKey);
    
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setShowPromotion(true);
        sessionStorage.setItem(promoSeenKey, 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activePromotion]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans">
      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto">
            <motion.nav 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-6 py-3 flex justify-between items-center"
            >
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 text-brand-600"><DentalIcon /></div>
                <h1 className="text-2xl font-bold text-brand-900">Kiru</h1>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Inicio</a>
                <a href="#about" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Sobre Nosotros</a>
                <a href="#services" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Servicios</a>
                <a href="#contact" className="text-gray-600 hover:text-brand-600 transition-colors font-medium">Contacto</a>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="hidden md:block bg-brand-500 text-white px-5 py-2 rounded-full hover:bg-brand-600 font-semibold shadow-md transition-all transform hover:scale-105 hover:shadow-brand-500/30">
                Agenda tu Cita
              </button>
            </motion.nav>
        </div>
      </header>

      <main>
        <section id="home" className="bg-brand-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/90 to-transparent"></div>
            <div className="container mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:w-1/2 z-10 text-center md:text-left"
              >
                <h2 className="text-4xl lg:text-6xl font-extrabold mb-4 leading-tight text-white tracking-tight">
                    Tu Sonrisa, <br/><span className="text-brand-300">Nuestra Pasión.</span>
                </h2>
                <p className="mb-8 text-brand-100 max-w-lg mx-auto md:mx-0 text-lg leading-relaxed">
                 Descubre una experiencia dental diferente. En Kiru, combinamos tecnología de punta con un trato cálido y personalizado para que te sientas como en casa.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-brand-500 text-white px-10 py-4 text-lg rounded-full hover:bg-brand-400 font-semibold shadow-lg shadow-brand-500/30 transition-colors duration-300"
                  >
                    Agendar Cita Ahora
                  </motion.button>
                  <motion.a 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#about" 
                    className="border-2 border-brand-300/30 text-brand-50 px-10 py-4 text-lg rounded-full hover:bg-white hover:text-brand-900 font-semibold transition-colors duration-300 text-center backdrop-blur-sm"
                  >
                    Saber Más
                  </motion.a>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.4, type: "spring" }}
                className="md:w-1/2 mt-16 md:mt-0 flex justify-center items-center z-10 relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-400 to-brand-300 opacity-30 blur-2xl rounded-full"></div>
                <img className="rounded-3xl shadow-2xl max-w-md w-full h-[500px] object-cover relative z-10 border-4 border-white/10" src={settings.heroImageUrl} alt="Dentista profesional atendiendo a un paciente con una sonrisa" />
              </motion.div>
            </div>
        </section>
        
        <section id="features" className="py-24 bg-brand-50/50">
            <div className="container mx-auto px-6">
                 <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                      visible: { transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                 >
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
                 </motion.div>
            </div>
        </section>

        <SmiliesSlider />

        <section id="about" className="bg-white py-24">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2"
                >
                    <div className="relative group overflow-hidden rounded-3xl border-4 border-slate-100 shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300 z-10"></div>
                        <img 
                            className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700" 
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop" 
                            alt="Instalaciones de Kiru Dental" 
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                            <span className="bg-brand-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Tecnología de Vanguardia</span>
                            <h4 className="text-xl font-bold font-sans">Nuestras Instalaciones</h4>
                            <p className="text-white/80 text-sm">Ambientes modernos y esterilizados para tu total comodidad y tranquilidad.</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="md:w-1/2 text-center md:text-left"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-brand-900 mb-4">Bienvenido a la Familia Kiru</h2>
                    <p className="text-brand-700/80 mb-6 leading-relaxed">
                        En Kiru Dental, representamos todo lo que la odontología moderna debería ser. Hemos mejorado la temida cita con el dentista y la hemos transformado en una experiencia relajante y de confianza. Nuestro equipo de profesionales está dedicado no solo a la salud de tu boca, sino también a tu comodidad y bienestar general.
                    </p>
                    <a href="#contact" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors flex items-center justify-center md:justify-start gap-2">
                        Contáctanos <span className="text-xl">&rarr;</span>
                    </a>
                </motion.div>
            </div>
        </section>

        <section id="services" className="bg-brand-50/50 py-24">
          <div className="container mx-auto px-6">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center mb-12"
             >
                <h2 className="text-3xl lg:text-4xl font-bold text-brand-900">Nuestros Servicios Odontológicos</h2>
                <p className="text-brand-700/80 mt-2 max-w-2xl mx-auto">Nuestro objetivo es tratar y prevenir enfermedades que afectan a dientes, encías y mandíbula, contribuyendo a una sonrisa saludable y a tu bienestar general.</p>
            </motion.div>
            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
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
            </motion.div>
          </div>
        </section>
      </main>

       <footer id="contact" className="bg-brand-900 text-white py-16">
            <div className="container mx-auto px-6 text-center">
                 <motion.h2 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="text-3xl font-bold mb-4"
                 >
                     Contáctanos
                 </motion.h2>
                 <p className="text-brand-100 mb-8 max-w-xl mx-auto">¿Listo para transformar tu sonrisa? Agenda una cita o contáctanos para más información.</p>
                 <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8 text-brand-50">
                    <span>Email: <a href="mailto:info@kiru.com" className="hover:text-brand-300 transition-colors">info@kiru.com</a></span>
                    <span>Teléfono: <a href="tel:+5112345678" className="hover:text-brand-300 transition-colors">(+51) 123 456 78</a></span>
                    <span>Dirección: Av. Sonrisas 123, Lima, Perú</span>
                 </div>
                <p className="text-slate-400 mt-8">&copy; {new Date().getFullYear()} Clínica Dental Kiru. Todos los derechos reservados.</p>
                 <div className="mt-6">
                    <button 
                        onClick={onNavigateToLogin} 
                        className="border border-slate-600 hover:border-slate-500 hover:bg-slate-700 text-slate-400 font-semibold py-2 px-5 rounded-full transition-colors text-xs uppercase tracking-wider"
                    >
                        Admin Login
                    </button>
                </div>
            </div>
        </footer>

        {showPromotion && activePromotion && <PromotionModal onClose={() => setShowPromotion(false)} onBook={() => setIsModalOpen(true)} promotion={activePromotion} />}
        {isModalOpen && <AppointmentForm onClose={() => setIsModalOpen(false)} onBookAppointment={onBookAppointment} />}
    </div>
  );
};