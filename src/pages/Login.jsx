import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import SectionHeading from '@/components/SectionHeading';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, signup, user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user && !loading) {
    return <Navigate to={location.state?.from || '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await signup(form.email, form.password);
    } catch (err) {
      setError(err?.message?.replace('Firebase: ', '') || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-snavyo-background py-12">
      <SectionHeading
        eyebrow="Auth"
        title={mode === 'login' ? 'Sign In' : 'Create Account'}
        description={
          mode === 'login'
            ? 'Enter your email to access your album projects.'
            : 'Enter your email to create a new SNAVYO account.'
        }
      />
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2.5 rounded-lg border border-snavyo-lavender text-snavyo-text-main"
        />
        <input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2.5 rounded-lg border border-snavyo-lavender text-snavyo-text-main"
        />
        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-snavyo-purple text-white rounded-lg hover:bg-snavyo-purple-dark transition-colors disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-snavyo-gold focus:ring-offset-2"
        >
          {submitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
          }}
          className="text-sm text-snavyo-text-secondary mt-2 flex items-center gap-1 hover:text-snavyo-purple transition-colors"
        >
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>
      </form>
    </section>
  );
}