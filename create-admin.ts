import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'admin@lolas.com';
  const password = 'admin123';
  const username = 'Lola Admin';

  console.log(`Creating admin user: ${email}...`);

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username }
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('User already exists in Auth. Checking profile...');
      // Try to find the user to get their ID
      const response = await supabase.auth.admin.listUsers();
      const existingUser = response.data?.users.find((u: any) => u.email === email);
      if (existingUser) {
        await createProfile(existingUser.id, email, username);
      } else {
        console.error('Could not find existing user ID.');
      }
    } else {
      console.error('Error creating auth user:', authError.message);
    }
    return;
  }

  if (authData.user) {
    console.log('Auth user created successfully.');
    await createProfile(authData.user.id, email, username);
  }
}

async function createProfile(id: string, email: string, username: string) {
  console.log(`Creating/Updating profile for ${email} (ID: ${id})...`);
  
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id,
      email,
      username,
      role: 'admin',
      phone: '09170000000'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error.message);
  } else {
    console.log('Admin profile created successfully:', data);
  }
}

createAdmin();
