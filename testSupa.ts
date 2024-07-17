import { supabase } from './client';

async function testSupabase() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'password123',
  });
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('User data:', data);
  }
}

testSupabase();
