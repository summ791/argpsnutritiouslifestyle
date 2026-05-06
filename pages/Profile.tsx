import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import {
  getAppUserProfile,
  getCurrentUser,
  isProfileComplete,
  updateAppUserProfile,
  updateAuthProfile,
  type AppUserProfile,
} from '../services/auth';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const canSubmit = useMemo(() => {
    return fullName.trim().length > 0 && Number(age) > 0 && email.trim().length > 0;
  }, [fullName, age, email]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data, error } = await getCurrentUser();
      if (!isMounted) return;

      if (error || !data.user) {
        navigate('/courses');
        return;
      }

      setUser(data.user);
      const { profile: storedProfile, error: profileError } = await getAppUserProfile(data.user.id);
      if (!isMounted) return;

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
      }

      if (!storedProfile) {
        navigate('/onboarding');
        return;
      }

      if (!isProfileComplete(storedProfile)) {
        navigate('/onboarding');
        return;
      }

      setProfile(storedProfile);
      setFullName(storedProfile.full_name ?? '');
      setEmail(storedProfile.email ?? data.user.email ?? '');
      setAge(String(storedProfile.age ?? ''));
      setLoading(false);
    };

    void load();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setMessage('');
    if (!user || !profile) {
      setErrorMessage('Unable to load your profile.');
      return;
    }

    if (!canSubmit) {
      setErrorMessage('Please enter a valid name, email, and age.');
      return;
    }

    setSaving(true);

    if (password.length > 0 && password.length < 6) {
      setErrorMessage('Password must be at least 6 characters, or leave it blank.');
      setSaving(false);
      return;
    }

    const trimmedEmail = email.trim();
    const { error: authError } = await updateAuthProfile({
      fullName: fullName.trim(),
      email: trimmedEmail !== user.email ? trimmedEmail : undefined,
      password: password.length >= 6 ? password : undefined,
    });
    if (authError) {
      setErrorMessage(authError.message);
      setSaving(false);
      return;
    }

    const { error: dbError } = await updateAppUserProfile(user.id, {
      full_name: fullName.trim(),
      age: Number(age),
      email: trimmedEmail,
    });

    if (dbError) {
      setErrorMessage(dbError.message);
      setSaving(false);
      return;
    }

    setMessage('Profile updated successfully.');
    setProfile(previous => previous ? {
      ...previous,
      full_name: fullName.trim(),
      age: Number(age),
      email: trimmedEmail,
    } : previous);
    setPassword('');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-primary-100 bg-primary-50 p-8 text-center font-semibold text-primary-900">
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">My Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-primary-900">Your account details</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Update your name, email, age, or password. All changes are saved securely.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="profile-full-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={event => setFullName(event.target.value)}
              required
              placeholder="Full name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              required
              placeholder="Email address"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="profile-age" className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <input
              id="profile-age"
              type="number"
              min="1"
              value={age}
              onChange={event => setAge(event.target.value)}
              required
              placeholder="Age"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="profile-password" className="block text-sm font-semibold text-gray-700 mb-2">
              New Password (optional)
            </label>
            <input
              id="profile-password"
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <p className="mt-2 text-xs text-gray-500">Enter a new password only if you want to update login credentials.</p>
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
          )}
          {message && (
            <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="w-full rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? 'Saving profile...' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/courses')}
              className="w-full rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
            >
              Back to Courses
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
