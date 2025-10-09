
import React from 'react';
// FIX: Changed import to be a relative path.
import type { DentalTreatment, ToothSurfaceName } from '../types';

interface StatusBarProps {
    activeTooth: { toothId: number; surface: ToothSurfaceName | 'whole' } | null;
    selectedTreatment: DentalTreatment | null;
}

export const StatusBar: React.FC<StatusBarProps> = ({ activeTooth, selectedTreatment }) => {
    return (
        <div className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-4 p-2 rounded-b-lg text-sm text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Diente:</span> {activeTooth ? activeTooth.toothId : 'Ninguno'}
                </span>
                <span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Superficie:</span> {activeTooth ? activeTooth.surface : 'N/A'}
                </span>
            </div>
            <div>
                <span>
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Simbología:</span> {selectedTreatment ? selectedTreatment.label : 'Ninguna seleccionada'}
                </span>
            </div>
        </div>
    );
};