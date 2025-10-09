
import React, { useState, useMemo } from 'react';
import { DENTAL_TREATMENTS, TREATMENT_CATEGORIES } from '../constants';
// FIX: Changed import to be a relative path.
import type { DentalTreatment, ToothCondition, WholeToothCondition } from '../types';
// FIX: Changed import to be a relative path.
import { ChevronDownIcon, SearchIcon } from './icons';

interface ToolbarProps {
    selectedTreatmentId: ToothCondition | WholeToothCondition | null;
    onSelectTreatment: (id: ToothCondition | WholeToothCondition) => void;
}

const CategorySection: React.FC<{
    category: string;
    treatments: DentalTreatment[];
    selectedTreatmentId: ToothCondition | WholeToothCondition | null;
    onSelectTreatment: (id: ToothCondition | WholeToothCondition) => void;
}> = ({ category, treatments, selectedTreatmentId, onSelectTreatment }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
                <span>{category}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon />
                </span>
            </button>
            {isOpen && (
                <div className="p-3 bg-white dark:bg-slate-900 grid grid-cols-5 gap-2">
                    {treatments.map((treatment) => (
                         <button
                            key={treatment.id}
                            onClick={() => onSelectTreatment(treatment.id)}
                            className={`p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 ease-in-out transform hover:scale-105 aspect-square ${
                                selectedTreatmentId === treatment.id
                                    ? 'bg-teal-500/10 dark:bg-teal-500/20 border-teal-500 ring-2 ring-teal-500'
                                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600'
                            }`}
                            title={treatment.label}
                        >
                            <div className="w-8 h-8">{treatment.icon}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Toolbar: React.FC<ToolbarProps> = ({ selectedTreatmentId, onSelectTreatment }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTreatments = useMemo(() => {
        if (!searchTerm) {
            return DENTAL_TREATMENTS;
        }
        return DENTAL_TREATMENTS.filter(t => 
            t.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-slate-100">Simbología y Diagnóstico</h3>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Buscar tratamiento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-teal-500 focus:border-teal-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
                    <SearchIcon />
                </div>
            </div>
            <div className="border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
                {TREATMENT_CATEGORIES.map(category => {
                    const treatmentsForCategory = filteredTreatments.filter(t => t.category === category);
                    if (treatmentsForCategory.length === 0) return null;
                    return (
                        <CategorySection
                            key={category}
                            category={category}
                            treatments={treatmentsForCategory}
                            selectedTreatmentId={selectedTreatmentId}
                            onSelectTreatment={onSelectTreatment}
                        />
                    );
                })}
            </div>
        </div>
    );
};