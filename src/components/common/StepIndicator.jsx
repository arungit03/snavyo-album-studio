export function StepIndicator({ currentStep, steps }) {
  return (
    <div className="w-full mb-8 relative">
      {/* Connector line */}
      <div className="absolute top-10 left-0 right-0 h-[2px] bg-snavyo-lavender -z-10" />
      <div className="flex w-full items-center justify-between px-2">
        {steps.map((step, i) => {
          const done = i < currentStep - 1;
          const active = i === currentStep - 1;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-2 transition-all ${
                done
                  ? 'bg-snavyo-purple text-white border-snavyo-purple'
                  : active
                  ? 'bg-snavyo-purple text-white border-snavyo-purple shadow-gold ring-2 ring-snavyo-gold'
                  : 'bg-white text-snavyo-text-secondary border-snavyo-lavender hover:border-snavyo-purple/30'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider leading-none text-center w-full ${
                active ? 'text-snavyo-purple' : 'text-snavyo-text-secondary'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
