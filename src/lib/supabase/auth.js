import { createClient } from "../../utils/supabase/client";

const supabase = createClient();

export const login = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) throw error;
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error:', error.message);
    return { success: false, error: error.message || 'Failed to log in' };
  }
};

export const signup = async (email, password, name) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: name.trim(),
        }
      }
    });

    if (error) throw error;

    // Supabase usually creates a profile via a trigger, 
    // but if not, we can manually create it here.
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Signup error:', error.message);
    return { success: false, error: error.message || 'Failed to sign up' };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error.message);
    return { success: false, error: error.message || 'Unable to sign out' };
  }
};
