import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import SectionHeading from '@/components/SectionHeading';

export default function Signup() {
  const { signup, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already signed in, redirect
  useEffect(() => {
    if (user && !loading) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Enter an email';
    if (!form.email.includes('.')) newErrors.email = 'Invalid email format';
    if (!form.password) newErrors.password = 'Enter a password';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 chars';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signup(form.email, form.password, form.name);
      // Redirect to the page they were trying to reach
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ server: err.message?.replace('Firebase: ', '') || 'Sign up failed' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-snavyo-background py-12">
      <SectionHeading
        eyebrow="Sign Up"
        title="Create Your SNAVYO Account"
        description="Enter your email and create a password to start building your album."
      />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        {errors.server && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-2.5" role="alert">
            {errors.server}
          </p>
        )}

        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2.5 rounded-lg border border-snavyo-lavender text-snavyo-text-main"
          required
        />
        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}

        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name (optional)
        </label>
        <input
          id="name"
          type="text"
          placeholder="Jane Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2.5 rounded-lg border border-snavyo-lavender text-snavyo-text-main"
        />

        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2.5 rounded-lg border border-snavyo-lavender text-snavyo-text-main"
          required
          minLength={8}
        />
        {errors.password && <p className="text-xs text-rose-600 mt-1">{errors.password}</p>}

        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="w-full p-2.5 rounded-lg border border-snavyo-lavender text-snavyo-text-main"
          required
        />
        {errors.confirmPassword && <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword}</p>}

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign Up'}
        </Button>

        <p className="text-sm text-snavyo-text-secondary text-center mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
            className="text-snavyo-purple underline hover:text-snavyo-purple-dark"
          >
            Log in
          </button>
        </p>
      </form>
    </section>
  );
}
