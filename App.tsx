import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OdontogramApp } from './components/OdontogramApp';
import { LoginPage } from './components/LoginPage';
import { AdminPage } from './components/AdminPage';
import type { Appointment, AppSettings } from './types';


function App() {
    const [view, setView] = useState<'landing' | 'odontogram' | 'login' | 'admin'>('landing');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [settings, setSettings] = useState<AppSettings>({
      heroImageUrl: 'https://images.pexels.com/photos/4269489/pexels-photo-4269489.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      promoImageUrl: 'https://images.pexels.com/photos/6528860/pexels-photo-6528860.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      promoTitle: 'Una Sonrisa Saludable Comienza Aquí',
      promoSubtitle: '¡Tu Diagnóstico Dental Completo es GRATIS!',
      loginImageUrl: 'https://images.pexels.com/photos/5356037/pexels-photo-5356037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    });

    const handleBookAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        ...appointmentData,
      };
      setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      alert('¡Cita agendada con éxito! Accediendo al odontograma...');
      setView('odontogram'); 
    };
    
    const handleDeleteAppointment = (appointmentId: string) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        }
    };

    const handleSettingsChange = (newSettings: AppSettings) => {
        setSettings(newSettings);
        alert('¡Configuración guardada con éxito!');
    };
    
    const handleLogin = (success: boolean) => {
        if (success) {
            setIsAuthenticated(true);
            setView('admin');
        }
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setView('landing');
    };
    
    const navigateTo = (targetView: 'landing' | 'odontogram' | 'login' | 'admin') => {
        setView(targetView);
    };

    switch (view) {
        case 'login':
            return <LoginPage onLogin={handleLogin} onNavigateToLanding={() => navigateTo('landing')} settings={settings} />;
        case 'admin':
            if (isAuthenticated) {
                return <AdminPage
                    appointments={appointments}
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    onDeleteAppointment={handleDeleteAppointment}
                    onLogout={handleLogout}
                    onNavigateToLanding={() => navigateTo('landing')}
                />;
            }
            // If not authenticated, redirect to login
            return <LoginPage onLogin={handleLogin} onNavigateToLanding={() => navigateTo('landing')} settings={settings} />;
        case 'odontogram':
            return <OdontogramApp appointments={appointments} />;
        case 'landing':
        default:
             return <LandingPage 
                  onBookAppointment={handleBookAppointment}
                  settings={settings}
                  onNavigateToLogin={() => navigateTo('login')}
                />;
    }
}

export default App;