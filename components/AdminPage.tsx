import React, { useState, useMemo } from 'react';
import type { AppSettings, Appointment } from '../types';
import { DentalIcon, EmailIcon, PhoneIcon, UserIcon, DashboardIcon, CalendarIcon, SettingsIcon } from './icons';
import { DENTAL_SERVICES_MAP } from '../constants';

type AdminTab = 'dashboard' | 'agenda' | 'odontogram' | 'settings';

interface AdminPageProps {
    appointments: Appointment[];
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
    onDeleteAppointment: (id: string) => void;
    onLogout: () => void;
    onNavigateToLanding: () => void;
    onNavigateToOdontogram: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-full text-blue-600 dark:text-blue-300">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const DashboardPanel: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
    const appointmentsToday = useMemo(() => {
        const today = new Date().toDateString();
        return appointments.filter(app => new Date(app.dateTime).toDateString() === today).length;
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        const now = new Date();
        return appointments.find(app => new Date(app.dateTime) > now);
    }, [appointments]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Resumen de la Clínica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Citas de Hoy" value={appointmentsToday} icon={<CalendarIcon />} />
                <StatCard title="Citas Totales" value={appointments.length} icon={<UserIcon />} />
            </div>
            {nextAppointment && (
                 <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                     <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-100">Próxima Cita</h3>
                     <p><span className="font-semibold">{nextAppointment.name}</span> - {DENTAL_SERVICES_MAP[nextAppointment.service]}</p>
                     <p className="text-slate-600 dark:text-slate-400">{new Date(nextAppointment.dateTime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}</p>
                 </div>
            )}
        </div>
    );
};


const SettingsPanel: React.FC<{
    currentSettings: AppSettings;
    onSave: (settings: AppSettings) => void;
}> = ({ currentSettings, onSave }) => {
    const [settings, setSettings] = useState<AppSettings>(currentSettings);

    const handleSave = () => {
        onSave(settings);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Configuración de la Página</h2>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 max-w-2xl">
                 <div className="space-y-4">
                    <div>
                        <label htmlFor="heroImageUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Imagen Principal</label>
                        <input type="text" name="heroImageUrl" value={settings.heroImageUrl} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="loginImageUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Imagen de Ingreso</label>
                        <input type="text" name="loginImageUrl" value={settings.loginImageUrl} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                        <label htmlFor="promoImageUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Imagen Pop-up</label>
                        <input type="text" name="promoImageUrl" value={settings.promoImageUrl} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="promoTitle" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Título del Pop-up</label>
                        <input type="text" name="promoTitle" value={settings.promoTitle} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-white" />
                    </div>
                     <div>
                        <label htmlFor="promoSubtitle" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Subtítulo del Pop-up</label>
                        <input type="text" name="promoSubtitle" value={settings.promoSubtitle} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-white" />
                    </div>
                    <button onClick={handleSave} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
        
    );
};

const AgendaPanel: React.FC<{
    appointments: Appointment[];
    onDelete: (id: string) => void;
}> = ({ appointments, onDelete }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Gestión de Citas</h2>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
                {appointments.length === 0 ? (
                    <p className="text-slate-500 dark:text-slate-400 text-center py-8">No hay citas programadas.</p>
                ) : (
                    <div className="space-y-3">
                        {appointments.map(app => (
                            <div key={app.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                               <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{app.name}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">{DENTAL_SERVICES_MAP[app.service] || app.service}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{new Date(app.dateTime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}</p>
                                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center"><PhoneIcon /> <span className="ml-1">{app.phone}</span></span>
                                        <span className="flex items-center"><EmailIcon /> <span className="ml-1">{app.email}</span></span>
                                    </div>
                               </div>
                               <div className="mt-4 sm:mt-0">
                                    <button onClick={() => onDelete(app.id)} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-3 rounded-lg transition-colors">
                                        Eliminar
                                    </button>
                               </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const OdontogramPanel: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
     <div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Atender Cita</h2>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto text-blue-500 mb-4"><DentalIcon /></div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Acceder al Odontograma</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
                Para atender a un paciente, registrar hallazgos y gestionar el plan de tratamiento, accede a la herramienta de odontograma digital.
            </p>
            <button onClick={onNavigate} className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                Abrir Odontograma
            </button>
        </div>
    </div>
);


const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-left transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        <div className="w-6 h-6">{icon}</div>
        <span>{label}</span>
    </button>
);


export const AdminPage: React.FC<AdminPageProps> = ({ appointments, settings, onSettingsChange, onDeleteAppointment, onLogout, onNavigateToLanding, onNavigateToOdontogram }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return <DashboardPanel appointments={appointments} />;
            case 'agenda':
                return <AgendaPanel appointments={appointments} onDelete={onDeleteAppointment} />;
            case 'odontogram':
                return <OdontogramPanel onNavigate={onNavigateToOdontogram} />;
            case 'settings':
                return <SettingsPanel currentSettings={settings} onSave={onSettingsChange} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex font-sans text-slate-900 dark:text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 flex flex-col p-4 border-r border-slate-200 dark:border-slate-700 shadow-md">
                <div className="flex items-center space-x-2 px-2 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-10 h-10 text-blue-600 dark:text-blue-400"><DentalIcon /></div>
                    <h1 className="text-xl font-bold">Admin Kiru</h1>
                </div>
                <nav className="flex-1 mt-6 space-y-2">
                    <NavItem label="Dashboard" icon={<DashboardIcon />} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavItem label="Agenda" icon={<CalendarIcon />} isActive={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
                    <NavItem label="Atender Cita" icon={<DentalIcon />} isActive={activeTab === 'odontogram'} onClick={() => setActiveTab('odontogram')} />
                    <NavItem label="Configuración" icon={<SettingsIcon />} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>
                <div className="mt-auto space-y-2">
                     <button onClick={onNavigateToLanding} className="w-full text-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">
                       Ver Página Principal
                    </button>
                    <button onClick={onLogout} className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};