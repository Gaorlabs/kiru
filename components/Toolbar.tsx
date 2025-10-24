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
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <span>{category}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon />
                </span>
            </button>
            {isOpen && (
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 grid grid-cols-5 gap-2">
                    {treatments.map((treatment) => (
                         <button
                            key={treatment.id}
                            onClick={() => onSelectTreatment(treatment.id)}
                            className={`p-2 border rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 ease-in-out transform hover:scale-105 aspect-square ${
                                selectedTreatmentId === treatment.id
                                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 ring-2 ring-blue-500'
                                    : 'bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
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
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Buscar tratamiento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
                    <SearchIcon />
                </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
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