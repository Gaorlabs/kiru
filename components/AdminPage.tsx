import React, { useState, useEffect, PropsWithChildren } from 'react';
// FIX: Changed import to be a relative path.
import type { Appointment, Doctor, AppSettings, Promotion, AdminAppointmentModalProps, AdminDoctorModalProps, AdminPromotionModalProps } from '../types';
import { DENTAL_SERVICES_MAP } from '../constants';
import {
    DashboardIcon, AppointmentIcon, UsersIcon, MegaphoneIcon, SettingsIcon, PlusIcon, PencilIcon, TrashIcon, DentalIcon, MoonIcon, SunIcon, BriefcaseIcon,
} from './icons';
import { AdminAppointmentModal } from './AdminAppointmentModal';
import { AdminDoctorModal } from './AdminDoctorModal';
import { AdminPromotionModal } from './AdminPromotionModal';

// Props for the main AdminPage component
interface AdminPageProps {
    appointments: Appointment[];
    doctors: Doctor[];
    promotions: Promotion[];
    settings: AppSettings;
    onSaveAppointment: AdminAppointmentModalProps['onSave'];
    onDeleteAppointment: (id: string) => void;
    onSaveDoctor: AdminDoctorModalProps['onSave'];
    onDeleteDoctor: (id: string) => void;
    onUpdateSettings: (settings: AppSettings) => void;
    onNavigateToOdontogram: (appointment: Appointment) => void;
    onSavePromotion: AdminPromotionModalProps['onSave'];
    onDeletePromotion: (id: string) => void;
    onTogglePromotionActive: (id: string) => void;
}

type AdminView = 'appointments' | 'clinical' | 'doctors' | 'dashboard' | 'promotions' | 'settings';
type Theme = 'light' | 'dark';

const NavItem: React.FC<PropsWithChildren<{ icon: React.ReactNode; isActive: boolean; onClick: () => void; }>> = ({ icon, isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
        }`}
    >
        <div className="w-6 h-6">{icon}</div>
        <span className="font-semibold">{children}</span>
    </button>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${color}`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase">{title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
            <div className="w-12 h-12 text-slate-400">{icon}</div>
        </div>
    </div>
);

const statusStyles: Record<Appointment['status'], string> = {
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
};

// Individual view components
const DashboardView: React.FC<{ appointments: Appointment[], promotions: Promotion[] }> = ({ appointments, promotions }) => (
    <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Citas para Hoy" value={appointments.filter(a => new Date(a.dateTime).toDateString() === new Date().toDateString()).length} icon={<AppointmentIcon />} color="border-blue-500" />
            <StatCard title="Pacientes Totales" value={appointments.length} icon={<UsersIcon />} color="border-purple-500" />
            <StatCard title="Promociones Activas" value={promotions.filter(p => p.isActive).length} icon={<MegaphoneIcon />} color="border-amber-500" />
        </div>
    </div>
);

const AppointmentsView: React.FC<Pick<AdminPageProps, 'appointments' | 'doctors' | 'onDeleteAppointment'> & { onEdit: (app: Appointment) => void; onAdd: () => void; }> = ({ appointments, doctors, onDeleteAppointment, onEdit, onAdd }) => {
    const doctorsMap = doctors.reduce((acc, doc) => ({...acc, [doc.id]: doc.name}), {} as Record<string, string>);
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Agenda</h2>
                <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"><PlusIcon /> Nueva Cita</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Paciente</th>
                            <th className="p-4 font-semibold text-slate-600">Fecha y Hora</th>
                            <th className="p-4 font-semibold text-slate-600">Servicio</th>
                            <th className="p-4 font-semibold text-slate-600">Doctor</th>
                            <th className="p-4 font-semibold text-slate-600">Estado</th>
                            <th className="p-4 font-semibold text-slate-600">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(app => (
                            <tr key={app.id} className="border-b border-slate-200">
                                <td className="p-4 text-slate-800">{app.name}</td>
                                <td className="p-4 text-slate-800">{new Date(app.dateTime).toLocaleString('es-ES')}</td>
                                <td className="p-4 text-slate-800">{DENTAL_SERVICES_MAP[app.service] || app.service}</td>
                                <td className="p-4 text-slate-800">{app.doctorId ? doctorsMap[app.doctorId] : 'N/A'}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[app.status]}`}>
                                        {app.status === 'confirmed' ? 'Confirmada' : app.status === 'completed' ? 'Completada' : 'Cancelada'}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-2">
                                    <button onClick={() => onEdit(app)} className="p-2 text-slate-500 hover:text-green-600" title="Editar"><PencilIcon /></button>
                                    <button onClick={() => onDeleteAppointment(app.id)} className="p-2 text-slate-500 hover:text-red-600" title="Eliminar"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ClinicalAttentionView: React.FC<Pick<AdminPageProps, 'appointments'|'doctors'| 'onNavigateToOdontogram'>> = ({ appointments, doctors, onNavigateToOdontogram }) => {
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const filteredAppointments = selectedDoctorId ? appointments.filter(a => a.doctorId === selectedDoctorId) : appointments;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-800">Atención Clínica</h2>
                <select value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)} className="p-2 border rounded-md bg-white shadow-sm">
                    <option value="">Todos los Doctores</option>
                    {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
                </select>
            </div>
             <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600">Paciente</th>
                            <th className="p-4 font-semibold text-slate-600">Fecha y Hora</th>
                            <th className="p-4 font-semibold text-slate-600">Servicio</th>
                            <th className="p-4 font-semibold text-slate-600">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map(app => (
                            <tr key={app.id} className="border-b border-slate-200">
                                <td className="p-4 text-slate-800">{app.name}</td>
                                <td className="p-4 text-slate-800">{new Date(app.dateTime).toLocaleString('es-ES')}</td>
                                <td className="p-4 text-slate-800">{DENTAL_SERVICES_MAP[app.service] || app.service}</td>
                                <td className="p-4">
                                    <button onClick={() => onNavigateToOdontogram(app)} className="bg-teal-500 text-white px-3 py-1 rounded-lg font-semibold text-sm hover:bg-teal-600">Atender Cita</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DoctorsView: React.FC<Pick<AdminPageProps, 'doctors' | 'onDeleteDoctor'> & { onEdit: (doc: Doctor) => void; onAdd: () => void; }> = ({ doctors, onDeleteDoctor, onEdit, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Doctores</h2>
            <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-sm"><PlusIcon /> Nuevo Doctor</button>
        </div>
         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
             <table className="w-full text-left">
                 <thead className="bg-slate-50">
                     <tr>
                         <th className="p-4 font-semibold text-slate-600">Nombre</th>
                         <th className="p-4 font-semibold text-slate-600">Especialidad</th>
                         <th className="p-4 font-semibold text-slate-600">Acciones</th>
                     </tr>
                 </thead>
                 <tbody>
                     {doctors.map(doc => (
                         <tr key={doc.id} className="border-b border-slate-200">
                             <td className="p-4 text-slate-800">{doc.name}</td>
                             <td className="p-4 text-slate-800">{doc.specialty}</td>
                             <td className="p-4 flex items-center gap-2">
                                 <button onClick={() => onEdit(doc)} className="p-2 text-slate-500 hover:text-green-600" title="Editar"><PencilIcon /></button>
                                 <button onClick={() => onDeleteDoctor(doc.id)} className="p-2 text-slate-500 hover:text-red-600" title="Eliminar"><TrashIcon /></button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
    </div>
);

const PromotionsView: React.FC<Pick<AdminPageProps, 'promotions' | 'onDeletePromotion' | 'onTogglePromotionActive'> & { onEdit: (promo: Promotion) => void; onAdd: () => void; }> = ({ promotions, onDeletePromotion, onTogglePromotionActive, onEdit, onAdd }) => (
     <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Promociones</h2>
            <button onClick={onAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 shadow-sm"><PlusIcon /> Nueva Promoción</button>
        </div>
         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="p-4 font-semibold text-slate-600">Título</th>
                        <th className="p-4 font-semibold text-slate-600">Estado</th>
                        <th className="p-4 font-semibold text-slate-600">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {promotions.map(promo => (
                        <tr key={promo.id} className="border-b border-slate-200">
                            <td className="p-4 text-slate-800">{promo.title}</td>
                            <td className="p-4">
                                <button onClick={() => onTogglePromotionActive(promo.id)} className={`px-3 py-1 text-sm font-semibold rounded-full ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                    {promo.isActive ? 'Activa' : 'Inactiva'}
                                </button>
                            </td>
                            <td className="p-4 flex items-center gap-2">
                                <button onClick={() => onEdit(promo)} className="p-2 text-slate-500 hover:text-green-600" title="Editar"><PencilIcon /></button>
                                <button onClick={() => onDeletePromotion(promo.id)} className="p-2 text-slate-500 hover:text-red-600" title="Eliminar"><TrashIcon /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
    </div>
);

const SettingsView: React.FC<{ settings: AppSettings, onUpdateSettings: (s: AppSettings) => void }> = ({ settings, onUpdateSettings }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => setLocalSettings(settings), [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSettings(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    const handleSave = () => onUpdateSettings(localSettings);

    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Configuración</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm space-y-4 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Nombre de la Clínica</label>
                    <input type="text" name="clinicName" value={localSettings.clinicName} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Dirección</label>
                    <input type="text" name="clinicAddress" value={localSettings.clinicAddress} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Teléfono</label>
                    <input type="text" name="clinicPhone" value={localSettings.clinicPhone} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                    <input type="email" name="clinicEmail" value={localSettings.clinicEmail} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">URL Imagen Principal</label>
                    <input type="url" name="heroImageUrl" value={localSettings.heroImageUrl} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">URL Imagen Login</label>
                    <input type="url" name="loginImageUrl" value={localSettings.loginImageUrl} onChange={handleChange} className="w-full p-2 border border-slate-300 rounded-md" />
                </div>
                <div className="text-right pt-4">
                    <button onClick={handleSave} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-sm">Guardar Cambios</button>
                </div>
            </div>
        </div>
    );
};

export const AdminPage: React.FC<AdminPageProps> = (props) => {
    const [view, setView] = useState<AdminView>('appointments');
    const [theme, setTheme] = useState<Theme>('light');
    
    // Modal state
    const [editingAppointment, setEditingAppointment] = useState<Appointment | Partial<Appointment> | null>(null);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | Partial<Doctor> | null>(null);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | Partial<Promotion> | null>(null);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);
    
    const renderView = () => {
        switch (view) {
            case 'dashboard': return <DashboardView appointments={props.appointments} promotions={props.promotions} />;
            case 'appointments': return <AppointmentsView appointments={props.appointments} doctors={props.doctors} onDeleteAppointment={props.onDeleteAppointment} onEdit={setEditingAppointment} onAdd={() => setEditingAppointment({})} />;
            case 'clinical': return <ClinicalAttentionView appointments={props.appointments} doctors={props.doctors} onNavigateToOdontogram={props.onNavigateToOdontogram} />;
            case 'doctors': return <DoctorsView doctors={props.doctors} onDeleteDoctor={props.onDeleteDoctor} onEdit={setEditingDoctor} onAdd={() => setEditingDoctor({})} />;
            case 'promotions': return <PromotionsView promotions={props.promotions} onDeletePromotion={props.onDeletePromotion} onTogglePromotionActive={props.onTogglePromotionActive} onEdit={setEditingPromotion} onAdd={() => setEditingPromotion({})} />;
            case 'settings': return <SettingsView settings={props.settings} onUpdateSettings={props.onUpdateSettings} />;
            default: return <AppointmentsView appointments={props.appointments} doctors={props.doctors} onDeleteAppointment={props.onDeleteAppointment} onEdit={setEditingAppointment} onAdd={() => setEditingAppointment({})} />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 text-slate-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white flex flex-col p-4 border-r border-slate-200">
                <div className="flex items-center space-x-2 mb-8 px-2">
                    <div className="w-9 h-9 text-blue-600"><DentalIcon /></div>
                    <h1 className="text-2xl font-bold">Kiru Admin</h1>
                </div>
                <nav className="flex-1 space-y-2">
                    <NavItem icon={<AppointmentIcon />} isActive={view === 'appointments'} onClick={() => setView('appointments')}>Agenda</NavItem>
                    <NavItem icon={<BriefcaseIcon />} isActive={view === 'clinical'} onClick={() => setView('clinical')}>Atención Clínica</NavItem>
                    <NavItem icon={<UsersIcon />} isActive={view === 'doctors'} onClick={() => setView('doctors')}>Doctores</NavItem>
                    <NavItem icon={<DashboardIcon />} isActive={view === 'dashboard'} onClick={() => setView('dashboard')}>Dashboard</NavItem>
                    <NavItem icon={<MegaphoneIcon />} isActive={view === 'promotions'} onClick={() => setView('promotions')}>Promociones</NavItem>
                    <NavItem icon={<SettingsIcon />} isActive={view === 'settings'} onClick={() => setView('settings')}>Configuración</NavItem>
                </nav>
                <div>
                     <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme" className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-200">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        <span className="font-semibold">Cambiar Tema</span>
                    </button>
                </div>
            </aside>
            
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {renderView()}
            </main>

            {/* Modals */}
            {editingAppointment && <AdminAppointmentModal appointment={editingAppointment} doctors={props.doctors} onClose={() => setEditingAppointment(null)} onSave={props.onSaveAppointment} />}
            {editingDoctor && <AdminDoctorModal doctor={editingDoctor} onClose={() => setEditingDoctor(null)} onSave={props.onSaveDoctor} />}
            {editingPromotion && <AdminPromotionModal promotion={editingPromotion} onClose={() => setEditingPromotion(null)} onSave={props.onSavePromotion} />}
        </div>
    );
};