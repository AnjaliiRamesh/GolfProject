'use server';

import { createClient } from '@/lib/supabase/server';
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '@/validators/auth.schema';
import { FormState } from '@/types';
import { revalidatePath } from 'next/cache';
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email/service';

export async function signUp(data: SignUpInput): Promise<FormState> {
  try {
    const validatedData = signUpSchema.parse(data);
    const supabase = await createClient();

    // const { error } = await supabase.auth.signUp({
  const { data: authData, error } = await supabase.auth.signUp({
  email: validatedData.email,
  password: validatedData.password,
  options: {
    data: {
      full_name: validatedData.fullName,
    },
  },
});

// console.log("SIGNUP RESULT:", authData);
// console.log("SIGNUP ERROR:", error); 
    
    // Send welcome email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`;
    await sendWelcomeEmail(
      validatedData.email,
      validatedData.fullName,
      verificationUrl
    );

    return {
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
    };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message || 'An error occurred during sign up' };
  }
}

export async function signIn(data: SignInInput): Promise<FormState> {
  try {
    const validatedData = signInSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    revalidatePath('/', 'layout');
    return { success: true, message: 'Logged in successfully' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message || 'Invalid credentials' };
  }
}

export async function signOut(): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true, message: 'Logged out successfully' };
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<FormState> {
  try {
    const validatedData = forgotPasswordSchema.parse(data);
    const supabase = await createClient();

    // Get user profile to get full name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('email', validatedData.email)
      .single();

    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Send password reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`;
    await sendPasswordResetEmail(
      validatedData.email,
      profile?.full_name || 'User',
      resetUrl
    );

    return { success: true, message: 'Password reset instructions sent to your email.' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
}

export async function resetPassword(data: ResetPasswordInput): Promise<FormState> {
  try {
    const validatedData = resetPasswordSchema.parse(data);
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Password has been reset successfully.' };
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return { success: false, message: 'Validation failed', errors: error.flatten().fieldErrors };
    }
    return { success: false, message: error.message || 'An error occurred' };
  }
}
