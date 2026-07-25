import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pdxvybpwtxbbhnyfhjej.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeHZ5YnB3dHhiYmhueWZoamVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjQ5MzYsImV4cCI6MjA5MjU0MDkzNn0.u-dcL--wTorVZtObhtM-u7PdBDyzJHnyUiZdSshjNWs'
);

async function test() {
  const { data, error } = await supabase.from('first_timers').insert([{
          full_name: "Test",
          email: "test@test.com",
          phone: "123",
          gender: "male",
          street_address: "street",
          state: "state",
          country: "country",
          birthday: "2000-01-01",
          source: "Friend",
          preferred_call_time: "morning",
          campus: "Campus",
          prayer_request: "Prayer"
  }]);
  console.log("Error:", JSON.stringify(error, null, 2));
}

test();
