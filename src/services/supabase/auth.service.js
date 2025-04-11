import { supabase } from "../../config/supabase.js";

export async function signUpUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('❌ Signup failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Signup successful! Check your email for confirmation.');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Unexpected error during signup:', err.message);
    return { success: false, error: err.message };
  }
}

export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Login successful!');
    return { success: true, session: data.session, user: data.user };
  } catch (err) {
    console.error('❌ Unexpected error during login:', err.message);
    return { success: false, error: err.message };
  }
}
