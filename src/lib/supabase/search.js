import { createClient } from "../../utils/supabase/client";
import { EXPERT_INVENTORY } from "../constants/clinical";

const supabase = createClient();

export const searchCases = async (searchTerm) => {
  try {
    const term = searchTerm.trim();
    if (term.length < 2) return { cases: [] };

    // We use the 'clinical_search_view' Ultra-Index to scan EVERY parameter
    const { data: casesData, error: casesError } = await supabase
      .from('clinical_search_view')
      .select(`
        id, 
        title, 
        specialty, 
        user_id, 
        created_at,
        author_name,
        hospital,
        referral_center,
        case_type,
        search_blob
      `)
      .ilike('search_blob', `%${term}%`)
      .order('created_at', { ascending: false })
      .limit(100);

    if (casesError) throw casesError;

    return {
      cases: casesData.map(c => ({
        id: c.id,
        title: c.title,
        // Keep as array for individual pill rendering
        specialties: Array.isArray(c.specialty) ? c.specialty : (c.specialty ? [c.specialty] : []),
        userId: c.user_id,
        author: c.author_name || 'UCCR Doctor',
        createdAt: new Date(c.created_at),
        hospital: c.hospital,
        referralCenter: c.referral_center,
        caseType: c.case_type,
        searchBlob: c.search_blob, // Return for snippet extraction
        // Match Intelligence
        matchType: c.title.toLowerCase().includes(term.toLowerCase()) 
            ? 'Title Match' 
            : (c.hospital?.toLowerCase().includes(term.toLowerCase()) ? 'Facility Match' : 'Clinical Match')
      }))
    };
  } catch (error) {
    console.error('searchCases error:', error.message);
    return { cases: [] };
  }
};

export const getSearchRecommendations = async () => {
  try {
    // 1. Fetch expertly curated phrases or fall back to high-yield inventory
    const expertPhrases = EXPERT_INVENTORY;

    // 2. Dynamic Discovery Layer (Pull actual diagnoses/symptoms from DB)
    const { data: rawPhrases } = await supabase
        .from('cases')
        .select('provisional_diagnosis, presenting_complaint, title')
        .order('created_at', { ascending: false })
        .limit(60);

    const dynamicPhrases = new Set();
    rawPhrases?.forEach(c => {
        if (c.provisional_diagnosis && c.provisional_diagnosis.length < 30) {
            dynamicPhrases.add(c.provisional_diagnosis.trim());
        }
        // Extract common signs if mentioned
        const signs = ['tachycardia', 'bradycardia', 'murmur', 'edema', 'jaundice', 'cyanosis'];
        signs.forEach(s => {
            if (c.presenting_complaint?.toLowerCase().includes(s)) {
                dynamicPhrases.add(s.charAt(0).toUpperCase() + s.slice(1));
            }
        });
    });

    // 3. Specialty Layer
    const { data: trendingSpecs } = await supabase.from('specialties').select('name').limit(15);
    const specs = trendingSpecs?.map(s => s.name) || [];

    // 4. THE NO-MISS POOL: Combine everything
    const candidatePool = [...expertPhrases, ...Array.from(dynamicPhrases), ...specs];
    
    // 5. TRUE RANDOMNESS: Fisher-Yates Shuffle the entire pool
    for (let i = candidatePool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidatePool[i], candidatePool[j]] = [candidatePool[j], candidatePool[i]];
    }

    // Return a generous slice for high-density view
    return candidatePool.slice(0, 18);

  } catch (error) {
    console.error('getSearchRecommendations error:', error.message);
    return ['Cardiology', 'Surgery', 'Diagnostic Challenge', 'Fever', 'Rare Presentation', 'Pediatrics'];
  }
};
