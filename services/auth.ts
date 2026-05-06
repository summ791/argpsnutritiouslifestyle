import { supabase } from './supabaseClient';

export type AppUserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  age: number | null;
  password_setup: boolean;
  created_at: string | null;
};

export type AppUserProfileInput = {
  id: string;
  email: string | null;
  full_name: string;
  age: number;
  password_setup: boolean;
  created_at?: string | null;
};

export async function getCurrentUser() {
  return supabase.auth.getUser();
}

export async function getAppUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('app_user')
    .select('id,email,full_name,age,password_setup,created_at')
    .eq('id', userId)
    .maybeSingle();

  return { profile: (data ?? null) as AppUserProfile | null, error };
}

export async function upsertAppUserProfile(profile: AppUserProfileInput) {
  return supabase.from('app_user').upsert(profile, { onConflict: 'id' });
}

export async function updateAppUserProfile(
  userId: string,
  updates: Pick<AppUserProfileInput, 'email' | 'full_name' | 'age'>,
) {
  return supabase
    .from('app_user')
    .update(updates)
    .eq('id', userId);
}

export async function updateAuthProfile({
  fullName,
  email,
  password,
}: {
  fullName?: string;
  email?: string;
  password?: string;
}) {
  const payload: {
    email?: string;
    password?: string;
    data?: { full_name?: string };
  } = {};

  if (fullName) {
    payload.data = { full_name: fullName };
  }
  if (email) {
    payload.email = email;
  }
  if (password) {
    payload.password = password;
  }

  return supabase.auth.updateUser(payload);
}

export function isProfileComplete(profile: AppUserProfile | null | undefined): profile is AppUserProfile {
  return (
    !!profile &&
    typeof profile.full_name === 'string' &&
    profile.full_name.trim().length > 0 &&
    typeof profile.age === 'number' &&
    profile.age > 0 &&
    profile.password_setup === true
  );
}
