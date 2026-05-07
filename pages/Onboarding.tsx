import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import {
  getCurrentUser,
  ensureAppUserProfile,
  isProfileComplete,
  updateAuthProfile,
  upsertAppUserProfile,
  type AppUserProfile,
} from '../services/auth';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const canSubmit = useMemo(() => {
    return fullName.trim().length > 0 && Number(age) > 0;
  }, [fullName, age]);

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
      const { profile: storedProfile, error: profileError } = await ensureAppUserProfile(data.user);
      if (!isMounted) return;

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
      }

      setProfile(storedProfile);
      if (isProfileComplete(storedProfile)) {
        navigate('/courses');
        return;
      }

      if (storedProfile) {
        if (storedProfile.full_name) {
          setFullName(storedProfile.full_name);
        }
        if (typeof storedProfile.age === 'number') {
          setAge(String(storedProfile.age));
        }
      }
      setLoading(false);
    };

    void load();
    return () => { isMounted = false; };
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    if (!user) {
      setErrorMessage('Unable to identify user session.');
      return;
    }

    if (!canSubmit) {
      setErrorMessage('Please enter your full name and age.');
      return;
    }

    setSaving(true);

    const { error: authError } = await updateAuthProfile({
      fullName: fullName.trim(),
    });
    if (authError) {
      setErrorMessage(authError.message);
      setSaving(false);
      return;
    }

    const now = new Date().toISOString();
    const profilePayload = {
      id: user.id,
      email: user.email ?? null,
      full_name: fullName.trim(),
      age: Number(age),
      password_setup: profile?.password_setup ?? true,
      created_at: profile?.created_at ?? now,
    };

    const { error: dbError } = await upsertAppUserProfile(profilePayload);
    if (dbError) {
      setErrorMessage(dbError.message);
      setSaving(false);
      return;
    }

    setSuccessMessage('Onboarding completed successfully. Redirecting to courses...');
    setTimeout(() => navigate('/courses'), 900);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl border border-primary-100 bg-primary-50 p-8 text-center font-semibold text-primary-900">
          Loading your onboarding experience...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="rounded-3xl border border-primary-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-600">Welcome to ARGPS</p>
          <h1 className="mt-3 text-3xl font-semibold text-primary-900">Complete your profile</h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Finish onboarding to access courses and save your learning progress.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="full-name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              value={fullName}
              onChange={event => setFullName(event.target.value)}
              required
              placeholder="Your full name"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
              Age
            </label>
            <input
              id="age"
              type="number"
              min="1"
              value={age}
              onChange={event => setAge(event.target.value)}
              required
              placeholder="Your age"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{successMessage}</div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={saving || !canSubmit}
              className="w-full rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {saving ? 'Saving profile...' : 'Complete Onboarding'}
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
