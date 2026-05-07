import type { User } from '@supabase/supabase-js';
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
  full_name: string | null;
  age: number | null;
  password_setup: boolean;
  created_at?: string | null;
};

export type CompleteAppUserProfile = AppUserProfile & {
  full_name: string;
  age: number;
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
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const user = sessionData.session?.user;

  if (sessionError) {
    return { data: null, error: sessionError };
  }

  if (!user) {
    return { data: null, error: new Error('No authenticated Supabase user session found.') };
  }

  const profileForAuthenticatedUser = {
    ...profile,
    id: user.id,
    email: profile.email ?? user.email ?? null,
  };

  return supabase
    .from('app_user')
    .upsert(profileForAuthenticatedUser, { onConflict: 'id' })
    .select('id,email,full_name,age,password_setup,created_at')
    .maybeSingle();
}

export async function ensureAppUserProfile(user: User) {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  const authenticatedUser = sessionData.session?.user;

  if (sessionError) {
    return { profile: null, error: sessionError };
  }

  if (!authenticatedUser || authenticatedUser.id !== user.id) {
    return { profile: null, error: new Error('No authenticated Supabase user session found.') };
  }

  const existing = await getAppUserProfile(authenticatedUser.id);

  if (existing.error) {
    return existing;
  }

  if (existing.profile) {
    return existing;
  }

  const metadataName = authenticatedUser.user_metadata?.full_name;
  const fullName = typeof metadataName === 'string' && metadataName.trim().length > 0
    ? metadataName.trim()
    : null;

  const { data, error } = await upsertAppUserProfile({
    id: authenticatedUser.id,
    email: authenticatedUser.email ?? null,
    full_name: fullName,
    age: null,
    password_setup: false,
    created_at: new Date().toISOString(),
  });

  return { profile: (data ?? null) as AppUserProfile | null, error };
}

export async function updateAppUserProfile(
  userId: string,
  updates: Pick<AppUserProfileInput, 'email' | 'full_name' | 'age'>,
) {
  return supabase
    .from('app_user')
    .update(updates)
    .eq('id', userId)
    .select('id,email,full_name,age,password_setup,created_at')
    .maybeSingle();
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

export function isProfileComplete(profile: AppUserProfile | null | undefined): profile is CompleteAppUserProfile {
  return (
    !!profile &&
    typeof profile.full_name === 'string' &&
    profile.full_name.trim().length > 0 &&
    typeof profile.age === 'number' &&
    profile.age > 0
  );
}
