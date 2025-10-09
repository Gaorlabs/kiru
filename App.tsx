import React, { useState } from 'react';
import { OdontogramApp } from './components/OdontogramApp';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import type { Appointment, AppSettings, Promotion, Doctor } from './types';

// Mock Data
const initialDoctors: Doctor[] = [
    { id: 'doc1', name: 'Dr. Alejandro Vargas', specialty: 'Odontología General' },
    { id: 'doc2', name: 'Dra. Sofia Castillo', specialty: 'Ortodoncia' },
];

const initialAppointments: Appointment[] = [
    { id: '1', name: 'Carlos Sanchez', phone: '987654321', email: 'carlos.s@example.com', dateTime: new Date(new Date().setDate(new Date().getDate())).toISOString(), service: 'restorations', status: 'confirmed', doctorId: 'doc1' },
    { id: '2', name: 'Maria Rodriguez', phone: '912345678', email: 'maria.r@example.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), service: 'orthodontics', status: 'confirmed', doctorId: 'doc2' },
];

const initialSettings: AppSettings = {
    clinicName: "Kiru",
    clinicAddress: "Av. Sonrisas 123, Lima, Perú",
    clinicPhone: "(+51) 123 456 78",
    clinicEmail: "info@kiru.com",
    heroImageUrl: 'https://images.unsplash.com/photo-1588776814546-1ff208a3def7?q=80&w=1974&auto=format&fit=crop',
    loginImageUrl: 'https://images.unsplash.com/photo-1606236930335-b27b3b3a7a4e?q=80&w=1964&auto=format&fit=crop',
};

const initialPromotions: Promotion[] = [
    {
        id: 'promo1',
        title: "Tu Diagnóstico Digital ¡GRATIS!",
        subtitle: "Incluye revisión completa y plan de tratamiento personalizado.",
        imageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop',
        ctaText: 'Agendar mi Diagnóstico Gratis',
        isActive: true,
        details: "Revisión completa con cámara intraoral.\nPlan de tratamiento digital 100% personalizado.\nAsesoramiento experto sin compromiso."
    }
];

type Page = 'landing' | 'login' | 'odontogram' | 'admin';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [settings, setSettings] = useState<AppSettings>(initialSettings);
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
    const [selectedPatient, setSelectedPatient] = useState<Appointment | null>(null);

    const handleBookAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointmentData,
            id: crypto.randomUUID(),
            status: 'confirmed',
        };
        setAppointments(prev => [...prev, newAppointment]);
        alert(`¡Cita confirmada para ${appointmentData.name}!`);
    };
    
    const handleLogin = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            setCurrentPage('admin');
        }
    };
    
    const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'> & { id?: string }) => {
        if (appointmentData.id) {
            setAppointments(prev =>
                prev.map(app =>
                    app.id === appointmentData.id
                        ? { ...app, ...appointmentData } as Appointment
                        : app
                )
            );
        } else {
            const newAppointment: Appointment = {
                id: crypto.randomUUID(),
                name: appointmentData.name || '',
                phone: appointmentData.phone || '',
                email: appointmentData.email || '',
                dateTime: appointmentData.dateTime || new Date().toISOString(),
                service: appointmentData.service || '',
                status: appointmentData.status || 'confirmed',
                doctorId: appointmentData.doctorId,
            };
            setAppointments(prev => [...prev, newAppointment]);
        }
    };
    
    const handleDeleteAppointment = (appointmentId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        }
    };

    const handleSaveDoctor = (doctorData: Omit<Doctor, 'id'> & { id?: string }) => {
        if (doctorData.id) {
            setDoctors(prev =>
                prev.map(doc =>
                    doc.id === doctorData.id ? ({ ...doc, ...doctorData } as Doctor) : doc
                )
            );
        } else {
            const newDoctor: Doctor = {
                id: crypto.randomUUID(),
                name: doctorData.name || '',
                specialty: doctorData.specialty || '',
            };
            setDoctors(prev => [...prev, newDoctor]);
        }
    };

    const handleDeleteDoctor = (doctorId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este doctor? Se desasignarán sus citas.')) {
            setDoctors(prev => prev.filter(doc => doc.id !== doctorId));
            setAppointments(prev => prev.map(app => app.doctorId === doctorId ? { ...app, doctorId: undefined } : app));
        }
    };
    
    const handleUpdateSettings = (updatedSettings: AppSettings) => {
        setSettings(updatedSettings);
    };

    const handleNavigateToOdontogram = (appointment: Appointment) => {
        setSelectedPatient(appointment);
        setCurrentPage('odontogram');
    };

    const handleSavePromotion = (promotionData: Omit<Promotion, 'id' | 'isActive'> & { id?: string }) => {
       if (promotionData.id) {
            setPromotions(prev =>
                prev.map(p =>
                    p.id === promotionData.id ? { ...p, ...promotionData, isActive: p.isActive } as Promotion : p
                )
            );
        } else {
            const newPromotion: Promotion = {
                id: crypto.randomUUID(),
                title: promotionData.title || '',
                subtitle: promotionData.subtitle || '',
                imageUrl: promotionData.imageUrl || '',
                ctaText: promotionData.ctaText || '',
                details: promotionData.details || '',
                isActive: false,
            };
            setPromotions(prev => [...prev, newPromotion]);
        }
    };

    const handleDeletePromotion = (promotionId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
            setPromotions(prev => prev.filter(p => p.id !== promotionId));
        }
    };

    const handleTogglePromotionActive = (promotionId: string) => {
        setPromotions(prev =>
            prev.map(p => ({
                ...p,
                isActive: p.id === promotionId ? !p.isActive : false,
            }))
        );
    };

    const activePromotion = promotions.find(p => p.isActive) || null;

    const renderPage = () => {
        switch (currentPage) {
            case 'landing':
                return <LandingPage 
                            onBookAppointment={handleBookAppointment} 
                            settings={settings} 
                            onNavigateToLogin={() => setCurrentPage('login')} 
                            activePromotion={activePromotion}
                        />;
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigateToLanding={() => setCurrentPage('landing')} settings={settings} />;
            case 'admin':
                return <AdminPage 
                            appointments={appointments} 
                            doctors={doctors}
                            promotions={promotions}
                            settings={settings} 
                            onSaveAppointment={handleSaveAppointment}
                            onDeleteAppointment={handleDeleteAppointment}
                            onSaveDoctor={handleSaveDoctor}
                            onDeleteDoctor={handleDeleteDoctor}
                            onUpdateSettings={handleUpdateSettings} 
                            onNavigateToOdontogram={handleNavigateToOdontogram}
                            onSavePromotion={handleSavePromotion}
                            onDeletePromotion={handleDeletePromotion}
                            onTogglePromotionActive={handleTogglePromotionActive}
                        />;
            case 'odontogram':
                 return <OdontogramApp 
                            appointments={appointments} 
                            isAuthenticated={isAuthenticated} 
                            onNavigateToAdmin={() => setCurrentPage('admin')}
                            patient={selectedPatient} 
                        />;
            default:
                return <LandingPage onBookAppointment={handleBookAppointment} settings={settings} onNavigateToLogin={() => setCurrentPage('login')} activePromotion={activePromotion} />;
        }
    };

    return <div className="App">{renderPage()}</div>;
};

export default App;