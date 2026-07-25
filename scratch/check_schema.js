import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pdxvybpwtxbbhnyfhjej.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkeHZ5YnB3dHhiYmhueWZoamVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjQ5MzYsImV4cCI6MjA5MjU0MDkzNn0.u-dcL--wTorVZtObhtM-u7PdBDyzJHnyUiZdSshjNWs'
);

async function checkSchema() {
  const { data, error } = await supabase.from('first_timers').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Columns:', Object.keys(data[0] || {}));
    if (data.length > 0) {
      console.log('Data sample:', data[0]);
    } else {
      console.log('No data found, trying to trigger a helpful error message...');
      const { error: insertError } = await supabase.from('first_timers').insert([{ fake_column: 'test' }]);
      console.log('Insert error to reveal schema:', insertError);
    }
  }
}
checkSchema();
