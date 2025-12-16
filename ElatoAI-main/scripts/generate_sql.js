const fs = require('fs');
const path = require('path');

const csvPath = 'C:\\Users\\NAMAN KHARBANDA\\Downloads\\ElatoAI-main (2)\\ElatoAI-main\\frontend-nextjs\\personalities_rows.csv';
const targetCreatorId = 'bdd5e026-bbd6-4680-8082-65567a69f98f';

// Simple CSV parser that handles quoted fields with newlines
function parseCSV(text) {
    const lines = [];
    let currentLine = [];
    let currentField = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            currentLine.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuote) {
            if (char === '\r' && nextChar === '\n') i++;
            if (currentLine.length > 0 || currentField.length > 0) {
                currentLine.push(currentField);
                lines.push(currentLine);
                currentLine = [];
                currentField = '';
            }
        } else {
            currentField += char;
        }
    }
    if (currentLine.length > 0 || currentField.length > 0) {
        currentLine.push(currentField);
        lines.push(currentLine);
    }
    return lines;
}

try {
    const data = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(data);
    const headers = rows[0];

    // Map header names to indices
    const colMap = {};
    headers.forEach((h, i) => colMap[h] = i);

    const relevantRows = rows.slice(1).filter(row => row[colMap['creator_id']] === targetCreatorId);

    console.log(`-- Generated SQL migration for ${relevantRows.length} personalities`);
    console.log(`-- Adding personalities from user ${targetCreatorId} to global premade list`);
    console.log('');

    relevantRows.forEach(row => {
        const getVal = (col) => row[colMap[col]];
        const escapeSql = (str) => {
            if (str === null || str === undefined) return 'NULL';
            return `'${str.replace(/'/g, "''")}'`;
        };
        const getBool = (col) => {
            const val = getVal(col);
            return (val === 't' || val === 'true' || val === true) ? 'true' : 'false';
        };
        const getNum = (col) => {
            const val = getVal(col);
            return (val === '' || val === undefined) ? 'NULL' : val;
        }

        // Columns to insert
        // is_doctor, key, is_child_voice, oai_voice, voice_prompt, title, subtitle, short_description, character_prompt, is_story, pitch_factor, first_message_prompt, provider

        // We generate a NEW key to avoid conflict. Append '_premade'
        let originalKey = getVal('key');
        let newKey = originalKey + '_premade';

        const sql = `INSERT INTO public.personalities (
    is_doctor,
    key,
    is_child_voice,
    oai_voice,
    voice_prompt,
    title,
    subtitle,
    short_description,
    character_prompt,
    is_story,
    pitch_factor,
    first_message_prompt,
    provider,
    creator_id
) VALUES (
    ${getBool('is_doctor')},
    ${escapeSql(newKey)},
    ${getBool('is_child_voice')},
    ${escapeSql(getVal('oai_voice'))},
    ${escapeSql(getVal('voice_prompt'))},
    ${escapeSql(getVal('title'))},
    ${escapeSql(getVal('subtitle'))},
    ${escapeSql(getVal('short_description'))},
    ${escapeSql(getVal('character_prompt'))},
    ${getBool('is_story')},
    ${getNum('pitch_factor')},
    ${escapeSql(getVal('first_message_prompt'))},
    ${escapeSql(getVal('provider'))},
    NULL
);`;

        fs.appendFileSync('scripts/migration.sql', sql + '\n\n');
    });
    console.log('Migration SQL written to scripts/migration.sql');

} catch (err) {
    console.error('Error:', err);
}
