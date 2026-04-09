import { createClient } from "../../utils/supabase/client";

const supabase = createClient();

export const addCase = async (caseData) => {
  try {
    const validatedData = {
      user_id: caseData.userId,
      user_name: caseData.userName || 'Anonymous',
      case_type: caseData.caseType || 'clinical',
      title: caseData.title || '',
      specialty: Array.isArray(caseData.specialty) ? caseData.specialty : [],
      presenting_complaint: caseData.presentingComplaint || '',
      history: caseData.history || '',
      physical_exam: caseData.physicalExam || '',
      investigations: caseData.investigations || '',
      provisional_diagnosis: caseData.provisionalDiagnosis || '',
      management: caseData.management || '',
      discussion: caseData.discussion || '',
      high_level_summary: caseData.highLevelSummary || '',
      case_references: caseData.references || '',
      hospital: caseData.hospital || '',
      referral_center: caseData.referralCenter || '',
      media_urls: Array.isArray(caseData.mediaUrls) ? caseData.mediaUrls : [],
      awards: Number(caseData.awards || 0),
      thumbnail_url: caseData.thumbnailUrl || '',
      photo_url: caseData.photoURL || '',
      updated_at: new Date().toISOString(),
    };

    // 1. Insert the main case
    const { data, error } = await supabase
      .from('cases')
      .insert([validatedData])
      .select();

    if (error) throw error;
    const newCaseId = data[0].id;

    // 2. Step 2 Enhancement: Sync with Normalized Specialty Tables
    // We do this in a try-catch so the main case is saved even if schema migration is in progress
    try {
      if (Array.isArray(caseData.specialty) && caseData.specialty.length > 0) {
        for (const specName of caseData.specialty) {
          if (!specName) continue;
          
          // Ensure specialty exists in master list
          const { data: specRecord } = await supabase
            .from('specialties')
            .upsert({ name: specName }, { onConflict: 'name' })
            .select()
            .single();

          if (specRecord) {
            // Link case to specialty
            await supabase
              .from('case_specialties')
              .upsert({ 
                case_id: newCaseId, 
                specialty_id: specRecord.id 
              }, { onConflict: 'case_id,specialty_id' });
          }
        }
      }
    } catch (syncError) {
      console.warn('Specialty normalization sync skipped:', syncError.message);
      // Not throwing here because the case was already added to the main table
    }

    return newCaseId;
  } catch (error) {
    console.error('Add case error:', error.message);
    throw error;
  }
};

export const getCases = async (uid = null) => {
  try {
    let query = supabase.from('cases').select('*').neq('case_type', 'ecg');
    
    if (uid) {
      query = query.eq('user_id', uid);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name,
      title: item.title,
      specialty: item.specialty,
      presentingComplaint: item.presenting_complaint,
      history: item.history,
      physicalExam: item.physical_exam,
      investigations: item.investigations,
      provisionalDiagnosis: item.provisional_diagnosis,
      management: item.management,
      discussion: item.discussion,
      highLevelSummary: item.high_level_summary,
      references: item.case_references,
      hospital: item.hospital,
      referralCenter: item.referral_center,
      mediaUrls: item.media_urls,
      awards: item.awards,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      photoURL: item.photo_url || '/images/photo-placeholder.jpg',
      thumbnailUrl: item.thumbnail_url,
    }));
  } catch (error) {
    console.error('Error fetching cases:', error.message);
    throw error;
  }
};

export const getCaseById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (data.case_type === 'ecg') return null;

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      title: data.title,
      specialty: data.specialty,
      presentingComplaint: data.presenting_complaint,
      history: data.history,
      physicalExam: data.physical_exam,
      investigations: data.investigations,
      provisionalDiagnosis: data.provisional_diagnosis,
      management: data.management,
      discussion: data.discussion,
      highLevelSummary: data.high_level_summary,
      references: data.case_references,
      hospital: data.hospital,
      referralCenter: data.referral_center,
      mediaUrls: data.media_urls,
      awards: data.awards,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      photoURL: data.photo_url || '/images/photo-placeholder.jpg',
      thumbnailUrl: data.thumbnail_url,
    };
  } catch (error) {
    console.error('Error fetching case by ID:', error.message);
    throw error;
  }
};

export const updateCase = async (caseId, caseData) => {
  try {
    const validatedData = {
      user_name: caseData.userName,
      title: caseData.title,
      specialty: caseData.specialty,
      presenting_complaint: caseData.presentingComplaint,
      history: caseData.history,
      physical_exam: caseData.physicalExam,
      investigations: caseData.investigations,
      provisional_diagnosis: caseData.provisionalDiagnosis,
      management: caseData.management,
      discussion: caseData.discussion,
      high_level_summary: caseData.highLevelSummary,
      case_references: caseData.references,
      hospital: caseData.hospital,
      referral_center: caseData.referralCenter,
      media_urls: caseData.mediaUrls,
      awards: caseData.awards,
      thumbnail_url: caseData.thumbnailUrl,
      photo_url: caseData.photoURL,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('cases')
      .update(validatedData)
      .eq('id', caseId);

    if (error) throw error;
    return caseId;
  } catch (error) {
    console.error('Update case error:', error.message);
    throw error;
  }
};

export const deleteCase = async (caseId) => {
  try {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', caseId);

    if (error) throw error;
  } catch (error) {
    console.error('Delete case error:', error.message);
    throw error;
  }
};
