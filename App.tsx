import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import { ConsultationRoom } from './components/ConsultationRoom';
import type { Appointment, Doctor, Promotion, AppSettings } from './types';
import { DENTAL_SERVICES_MAP } from './constants';

// Mock data for initial state
const MOCK_DOCTORS: Doctor[] = [
    { id: 'doc1', name: 'Dr. Ana García', specialty: 'Ortodoncia' },
    { id: 'doc2', name: 'Dr. Carlos Martinez', specialty: 'Endodoncia' },
    { id: 'doc3', name: 'Dr. Sofia Rodriguez', specialty: 'Cirugía Bucal' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'apt1', name: 'Juan Perez', phone: '987654321', email: 'juan.perez@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), service: 'orthodontics', status: 'confirmed', doctorId: 'doc1' },
    { id: 'apt2', name: 'Maria Lopez', phone: '912345678', email: 'maria.lopez@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), service: 'endodontics', status: 'confirmed', doctorId: 'doc2' },
    { id: 'apt3', name: 'Pedro Ramirez', phone: '955555555', email: 'pedro.ramirez@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), service: 'cosmetic_dentistry', status: 'completed', doctorId: 'doc1' },
    { id: 'apt4', name: 'Laura Sanchez', phone: '933333333', email: 'laura.s@email.com', dateTime: new Date(new Date().setDate(new Date().getDate())).toISOString(), service: 'prevention', status: 'waiting', doctorId: 'doc3' },
    { id: 'apt5', name: 'Carlos Gomez', phone: '922222222', email: 'carlos.g@email.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), service: 'restorations', status: 'requested', doctorId: undefined },
];

const MOCK_PROMOTIONS: Promotion[] = [
    { id: 'promo1', title: 'Limpieza Dental 2x1', subtitle: 'Paga una y la segunda es GRATIS', imageUrl: 'https://images.unsplash.com/photo-1629905675717-f6d3b3c0ca60?q=80&w=2070&auto=format&fit=crop', ctaText: 'Agendar Ahora', isActive: true, details: 'Válido para limpiezas profundas.\nAplica para dos personas en la misma visita.\nNo acumulable con otras promociones.' },
    { id: 'promo2', title: 'Blanqueamiento Dental', subtitle: 'Luce una sonrisa más blanca y brillante.', imageUrl: 'https://images.unsplash.com/photo-1606923235213-a4e9b9a61a04?q=80&w=2070&auto=format&fit=crop', ctaText: 'Más Información', isActive: false, details: 'Tratamiento de blanqueamiento profesional en consultorio.' },
];

const MOCK_SETTINGS: AppSettings = {
    clinicName: 'Kiru',
    clinicAddress: 'Av. Sonrisas 123, Lima, Perú',
    clinicPhone: '(+51) 123 456 78',
    clinicEmail: 'info@kiru.com',
    heroImageUrl: 'https://images.unsplash.com/photo-1588776814546-daab701a3512?q=80&w=1974&auto=format&fit=crop',
    loginImageUrl: 'https://images.unsplash.com/photo-1629904850781-2a6d71c1c739?q=80&w=1974&auto=format&fit=crop',
};

type Page = 'landing' | 'login' | 'admin' | 'odontogram';

function App() {
    const [page, setPage] = useState<Page>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
    const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
    const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
    const [settings, setSettings] = useState<AppSettings>(MOCK_SETTINGS);
    const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);

    const handleLogin = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            setPage('admin');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPage('landing');
    };

    const handleBookAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: crypto.randomUUID(),
            status: 'requested',
        };
        setAppointments(prev => [...prev, newAppointment]);
        alert(`¡Solicitud de cita enviada para ${appointmentData.name}!\nServicio: ${DENTAL_SERVICES_MAP[appointmentData.service]}\nFecha y Hora: ${new Date(appointmentData.dateTime).toLocaleString()}\nNos pondremos en contacto para confirmar.`);
    };
    
    const handleViewOdontogram = (patient: Appointment) => {
        setSelectedPatient(patient);
        setPage('odontogram');
    };

    const handleNavigateToAdmin = () => {
        setPage('admin');
        setSelectedPatient(null);
    };

    // --- CRUD Handlers ---

    const handleSaveAppointment = (data: Omit<Appointment, 'id'> & { id?: string }) => {
        setAppointments(prev => {
            if (data.id) {
                return prev.map(a => a.id === data.id ? { ...a, ...data } as Appointment : a);
            }
            return [...prev, { ...data, id: crypto.randomUUID(), status: data.status || 'requested' } as Appointment];
        });
    };
    
    const handleDeleteAppointment = (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta cita?')) {
            setAppointments(prev => prev.filter(a => a.id !== id));
        }
    };
    
    const handleSaveDoctor = (data: Omit<Doctor, 'id'> & { id?: string }) => {
        setDoctors(prev => {
            if (data.id) {
                return prev.map(d => d.id === data.id ? { ...d, ...data } as Doctor : d);
            }
            return [...prev, { ...data, id: crypto.randomUUID() } as Doctor];
        });
    };

    const handleDeleteDoctor = (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este doctor?')) {
            setDoctors(prev => prev.filter(d => d.id !== id));
        }
    };

    const handleSavePromotion = (data: Omit<Promotion, 'id' | 'isActive'> & { id?: string }) => {
        setPromotions(prev => {
            if (data.id) {
                // Find existing promotion to preserve its isActive status if not changed
                const existingPromo = prev.find(p => p.id === data.id);
                const isActive = existingPromo ? existingPromo.isActive : false;
                return prev.map(p => p.id === data.id ? { ...p, ...data, isActive } as Promotion : p);
            }
            return [...prev, { ...data, id: crypto.randomUUID(), isActive: false } as Promotion];
        });
    };

     const togglePromotionStatus = (id: string) => {
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : { ...p, isActive: false }));
    };

    const handleDeletePromotion = (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta promoción?')) {
            setPromotions(prev => prev.filter(p => p.id !== id));
        }
    };
    
    const activePromotion = promotions.find(p => p.isActive) || null;

    if (page === 'landing') {
        return <LandingPage onBookAppointment={handleBookAppointment} settings={settings} onNavigateToLogin={() => setPage('login')} activePromotion={activePromotion} />;
    }

    if (page === 'login') {
        return <LoginPage onLogin={handleLogin} onNavigateToLanding={() => setPage('landing')} settings={settings} />;
    }

    if (page === 'admin' && isAuthenticated) {
        return <AdminPage 
            appointments={appointments}
            doctors={doctors}
            promotions={promotions}
            settings={settings}
            onSaveAppointment={handleSaveAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onSaveDoctor={handleSaveDoctor}
            onDeleteDoctor={handleDeleteDoctor}
            onSavePromotion={handleSavePromotion}
            onDeletePromotion={handleDeletePromotion}
            onTogglePromotionStatus={togglePromotionStatus}
            setSettings={setSettings}
            onLogout={handleLogout}
            onViewOdontogram={handleViewOdontogram}
        />;
    }
    
    if (page === 'odontogram' && isAuthenticated) {
        return <ConsultationRoom
            allAppointments={appointments}
            isAuthenticated={isAuthenticated} 
            onNavigateToAdmin={handleNavigateToAdmin} 
            patient={selectedPatient} 
        />;
    }
    
    return null;
}

export default App;