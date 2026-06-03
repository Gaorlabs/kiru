import React, { useState } from 'react';
import type { OdontogramData } from '../types';

interface InteractiveOdontogramProps {
  odontogramData: OdontogramData;
  onChange: (data: OdontogramData) => void;
  examenObservaciones: string;
  onChangeObservaciones: (obs: string) => void;
  readOnly?: boolean;
}

const CONDITIONS = [
  {id:'healthy', label:'Sano', color:'#E1F5EE', stroke:'#0F6E56'},
  {id:'caries',  label:'Caries', color:'#E24B4A', stroke:'#A32D2D'},
  {id:'rest',    label:'Restauración', color:'#378ADD', stroke:'#185FA5'},
  {id:'missing', label:'Ausente', color:'#B4B2A9', stroke:'#5F5E5A'},
  {id:'endo',    label:'Endodoncia', color:'#EF9F27', stroke:'#854F0B'},
  {id:'crown',   label:'Corona', color:'#7F77DD', stroke:'#534AB7'},
  {id:'extract', label:'Extracción indicada', color:'#F0997B', stroke:'#993C1D'},
  {id:'fracture',label:'Fractura', color:'#F8B4D9', stroke:'#D63384'},
  {id:'implant', label:'Implante', color:'#20C997', stroke:'#0CA678'},
  {id:'sealant', label:'Sellante', color:'#C5F6FA', stroke:'#15AABF'}
];

const SURF_NAMES = ['O', 'V', 'M', 'D', 'P'] as const;

export const InteractiveOdontogram: React.FC<InteractiveOdontogramProps> = ({ 
  odontogramData, onChange, examenObservaciones, onChangeObservaciones, readOnly = false
}) => {
  const [currentCond, setCurrentCond] = useState('caries');
  
  const upperNums = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  const lowerNums = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

  const handleSurfaceClick = (toothNum: number, surface: string) => {
    if (readOnly) return;
    const currentTooth = odontogramData[toothNum] || { O: '', V: '', M: '', D: '', P: '' };
    const newTooth = { ...currentTooth, [surface]: currentTooth[surface as keyof typeof currentTooth] === currentCond ? '' : currentCond };
    onChange({ ...odontogramData, [toothNum]: newTooth });
  };

  const DrawTooth = ({ num }: { num: number }) => {
    const S = 32, H = 32;
    const cx = S/2, cy = H/2;
    const r = S*0.38;
    const surfs = {
      O: [[cx-r*0.45,cy-r*0.45],[cx+r*0.45,cy-r*0.45],[cx+r*0.45,cy+r*0.45],[cx-r*0.45,cy+r*0.45]],
      V: [[0,0],[S,0],[cx+r*0.45,cy-r*0.45],[cx-r*0.45,cy-r*0.45]],
      P: [[0,H],[S,H],[cx+r*0.45,cy+r*0.45],[cx-r*0.45,cy+r*0.45]],
      M: [[0,0],[cx-r*0.45,cy-r*0.45],[cx-r*0.45,cy+r*0.45],[0,H]],
      D: [[S,0],[cx+r*0.45,cy-r*0.45],[cx+r*0.45,cy+r*0.45],[S,H]],
    };
    
    return (
      <div className="flex flex-col items-center gap-1 mx-0.5">
        <span className="text-[10px] text-slate-500 font-medium">{num}</span>
        <svg width={S} height={H} viewBox={`0 0 ${S} ${H}`} className="block">
          <rect width={S} height={H} rx={4} fill="#1e293b" stroke="#334155" strokeWidth="1" />
          {SURF_NAMES.map(s => {
            const condId = (odontogramData[num] as any)?.[s] || '';
            const foundCond = CONDITIONS.find(c => c.id === condId);
            return (
              <polygon
                key={s}
                points={surfs[s].map(p => p.join(',')).join(' ')}
                fill={foundCond ? foundCond.color : 'transparent'}
                stroke="#334155"
                strokeWidth="0.5"
                className={`${readOnly ? '' : 'cursor-pointer hover:opacity-80'} transition-opacity`}
                onClick={() => handleSurfaceClick(num, s)}
              />
            );
          })}
          <rect width={S} height={H} rx={4} fill="none" stroke="#475569" strokeWidth="1" className="pointer-events-none" />
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full font-sans bg-slate-900 rounded-xl p-4 sm:p-6 text-slate-200">
      {!readOnly && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CONDITIONS.map(cond => (
            <button
              key={cond.id}
              onClick={() => setCurrentCond(cond.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg border transition-all ${
                currentCond === cond.id 
                  ? 'bg-slate-700 border-teal-500 text-teal-400' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: cond.color, border: `1px solid ${cond.stroke}` }}></span>
              {cond.label}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto pb-4">
        <div className="text-xs text-slate-500 text-center mb-2 tracking-wider uppercase font-semibold">Superior (18-11 | 21-28)</div>
        <div className="flex justify-center mb-6">
          {upperNums.map((n, i) => (
            <React.Fragment key={n}>
              <DrawTooth num={n} />
              {i === 7 && <div className="w-px bg-slate-700 mx-1"></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex justify-center mb-2">
          {lowerNums.map((n, i) => (
             <React.Fragment key={n}>
              <DrawTooth num={n} />
              {i === 7 && <div className="w-px bg-slate-700 mx-1"></div>}
            </React.Fragment>
          ))}
        </div>
        <div className="text-xs text-slate-500 text-center uppercase tracking-wider font-semibold">Inferior (48-41 | 31-38)</div>
      </div>

      <div className="mt-8 space-y-2">
        <label className="text-sm font-medium text-slate-400">Observaciones del examen</label>
        <textarea
          value={examenObservaciones}
          onChange={(e) => onChangeObservaciones(e.target.value)}
          readOnly={readOnly}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:border-teal-500 min-h-[100px]"
          placeholder="Hallazgos clínicos, estado de tejidos blandos, higiene oral..."
        />
      </div>

    </div>
  );
};
