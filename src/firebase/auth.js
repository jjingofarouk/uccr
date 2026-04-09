// src/firebase/auth.js - HIJACKED FOR SUPABASE BRIDGE
import { login as sbLogin, signup as sbSignup, logout as sbLogout } from '../lib/supabase/auth';
import { createClient } from '../utils/supabase/client';

const supabase = createClient();

export const login = sbLogin;
export const signup = sbSignup;
export const logout = sbLogout;

export const auth = supabase.auth;

export const updateAuthProfile = async (user, data) => {
    // In Supabase we update metadata
    const { error } = await supabase.auth.updateUser({
        data: {
            display_name: data.displayName,
            photo_url: data.photoURL
        }
    });
    return { success: !error, error: error?.message };
};