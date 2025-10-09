import React, { useState, useCallback } from 'react';
import { OdontogramApp } from './components/OdontogramApp';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import type { Appointment, AppSettings } from './types';

// Mock Data
const initialAppointments: Appointment[] = [
    { id: '1', name: 'Carlos Sanchez', phone: '987654321', email: 'carlos.s@example.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), service: 'restorations', status: 'confirmed' },
    { id: '2', name: 'Maria Rodriguez', phone: '912345678', email: 'maria.r@example.com', dateTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), service: 'orthodontics', status: 'confirmed' },
];

const initialSettings: AppSettings = {
    clinicName: "Kiru",
    clinicAddress: "Av. Sonrisas 123, Lima, Perú",
    clinicPhone: "(+51) 123 456 78",
    clinicEmail: "info@kiru.com",
    heroImageUrl: 'https://images.unsplash.com/photo-1588776814546-1ff208a3def7?q=80&w=1974&auto=format&fit=crop',
    promoImageUrl: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop',
    loginImageUrl: 'https://images.unsplash.com/photo-1606236930335-b27b3b3a7a4e?q=80&w=1964&auto=format&fit=crop',
    promoTitle: "Tu Diagnóstico Digital ¡GRATIS!",
    promoSubtitle: "Incluye revisión completa y plan de tratamiento personalizado.",
};

type Page = 'landing' | 'login' | 'odontogram' | 'admin';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [settings, setSettings] = useState<AppSettings>(initialSettings);
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
    
    const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id' | 'status'> & { id?: string; status?: 'confirmed' | 'completed' | 'canceled' }) => {
        if (appointmentData.id) {
            // Update
            setAppointments(prev => prev.map(app => app.id === appointmentData.id ? { ...app, ...appointmentData } as Appointment : app));
        } else {
            // Create
            const newAppointment: Appointment = {
                id: crypto.randomUUID(),
                name: appointmentData.name,
                phone: appointmentData.phone,
                email: appointmentData.email,
                dateTime: appointmentData.dateTime,
                service: appointmentData.service,
                status: 'confirmed',
            };
            setAppointments(prev => [...prev, newAppointment]);
        }
    };
    
    const handleDeleteAppointment = (appointmentId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        }
    };
    
    const handleUpdateSettings = (updatedSettings: AppSettings) => {
        setSettings(updatedSettings);
    };

    const handleNavigateToOdontogram = (appointment: Appointment) => {
        setSelectedPatient(appointment);
        setCurrentPage('odontogram');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'landing':
                return <LandingPage onBookAppointment={handleBookAppointment} settings={settings} onNavigateToLogin={() => setCurrentPage('login')} />;
            case 'login':
                return <LoginPage onLogin={handleLogin} onNavigateToLanding={() => setCurrentPage('landing')} settings={settings} />;
            case 'admin':
                return <AdminPage 
                            appointments={appointments} 
                            onSaveAppointment={handleSaveAppointment}
                            onDeleteAppointment={handleDeleteAppointment}
                            settings={settings} 
                            onUpdateSettings={handleUpdateSettings} 
                            onNavigateToOdontogram={handleNavigateToOdontogram} 
                        />;
            case 'odontogram':
                 return <OdontogramApp 
                            appointments={appointments} 
                            isAuthenticated={isAuthenticated} 
                            onNavigateToAdmin={() => setCurrentPage('admin')}
                            patient={selectedPatient} 
                        />;
            default:
                return <LandingPage onBookAppointment={handleBookAppointment} settings={settings} onNavigateToLogin={() => setCurrentPage('login')} />;
        }
    };

    return <div className="App">{renderPage()}</div>;
};

export default App;