const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpPrompts() {
    const { data, error } = await supabase.from('personalities').select('title, character_prompt, first_message_prompt, is_doctor, is_story, is_child_voice');
    if (error) {
        console.error(error);
        process.exit(1);
    }
    const fs = require('fs');
    fs.writeFileSync('prompts_dump.json', JSON.stringify(data, null, 2));
    console.log('Saved to prompts_dump.json');
}

dumpPrompts();
