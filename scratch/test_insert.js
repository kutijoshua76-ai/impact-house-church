import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pdxvybpwtxbbhnyfhjej.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeHZ5YnB3dHhiYmhueWZoamVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjQ5MzYsImV4cCI6MjA5MjU0MDkzNn0.u-dcL--wTorVZtObhtM-u7PdBDyzJHnyUiZdSshjNWs'
);

async function testInsert() {
  const { error } = await supabase.from('first_timers').insert([{
    full_name: 'Test',
    email: 'test@example.com',
    phone: '1234',
    street_address: '123',
    state: 'State',
    campus: 'Campus',
    invited_by: 'Friend',
    gender: 'male',
    country: 'Country',
    birthday: '2000-01-01',
    preferred_call_time: 'morning',
    prayer_request: 'test'
  }]);
  
  if (error) {
    console.error('Insert error:', error);
  } else {
    console.log('Insert succeeded! The columns exist.');
    // cleanup
    await supabase.from('first_timers').delete().eq('email', 'test@example.com');
  }
}
testInsert();
