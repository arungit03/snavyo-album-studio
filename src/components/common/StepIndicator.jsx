export function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full mb-8 relative">
      {/* Connector line */}
      <div className="absolute top-5 left-8 right-8 h-[2px] bg-snavyo-lavender/80 -z-0" />
      <div
        className="absolute top-5 left-8 h-[2px] bg-gradient-to-r from-snavyo-purple to-amber-400 transition-all duration-300 -z-0"
        style={{
          width: `${((currentStep - 1) / Math.max(1, steps.length - 1)) * 100}%`,
        }}
      />
      <div className="flex w-full items-center justify-between px-2">
        {steps.map((step, i) => {
          const done = i < currentStep - 1;
          const active = i === currentStep - 1;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-xs border-2 transition-all duration-300 ${
                  done
                    ? 'bg-gradient-to-tr from-snavyo-purple to-purple-800 text-white border-snavyo-purple shadow-[0_2px_10px_rgba(117,80,184,0.3)]'
                    : active
                    ? 'bg-gradient-to-tr from-snavyo-purple to-purple-800 text-white border-amber-300 ring-4 ring-amber-300/40 shadow-[0_0_20px_rgba(212,175,98,0.45)] scale-110'
                    : 'bg-white text-snavyo-text-secondary border-snavyo-lavender hover:border-snavyo-purple/40'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider leading-none text-center w-full transition-colors ${
                  active ? 'text-snavyo-purple font-extrabold' : 'text-snavyo-text-secondary'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
