import re
import sys

with open('/Users/mac/Code/uccr/src/components/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# 1. Imports
content = re.sub(
    r"import dynamic from 'next/dynamic';\s*import { sanitize } from '\.\./utils/sanitize';\s*import { v4 as uuidv4 } from 'uuid';\s*const ReactQuill = dynamic\(\(\) => import\('react-quill'\), \{ ssr: false \}\);\s*import 'react-quill/dist/quill\.snow\.css';",
    "import EditCaseForm from './Case/EditCaseForm';",
    content
)

# 2. Delete Form Components (FormHeader, ProgressBar, StepContent, Navigation)
# We find where FormHeader starts and where AdminDashboard starts
admin_dashboard_idx = content.find('export default function AdminDashboard() {')
form_header_idx = content.find('function FormHeader({ title }) {')
if admin_dashboard_idx != -1 and form_header_idx != -1:
    content = content[:form_header_idx] + content[admin_dashboard_idx:]

# 3. State and Refs
# Remove formData, currentStep, isUploading, cloudinaryRef, widgetRef
content = re.sub(r"const \[formData, setFormData\] = useState\(\{[\s\S]*?createdAt: null,\s*\}\);\s*const \[currentStep, setCurrentStep\] = useState\(0\);\s*", "", content)
content = re.sub(r"const \[isUploading, setIsUploading\] = useState\(false\);\s*", "", content)
content = re.sub(r"const cloudinaryRef = useRef\(\);\s*const widgetRef = useRef\(\);\s*", "", content)

# 4. Remove steps array and Cloudinary useEffect
steps_start = content.find('const steps = [')
steps_end = content.find('const handleLogin = (e) => {')
if steps_start != -1 and steps_end != -1:
    content = content[:steps_start] + content[steps_end:]

cloudinary_start = content.find("useEffect(() => {\n    if (typeof window === 'undefined') return;\n    const script = document.createElement('script');")
cloudinary_end = content.find("const handleEdit = (caseItem) => {")
if cloudinary_start != -1 and cloudinary_end != -1:
    content = content[:cloudinary_start] + content[cloudinary_end:]

# 5. Simplify handleEdit
handle_edit_old = """const handleEdit = (caseItem) => {
    setEditingCaseId(caseItem.id);
    setFormData({
      title: caseItem.title || '',
      presentingComplaint: caseItem.presentingComplaint || '',
      history: caseItem.history || '',
      physicalExam: caseItem.physicalExam || '',
      investigations: caseItem.investigations || '',
      management: caseItem.management || '',
      provisionalDiagnosis: caseItem.provisionalDiagnosis || '',
      hospital: caseItem.hospital || '',
      referralCenter: caseItem.referralCenter || '',
      specialty: Array.isArray(caseItem.specialty) ? caseItem.specialty : [],
      discussion: caseItem.discussion || '',
      highLevelSummary: caseItem.highLevelSummary || '',
      references: caseItem.references || '',
      mediaUrls: Array.isArray(caseItem.mediaUrls) ? caseItem.mediaUrls : [],
      userId: caseItem.userId || '',
      userName: caseItem.userName || 'Anonymous',
      photoURL: caseItem.photoURL || '',
      thumbnailUrl: caseItem.thumbnailUrl || '',
      createdAt: caseItem.createdAt || null,
    });
    setCurrentStep(0);
  };"""

handle_edit_new = """const handleEdit = (caseItem) => {
    setEditingCaseId(caseItem.id);
  };"""
content = content.replace(handle_edit_old, handle_edit_new)

# 6. Remove handleChange, handleDeleteMedia, validateStep, nextStep, prevStep, handleSubmit, handleCloseEdit
funcs_to_remove = [
    (r"const handleChange = [\s\S]*?};\n", ""),
    (r"const handleDeleteMedia = [\s\S]*?};\n", ""),
    (r"const validateStep = [\s\S]*?};\n", ""),
    (r"const nextStep = [\s\S]*?};\n", ""),
    (r"const prevStep = [\s\S]*?};\n", ""),
    (r"const handleSubmit = async \(e\) => \{[\s\S]*?finally \{\s*setIsLoading\(false\);\s*\}\s*\};\n", "")
]
for pattern, repl in funcs_to_remove:
    content = re.sub(pattern, repl, content)

# 7. Add handleAdminSuccess and keep simple handleCloseEdit
handle_close_old = """const handleCloseEdit = () => {
    setEditingCaseId(null);
    setFormData({
      title: '',
      presentingComplaint: '',
      history: '',
      physicalExam: '',
      investigations: '',
      management: '',
      provisionalDiagnosis: '',
      hospital: '',
      referralCenter: '',
      specialty: [],
      discussion: '',
      highLevelSummary: '',
      references: '',
      mediaUrls: [],
      userId: '',
      userName: '',
      photoURL: '',
      thumbnailUrl: '',
      createdAt: null,
    });
    setCurrentStep(0);
    setError('');
  };"""

handle_close_new = """const handleCloseEdit = () => {
    setEditingCaseId(null);
  };

  const handleAdminSuccess = async (updatedCaseData) => {
    setEditingCaseId(null);
    try {
      setIsLoading(true);
      const allCases = await getCases();
      setCases(allCases);
    } catch (err) {
      setError('Failed to refresh cases.');
    } finally {
      setIsLoading(false);
    }
  };"""

content = content.replace(handle_close_old, handle_close_new)

# 8. Render of Modal
modal_old = """<div className={styles.caseFormWrapper}>
              <div className={styles.caseForm}>
                <FormHeader title="Edit Case" />
                <ProgressBar currentStep={currentStep} stepsLength={steps.length} />
                <form onSubmit={handleSubmit}>
                  <div className={styles.stepContentWrapper}>
                    <StepContent
                      steps={steps}
                      currentStep={currentStep}
                      formData={formData}
                      handleChange={handleChange}
                      handleDeleteMedia={handleDeleteMedia}
                      widgetRef={widgetRef}
                      isUploading={isUploading}
                    />
                  </div>
                  <Navigation
                    currentStep={currentStep}
                    stepsLength={steps.length}
                    isUploading={isUploading}
                    isLoading={isLoading}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    submitText="Update Case"
                  />
                  <ErrorMessage error={error} />
                </form>
              </div>
            </div>"""

modal_new = """<div className={styles.adminEditFormContainer}>
              <EditCaseForm 
                caseId={editingCaseId} 
                isAdmin={true} 
                onAdminSuccess={handleAdminSuccess} 
                onAdminCancel={handleCloseEdit} 
              />
            </div>"""
content = content.replace(modal_old, modal_new)

with open('/Users/mac/Code/uccr/src/components/AdminDashboard.jsx', 'w') as f:
    f.write(content)

print('AdminDashboard.jsx updated')
