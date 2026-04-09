const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log("--- UCCR Database Diagnostic ---");
    
    // 1. Check specialties table
    const { data: specTable, error: specError } = await supabase
        .from('specialties')
        .select('*');
    
    if (specError) {
        console.log("❌ 'specialties' table missing or inaccessible:", specError.message);
    } else {
        console.log("✅ 'specialties' table found. Count:", specTable.length);
        console.log("Sample:", specTable.slice(0, 3).map(s => s.name));
    }

    // 2. Check case_specialties junction
    const { data: junction, error: jungetError } = await supabase
        .from('case_specialties')
        .select('*');
    
    if (jungetError) {
        console.log("❌ 'case_specialties' table missing or inaccessible.");
    } else {
        console.log("✅ 'case_specialties' found. Count:", junction.length);
    }

    // 3. Search for 'Cardiology' in raw cases specialty column
    const { data: rawCases, error: rawError } = await supabase
        .from('cases')
        .select('id, title, specialty')
        .limit(200);

    if (rawError) {
        console.log("❌ Failed to fetch raw cases:", rawError.message);
    } else {
        const cardiologyCases = rawCases.filter(c => {
            const spec = c.specialty;
            if (Array.isArray(spec)) return spec.includes('Cardiology');
            if (typeof spec === 'string') return spec.includes('Cardiology');
            return false;
        });
        console.log("🔍 Search in legacy 'specialty' column:");
        console.log("-> Total cases with 'Cardiology' found:", cardiologyCases.length);
        if (cardiologyCases.length > 0) {
            console.log("-> Sample Case ID:", cardiologyCases[0].id);
        }
    }
}

diagnose();
