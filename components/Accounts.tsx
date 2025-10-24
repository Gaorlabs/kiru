import React, { useMemo } from 'react';
import type { Session } from '../types';
import { TREATMENTS_MAP } from '../constants';
import { PrintIcon, DentalIcon } from './icons';

interface AccountsProps {
    sessions: Session[];
    patientName: string;
}

// FIX: The component was incorrectly typed with React.FC, which doesn't support `ref` props. It has been correctly typed using React.forwardRef's generic arguments to properly handle the forwarded ref.
const ReceiptToPrint = React.forwardRef<HTMLDivElement, AccountsProps & { clinicName: string }>(({ sessions, patientName, clinicName }, ref) => {
    const allTreatments = useMemo(() => sessions.flatMap(s => s.treatments.map(t => ({ ...t, sessionName: s.name }))), [sessions]);
    const totalCost = useMemo(() => allTreatments.reduce((sum, t) => sum + (TREATMENTS_MAP[t.treatmentId]?.price || 0), 0), [allTreatments]);

    return (
        <div ref={ref} className="p-8 font-sans text-gray-800">
            <div className="flex justify-between items-start pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold">{clinicName} Dental</h1>
                    <p>Av. Sonrisas 123, Lima, Perú</p>
                </div>
                <div className="w-16 h-16 text-blue-500"><DentalIcon /></div>
            </div>
            <div className="my-6">
                <h2 className="text-2xl font-semibold mb-2">Recibo</h2>
                <p><span className="font-semibold">Fecha:</span> {new Date().toLocaleDateString()}</p>
                <p><span className="font-semibold">Paciente:</span> {patientName}</p>
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">Tratamiento</th>
                        <th className="p-2">Detalle</th>
                        <th className="p-2 text-right">Costo</th>
                    </tr>
                </thead>
                <tbody>
                    {allTreatments.map(t => {
                        const info = TREATMENTS_MAP[t.treatmentId];
                        return (
                            <tr key={t.id} className="border-b">
                                <td className="p-2">{info?.label}</td>
                                <td className="p-2 text-sm text-gray-600">Diente: {t.toothId} ({t.sessionName})</td>
                                <td className="p-2 text-right">S/ {info?.price.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="flex justify-end mt-6">
                <div className="w-1/3">
                    <div className="flex justify-between font-bold text-xl">
                        <span>Total:</span>
                        <span>S/ {totalCost.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-8">¡Gracias por su confianza!</p>
        </div>
    );
});


export const Accounts: React.FC<AccountsProps> = ({ sessions, patientName }) => {
    const printRef = React.useRef<HTMLDivElement>(null);
    
    const allTreatments = useMemo(() => sessions.flatMap(s => s.treatments.map(t => ({ ...t, sessionName: s.name }))), [sessions]);
    const totalCost = useMemo(() => allTreatments.reduce((sum, t) => sum + (TREATMENTS_MAP[t.treatmentId]?.price || 0), 0), [allTreatments]);
    
    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const WinPrint = window.open('', '', 'width=900,height=650');
            if (WinPrint) {
                WinPrint.document.write('<html><head><title>Recibo</title>');
                WinPrint.document.write('<script src="https://cdn.tailwindcss.com"></script>');
                WinPrint.document.write('</head><body>');
                WinPrint.document.write(printContent.innerHTML);
                WinPrint.document.write('</body></html>');
                WinPrint.document.close();
                WinPrint.focus();
                setTimeout(() => {
                    WinPrint.print();
                    WinPrint.close();
                }, 500);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200">Cuentas del Paciente</h3>
                <button onClick={handlePrint} className="flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg"><PrintIcon /><span>Generar Recibo</span></button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                 <div className="p-4">
                     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-4 py-2">Tratamiento</th>
                                <th scope="col" className="px-4 py-2">Detalle</th>
                                <th scope="col" className="px-4 py-2">Sesión</th>
                                <th scope="col" className="px-4 py-2 text-right">Costo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allTreatments.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-gray-500 dark:text-gray-400">No hay tratamientos registrados en el plan.</td>
                                </tr>
                            ) : (
                                allTreatments.map(t => {
                                    const info = TREATMENTS_MAP[t.treatmentId];
                                    return (
                                        <tr key={t.id} className="border-b dark:border-gray-700">
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{info?.label}</td>
                                            <td className="px-4 py-3">Diente: {t.toothId}</td>
                                            <td className="px-4 py-3">{t.sessionName}</td>
                                            <td className="px-4 py-3 text-right font-semibold">S/ {info?.price.toFixed(2)}</td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                 {allTreatments.length > 0 && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end">
                        <div className="flex items-center space-x-4 text-lg font-bold text-gray-800 dark:text-white">
                            <span>Total General:</span>
                            <span className="text-blue-600 dark:text-blue-400">S/ {totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                 )}
            </div>

            <div className="hidden">
                 <ReceiptToPrint ref={printRef} sessions={sessions} patientName={patientName} clinicName="Kiru"/>
            </div>
        </div>
    );
};