import React, { useState } from 'react';
import type { Appointment, AppSettings, Promotion, AdminAppointmentModalProps, AdminPromotionModalProps } from '../types';
import { DENTAL_SERVICES_MAP } from '../constants';
import { DentalIcon, CalendarIcon, SettingsIcon, UserIcon, BriefcaseIcon, PlusIcon, PencilIcon, TrashIcon, OdontogramIcon, MegaphoneIcon } from './icons';
import { AdminAppointmentModal } from './AdminAppointmentModal';
import { AdminPromotionModal } from './AdminPromotionModal';

interface AdminPageProps {
    appointments: Appointment[];
    onSaveAppointment: AdminAppointmentModalProps['onSave'];
    onDeleteAppointment: (id: string) => void;
    settings: AppSettings;
    onUpdateSettings: (settings: AppSettings) => void;
    onNavigateToOdontogram: (appointment: Appointment) => void;
    promotions: Promotion[];
    onSavePromotion: AdminPromotionModalProps['onSave'];
    onDeletePromotion: (id: string) => void;
    onTogglePromotionActive: (id: string) => void;
}

type AdminTab = 'agenda' | 'doctores' | 'promociones' | 'configuracion';

const SidebarLink: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
    >
        <div className="w-6 h-6">{icon}</div>
        <span className="font-semibold">{label}</span>
    </button>
);

export const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('agenda');

    return (
        <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 text-white flex flex-col p-4">
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-9 h-9 text-blue-400"><DentalIcon /></div>
                    <h1 className="text-2xl font-bold">Kiru Admin</h1>
                </div>
                <nav className="flex flex-col gap-2">
                    <SidebarLink icon={<CalendarIcon />} label="Agenda" isActive={activeTab === 'agenda'} onClick={() => setActiveTab('agenda')} />
                    <SidebarLink icon={<BriefcaseIcon />} label="Doctores" isActive={activeTab === 'doctores'} onClick={() => setActiveTab('doctores')} />
                    <SidebarLink icon={<MegaphoneIcon />} label="Promociones" isActive={activeTab === 'promociones'} onClick={() => setActiveTab('promociones')} />
                    <SidebarLink icon={<SettingsIcon />} label="Configuración" isActive={activeTab === 'configuracion'} onClick={() => setActiveTab('configuracion')} />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="bg-white dark:bg-slate-800 shadow py-4 px-8 flex justify-end items-center">
                    <button className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <UserIcon />
                        </div>
                        <span className="font-semibold">Admin</span>
                    </button>
                </header>
                <div className="flex-1 p-8 overflow-y-auto">
                    {activeTab === 'agenda' && <AgendaPanel {...props} />}
                    {activeTab === 'doctores' && <DoctorPanel {...props} />}
                    {activeTab === 'promociones' && <PromotionsPanel {...props} />}
                    {activeTab === 'configuracion' && <SettingsPanel {...props} />}
                </div>
            </main>
        </div>
    );
};

const AgendaPanel: React.FC<AdminPageProps> = ({ appointments, onSaveAppointment, onDeleteAppointment }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | Partial<Appointment> | null>(null);

    const handleOpenModal = (appointment: Appointment | null = null) => {
        setEditingAppointment(appointment || { name: '', phone: '', email: '', dateTime: '', service: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAppointment(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Agenda</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <PlusIcon />
                    <span>Nueva Cita</span>
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="py-3 px-4">Paciente</th>
                                <th className="py-3 px-4">Fecha y Hora</th>
                                <th className="py-3 px-4">Servicio</th>
                                <th className="py-3 px-4">Teléfono</th>
                                <th className="py-3 px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(app => (
                                <tr key={app.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="py-3 px-4 font-medium">{app.name}</td>
                                    <td className="py-3 px-4">{new Date(app.dateTime).toLocaleString('es-ES')}</td>
                                    <td className="py-3 px-4">{DENTAL_SERVICES_MAP[app.service] || app.service}</td>
                                    <td className="py-3 px-4">{app.phone}</td>
                                    <td className="py-3 px-4 flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(app)} className="text-blue-500 hover:text-blue-700" title="Editar"><PencilIcon /></button>
                                        <button onClick={() => onDeleteAppointment(app.id)} className="text-red-500 hover:text-red-700" title="Eliminar"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <AdminAppointmentModal appointment={editingAppointment} onClose={handleCloseModal} onSave={onSaveAppointment} />}
        </div>
    );
};

const DoctorPanel: React.FC<AdminPageProps> = ({ appointments, onNavigateToOdontogram }) => (
     <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Flujo de Atención de Pacientes</h2>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="py-3 px-4">Paciente</th>
                            <th className="py-3 px-4">Fecha y Hora</th>
                            <th className="py-3 px-4">Servicio</th>
                            <th className="py-3 px-4">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.filter(a => new Date(a.dateTime) >= new Date()).map(app => (
                            <tr key={app.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="py-3 px-4 font-medium">{app.name}</td>
                                <td className="py-3 px-4">{new Date(app.dateTime).toLocaleString('es-ES')}</td>
                                <td className="py-3 px-4">{DENTAL_SERVICES_MAP[app.service] || app.service}</td>
                                <td className="py-3 px-4">
                                    <button 
                                        onClick={() => onNavigateToOdontogram(app)} 
                                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 text-sm transition-colors"
                                    >
                                        <OdontogramIcon />
                                        <span>Atender Cita</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const PromotionsPanel: React.FC<AdminPageProps> = ({ promotions, onSavePromotion, onDeletePromotion, onTogglePromotionActive }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | Partial<Promotion> | null>(null);

    const handleOpenModal = (promotion: Promotion | null = null) => {
        setEditingPromotion(promotion || { title: '', subtitle: '', imageUrl: '', ctaText: '', details: '' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPromotion(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Promociones</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <PlusIcon />
                    <span>Nueva Promoción</span>
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="py-3 px-4">Título</th>
                                <th className="py-3 px-4">Estado</th>
                                <th className="py-3 px-4">Activar</th>
                                <th className="py-3 px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promo => (
                                <tr key={promo.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="py-3 px-4 font-medium">{promo.title}</td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${promo.isActive ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                            {promo.isActive ? 'Activa' : 'Inactiva'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={promo.isActive} onChange={() => onTogglePromotionActive(promo.id)} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </td>
                                    <td className="py-3 px-4 flex items-center gap-4">
                                        <button onClick={() => handleOpenModal(promo)} className="text-blue-500 hover:text-blue-700" title="Editar"><PencilIcon /></button>
                                        <button onClick={() => onDeletePromotion(promo.id)} className="text-red-500 hover:text-red-700" title="Eliminar"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <AdminPromotionModal promotion={editingPromotion} onClose={handleCloseModal} onSave={onSavePromotion} />}
        </div>
    );
};


const SettingsPanel: React.FC<AdminPageProps> = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLocalSettings({ ...localSettings, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onUpdateSettings(localSettings);
        alert("Configuración guardada.");
    };

    const settingsFields = [
        { key: 'heroImageUrl', label: 'URL Imagen Principal' },
        { key: 'loginImageUrl', label: 'URL Imagen de Ingreso' },
    ];


    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Configuración de la Página</h2>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md space-y-6 max-w-2xl">
                {settingsFields.map(({key, label}) => (
                    <div key={key}>
                        <label htmlFor={key} className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                           {label}
                        </label>
                        <input
                            type="text"
                            id={key}
                            name={key}
                            value={localSettings[key as keyof AppSettings]}
                            onChange={handleChange}
                            className="w-full bg-slate-100 dark:bg-slate-700 border-transparent rounded-lg p-3 text-slate-900 dark:text-white"
                        />
                    </div>
                ))}

                <div className="pt-4 flex justify-end">
                    <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};