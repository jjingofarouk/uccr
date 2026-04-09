import { createClient } from "../../utils/supabase/client";

const supabase = createClient();

export const addECG = async (ecgData) => {
  try {
    const validatedData = {
      case_type: 'ecg',
      user_id: ecgData.userId,
      user_name: ecgData.userName || 'Anonymous',
      title: ecgData.title || '',
      clinical_context: ecgData.clinicalContext || '',
      rate: ecgData.rate || '',
      rhythm: ecgData.rhythm || '',
      axis: ecgData.axis || '',
      p_wave: ecgData.pWave || '',
      pr_interval: ecgData.prInterval || '',
      qrs_complex: ecgData.qrsComplex || '',
      st_segment: ecgData.stSegment || '',
      t_wave: ecgData.tWave || '',
      qt_interval: ecgData.qtInterval || '',
      interpretation: ecgData.interpretation || '',
      teaching_points: ecgData.teachingPoints || '',
      media_urls: Array.isArray(ecgData.mediaUrls) ? ecgData.mediaUrls : [],
      category: ecgData.category || 'All',
      photo_url: ecgData.photoURL || '',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('cases')
      .insert([validatedData])
      .select();

    if (error) throw error;
    return data[0].id;
  } catch (error) {
    console.error('Error adding ECG:', error.message);
    throw error;
  }
};

export const getECGs = async () => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('case_type', 'ecg')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      userName: item.user_name,
      title: item.title,
      clinicalContext: item.clinical_context,
      rate: item.rate,
      rhythm: item.rhythm,
      axis: item.axis,
      pWave: item.p_wave,
      prInterval: item.pr_interval,
      qrsComplex: item.qrs_complex,
      stSegment: item.st_segment,
      tWave: item.t_wave,
      qtInterval: item.qt_interval,
      interpretation: item.interpretation,
      teachingPoints: item.teaching_points,
      mediaUrls: item.media_urls,
      category: item.category,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      photoURL: item.photo_url || '/images/photo-placeholder.jpg',
    }));
  } catch (error) {
    console.error('Error fetching ECGs:', error.message);
    throw error;
  }
};

export const getECGById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .eq('case_type', 'ecg')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      title: data.title,
      clinicalContext: data.clinical_context,
      rate: data.rate,
      rhythm: data.rhythm,
      axis: data.axis,
      pWave: data.p_wave,
      prInterval: data.pr_interval,
      qrsComplex: data.qrs_complex,
      stSegment: data.st_segment,
      tWave: data.t_wave,
      qtInterval: data.qt_interval,
      interpretation: data.interpretation,
      teachingPoints: data.teaching_points,
      mediaUrls: data.media_urls,
      category: data.category,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      photoURL: data.photo_url || '/images/photo-placeholder.jpg',
    };
  } catch (error) {
    console.error('Error fetching ECG by ID:', error.message);
    throw error;
  }
};

export const updateECG = async (id, ecgData) => {
  try {
    const validatedData = {
      ...ecgData,
      updated_at: new Date().toISOString(),
    };
    delete validatedData.id;
    delete validatedData.createdAt;

    const { error } = await supabase
      .from('cases')
      .update(validatedData)
      .eq('id', id);

    if (error) throw error;
    return id;
  } catch (error) {
    console.error('Error updating ECG:', error.message);
    throw error;
  }
};
