import { createClient } from "../../utils/supabase/client";

const supabase = createClient();

export const getProfile = async (uid) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) throw error;

    return {
      uid: data.id,
      role: data.role || '',
      photoURL: data.photo_url || '/images/doctor-avatar.jpeg',
      displayName: data.display_name || 'User',
      email: data.email || '',
      title: data.title || '',
      education: data.education || '',
      institution: data.institution || '',
      specialty: data.specialty || '',
      bio: data.bio || '',
      linkedIn: data.linked_in || '',
      xProfile: data.x_profile || '',
      researchInterests: data.research_interests || [],
      certifications: data.certifications || [],
      yearsOfExperience: data.years_of_experience || '',
      professionalAffiliations: data.professional_affiliations || [],
      levelOfStudy: data.level_of_study || '',
      courseOfStudy: data.course_of_study || '',
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
    };
  } catch (error) {
    console.error('Get profile error:', error.message);
    return {
      uid,
      role: '',
      photoURL: '/images/doctor-avatar.jpeg',
      displayName: 'User',
      email: '',
      title: '',
      education: '',
      institution: '',
      specialty: '',
      bio: '',
      researchInterests: [],
      certifications: [],
      professionalAffiliations: [],
      updatedAt: new Date(),
    };
  }
};

export const updateProfile = async (uid, profileData) => {
  try {
    const validatedData = {
      display_name: profileData.displayName,
      email: profileData.email,
      photo_url: profileData.photoURL,
      title: profileData.title,
      education: profileData.education,
      institution: profileData.institution,
      specialty: profileData.specialty,
      bio: profileData.bio,
      role: profileData.role,
      linked_in: profileData.linkedIn,
      x_profile: profileData.xProfile,
      research_interests: profileData.researchInterests,
      certifications: profileData.certifications,
      years_of_experience: profileData.yearsOfExperience,
      professional_affiliations: profileData.professionalAffiliations,
      level_of_study: profileData.levelOfStudy,
      course_of_study: profileData.courseOfStudy,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: uid, ...validatedData });

    if (error) throw error;
  } catch (error) {
    console.error('Update profile error:', error.message);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role, display_name, email, photo_url, level_of_study, course_of_study');

    if (error) throw error;

    return data.map(user => ({
      uid: user.id,
      role: user.role || '',
      displayName: user.display_name || 'User',
      email: user.email || '',
      photoURL: user.photo_url || '/images/doctor-avatar.jpeg',
      levelOfStudy: user.level_of_study || '',
      courseOfStudy: user.course_of_study || '',
    }));
  } catch (error) {
    console.error('Get users error:', error.message);
    return [];
  }
};
