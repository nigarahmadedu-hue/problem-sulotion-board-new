import React from 'react';

interface StageTimelineProps {
  currentStageIndex: number; // 0 to 6
  currentStageName: string;
}

const STAGES = [
  { step: '01', name: 'Submitted' },
  { step: '02', name: 'Discussion' },
  { step: '03', name: 'Research' },
  { step: '04', name: 'Validated' },
  { step: '05', name: 'Prototype' },
  { step: '06', name: 'MVP' },
  { step: '07', name: 'Launched' },
];

export const StageTimeline: React.FC<StageTimelineProps> = ({
  currentStageIndex,
  currentStageName,

}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Validation Status
          </span>
          <strong className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            {currentStageName}
          </strong>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Step {currentStageIndex + 1} of {STAGES.length}
        </span>
      </div>

      {/* Horizontal Timeline */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {STAGES.map((st, idx) => {
          const isPassedOrCurrent = idx <= currentStageIndex;
          const isCurrent = idx === currentStageIndex;

          return (
            <React.Fragment key={st.step}>
              <div className="flex flex-col items-center min-w-[76px] text-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${
                    isCurrent
                      ? 'bg-slate-900 text-white ring-4 ring-slate-100 shadow-sm'
                      : isPassedOrCurrent
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPassedOrCurrent && !isCurrent ? '✓' : st.step}
                </div>
                <strong
                  className={`text-xs whitespace-nowrap ${
                    isCurrent
                      ? 'text-slate-900 font-bold'
                      : isPassedOrCurrent
                      ? 'text-slate-700 font-medium'
                      : 'text-slate-400 font-normal'
                  }`}
                >
                  {st.name}
                </strong>
              </div>

              {idx < STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 min-w-[20px] mb-6 transition-colors ${
                    idx < currentStageIndex ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
