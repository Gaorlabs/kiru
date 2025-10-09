import React, { useState } from 'react';
import type { AppSettings, Appointment } from '../types';
import { DentalIcon, EmailIcon, PhoneIcon, UserIcon } from './icons';
import { DENTAL_SERVICES_MAP } from '../constants';

interface AdminPageProps {
    appointments: Appointment[];
    settings: AppSettings;
    onSettingsChange: (settings: AppSettings) => void;
    onDeleteAppointment: (id: string) => void;
    onLogout: () => void;
    onNavigateToLanding: () => void;
}

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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Configuración de la Página</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="heroImageUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">URL Imagen Principal</label>
                    <input type="text" name="heroImageUrl" value={settings.heroImageUrl} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-900 dark:text-white" />
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
    );
};

const AgendaPanel: React.FC<{
    appointments: Appointment[];
    onDelete: (id: string) => void;
}> = ({ appointments, onDelete }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mt-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gestión de Citas</h2>
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
    );
};


export const AdminPage: React.FC<AdminPageProps> = ({ appointments, settings, onSettingsChange, onDeleteAppointment, onLogout, onNavigateToLanding }) => {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 font-sans">
            <header className="bg-white dark:bg-slate-800 shadow-md py-3 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 text-blue-600 dark:text-blue-400"><DentalIcon /></div>
                    <h1 className="text-xl font-bold">Panel de Administración</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={onNavigateToLanding} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                       Ver Página Principal
                    </button>
                    <button onClick={onLogout} className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
            </header>
            <main className="p-6">
                <div className="max-w-4xl mx-auto">
                    <SettingsPanel currentSettings={settings} onSave={onSettingsChange} />
                    <AgendaPanel appointments={appointments} onDelete={onDeleteAppointment} />
                </div>
            </main>
        </div>
    );
};
