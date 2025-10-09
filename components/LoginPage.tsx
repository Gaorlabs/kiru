import React, { useState } from 'react';
import { DentalIcon, UserIcon, PasswordIcon } from './icons';

interface LoginPageProps {
    onLogin: (success: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Simple hardcoded authentication
        if (username === 'admin' && password === 'kiru2024') {
            onLogin(true);
        } else {
            setError('Usuario o contraseña incorrectos.');
            onLogin(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
                    <div className="text-center">
                         <div className="w-16 h-16 text-blue-600 mx-auto mb-3"><DentalIcon /></div>
                        <h1 className="text-3xl font-bold text-slate-900">Acceso de Administrador</h1>
                        <p className="text-slate-500 mt-1">Inicia sesión para gestionar la clínica.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-600 mb-1">Usuario</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <UserIcon />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-base text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder="admin"
                                />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="password"className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <PasswordIcon />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-base text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-600 bg-red-100 p-2 rounded-lg text-center">{error}</p>}
                        
                        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-all transform hover:scale-105">
                            Iniciar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
