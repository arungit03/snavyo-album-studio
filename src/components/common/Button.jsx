import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-snavyo-background active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none';

const variants = {
  luxury:
    'px-8 py-3.5 bg-snavyo-purple text-white text-base shadow-luxury rounded-full hover:bg-snavyo-purple-dark hover:-translate-y-1 hover:shadow-gold focus:ring-snavyo-purple',
  gold:
    'px-8 py-3.5 bg-snavyo-gold text-snavyo-purple-dark text-base shadow-lg rounded-full hover:bg-snavyo-purple hover:text-white hover:-translate-y-1 focus:ring-snavyo-gold',
  outline:
    'px-8 py-3.5 border-2 border-snavyo-purple text-snavyo-purple text-base rounded-full hover:bg-snavyo-purple hover:text-white focus:ring-snavyo-purple',
  ghost:
    'px-8 py-3.5 bg-white/70 backdrop-blur-sm border border-white/80 text-snavyo-text-secondary rounded-xl shadow-sm hover:bg-snavyo-lavender hover:text-snavyo-purple hover:border-snavyo-purple focus:ring-snavyo-purple',
};

const sizes = {
  sm: 'px-6 py-2.5 text-sm rounded-lg',
  md: 'px-8 py-3.5 text-base rounded-full',
  lg: 'px-10 py-4 text-lg rounded-full',
};

export const Button = forwardRef(
  ({ to, className, variant = 'luxury', size = 'md', children, ...props }, ref) => {
    const Comp = to ? Link : 'button';
    return (
      <Comp
        ref={ref}
        {...(to ? { to } : {})}
        className={[base, variants[variant], sizes[size], className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Button.displayName = 'Button';
