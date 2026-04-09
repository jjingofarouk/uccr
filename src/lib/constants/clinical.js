// constants/clinical.js
export const EXPERT_INVENTORY = [
    // ==================== 1. CLINICAL PRESENTATIONS & SYNDROMES ====================
    'Diagnostic Challenge', 'Rare Presentation', 'Atypical Presentation', 'Classic Presentation',
    'Acute Management', 'Chronic Care', 'Subacute Presentation', 'Transient Finding', 'Persistent Sign',
    'Emergent Case', 'Incidentaloma', 'Occult Pathology', 'Silent Presentation', 'Masked Symptoms',
    'Fulminant Course', 'Insidious Onset', 'Recurrent Episode', 'Relapsing-Remitting', 'Progressive Decline',
    'Paroxysmal Event', 'Nocturnal Symptom', 'Exercise-Induced', 'Postprandial', 'Fasting-Related',
    'Chief Complaint', 'Non-Specific Symptoms', 'Altered Mental Status', 'Generalized Weakness', 'Fatigue',
    'Weight Loss', 'Weight Gain', 'Anorexia', 'Night Sweats', 'Chills', 'Malaise', 'Failure to Thrive',
    'Acute Abdomen', 'Acute Coronary Syndrome', 'Acute Decompensated Heart Failure', 'Acute Kidney Injury Presentation',
    'Back Pain', 'Flank Pain', 'Low Back Pain', 'Leg Pain', 'Joint Pain', 'Swelling', 'Limb Weakness',
    'Dizziness', 'Vertigo', 'Lightheadedness', 'Syncope', 'Pre-Syncope', 'Palpitations', 'Shortness of Breath',
    'Dyspnea on Exertion', 'Orthopnea', 'Paroxysmal Nocturnal Dyspnea', 'Hemoptysis', 'Hematemesis',
    'Melena', 'Hematochezia', 'Rectal Bleeding', 'Diarrhea', 'Constipation', 'Vomiting', 'Nausea',
    'Headache', 'Migraine', 'Cluster Headache', 'Thunderclap Headache', 'Visual Changes', 'Blurred Vision',
    'Double Vision', 'Vision Loss', 'Hearing Loss', 'Tinnitus', 'Rash', 'Itching', 'Urticaria',
    'Anaphylactoid Reaction', 'Angioedema', 'Fever of Unknown Origin', 'Recurrent Fever', 'Periodic Fever',

    // ==================== 2. PATHOPHYSIOLOGICAL MECHANISMS ====================
    'Drug-Induced', 'Idiopathic', 'Paraneoplastic', 'Autoimmune', 'Iatrogenic', 'Infectious',
    'Congenital', 'Metabolic', 'Ischemic', 'Degenerative', 'Inflammatory', 'Neoplastic',
    'Traumatic', 'Toxic', 'Nutritional Deficiency', 'Endocrine', 'Hematologic', 'Genetic',
    'Immunodeficiency', 'Hypersensitivity', 'Allergic', 'Vasculitic', 'Granulomatous',
    'Fibrotic', 'Hypercoagulable', 'Embolic', 'Thrombotic', 'Obstructive', 'Compressive',
    'Infiltrative', 'Demyelinating', 'Channelopathy', 'Storage Disorder', 'Mitochondrial',
    'Oxidative Stress', 'Apoptosis', 'Necrosis', 'Infarction', 'Hemorrhage', 'Edema', 'Effusion',
    'Hyperplasia', 'Hypertrophy', 'Atrophy', 'Metaplasia', 'Dysplasia', 'Neoplasia', 'Metastasis',
    'Immune Complex', 'Type I Hypersensitivity', 'Type II Hypersensitivity', 'Type III Hypersensitivity',
    'Type IV Hypersensitivity', 'Cytokine Storm', 'SIRS', 'Compensated Shock', 'Decompensated Shock',

    // ==================== 3. MANAGEMENT, INTERVENTIONS & OUTCOMES ====================
    'Surgical Technique', 'Management Strategy', 'Treatment Outcome', 'Pharmacovigilance',
    'Refractory Case', 'Successful Intervention', 'Complication', 'Post-operative', 'Emergency Protocol',
    'Follow-up', 'Triage Decision', 'Multidisciplinary', 'Palliative Approach', 'Conservative Management',
    'Interventional Procedure', 'Minimally Invasive', 'Open Surgery', 'Laparoscopic', 'Robotic Surgery',
    'Endoscopic Intervention', 'Percutaneous', 'Thrombolysis', 'Anticoagulation', 'Immunosuppression',
    'Chemotherapy', 'Radiotherapy', 'Targeted Therapy', 'Biologic Agent', 'Supportive Care',
    'Rehabilitation', 'Prognosis', 'Remission', 'Relapse', 'Mortality', 'Morbidity', 'Quality of Life',
    'Cost-Effective', 'Evidence-Based', 'Guideline-Directed', 'Advanced Life Support', 'Basic Life Support',
    'Cardiopulmonary Resuscitation', 'Defibrillation', 'Cardioversion', 'Mechanical Ventilation',
    'Non-Invasive Ventilation', 'ECMO', 'CRRT', 'Dialysis', 'Transfusion', 'Fluid Resuscitation',
    'Vasopressor Support', 'Inotropic Support', 'Nutritional Support', 'Pain Management', 'Sedation',
    'Airway Management', 'Difficult Airway', 'Rapid Sequence Intubation',

    // ==================== 4. DIAGNOSTIC PITFALLS, ERRORS & QUALITY ====================
    'Diagnostic Error', 'Near Miss', 'Clinical Pitfall', 'Cognitive Bias', 'Anchoring Bias',
    'Availability Bias', 'Confirmation Bias', 'Premature Closure', 'Diagnostic Algorithm',
    'Differential Diagnosis', 'Red Herring', 'Mimicker', 'Zebras', 'Common Things Common',
    'Radiological Sign', 'Histological Finding', 'Pathological Correlation', 'False Positive',
    'False Negative', 'Sensitivity', 'Specificity', 'Likelihood Ratio', 'Bayes Theorem',
    'Overdiagnosis', 'Underdiagnosis', 'Missed Diagnosis', 'Root Cause Analysis',
    'Morbidity and Mortality Conference', 'Handover Error', 'Communication Failure',

    // ==================== 5. PATIENT DEMOGRAPHICS & SPECIAL CONTEXTS ====================
    'Geriatric', 'Pediatric', 'Neonatal', 'Infant', 'Toddler', 'Adolescent', 'Young Adult',
    'Obstetric', 'Pregnant', 'Postpartum', 'Peripartum', 'Psychosocial', 'Environmental Exposure',
    'Travel-Related', 'Occupational', 'Agricultural', 'Industrial', 'Tropical', 'Zoonotic',
    'Immigrant', 'Refugee', 'Indigenous', 'Athlete', 'Military', 'Prison', 'Homeless',
    'Immunocompromised', 'Transplant Recipient', 'HIV', 'Diabetic', 'Obese', 'Malnourished',
    'Elderly Frail', 'Post-Menopausal', 'Neonatal Intensive Care', 'Premature Infant',
    'Breastfeeding', 'Substance Use Disorder', 'Alcohol Withdrawal', 'Opioid Dependence',

    // ==================== 6. HIGH-YIELD MARKERS, SIGNS & TOOLS ====================
    'Physical Signs', 'Clinical Innovation', 'Rare Syndrome', 'Genetic Marker', 'Prognostic Factor',
    'Biomarker Study', 'Risk Stratification', 'Atypical Imaging', 'Bedside Tool', 'Physical Examination',
    'Vital Signs', 'Murmur', 'Gallop', 'Friction Rub', 'Bruit', 'Thrill', 'Clubbing', 'Cyanosis',
    'Jaundice', 'Edema', 'Ascites', 'Hepatomegaly', 'Splenomegaly', 'Lymphadenopathy',
    'Rash', 'Purpura', 'Petechiae', 'Erythema', 'Desquamation', 'Neurological Deficit',
    'Seizure', 'Altered Mental Status', 'Delirium', 'Coma', 'Focal Weakness', 'Ataxia',
    'Babinski Sign', 'Kernig Sign', 'Brudzinski Sign', 'Chvostek Sign', 'Trousseau Sign',
    'Murphy Sign', 'Rovsing Sign', 'Psoas Sign', 'Obturator Sign', 'Courvoisier Sign',
    'Homan Sign', 'Battle Sign', 'Raccoon Eyes', 'Cullen Sign', 'Grey Turner Sign',

    // ==================== 7. ORGAN-SYSTEM SPECIFIC (Broad Coverage) ====================
    // Cardiology
    'Chest Pain', 'Dyspnea', 'Palpitations', 'Syncope', 'Heart Failure', 'Myocardial Infarction',
    'Arrhythmia', 'Valvular Disease', 'Cardiomyopathy', 'Pericarditis', 'Endocarditis',
    'Aortic Dissection', 'Pulmonary Embolism', 'Hypertension', 'Hypotension', 'Shock',
    'Atrial Fibrillation', 'Ventricular Tachycardia', 'Bradycardia', 'Heart Block',
    'Cardiac Tamponade', 'Constrictive Pericarditis', 'Aortic Aneurysm', 'Peripheral Artery Disease',

    // Respiratory
    'Cough', 'Hemoptysis', 'Wheeze', 'Stridor', 'Pleural Effusion', 'Pneumonia', 'ARDS',
    'COPD Exacerbation', 'Asthma', 'Interstitial Lung Disease', 'Pneumothorax',
    'Pulmonary Edema', 'Respiratory Failure', 'Hypoxemia', 'Hypercapnia', 'Pleural Rub',

    // Gastroenterology
    'Abdominal Pain', 'Hematemesis', 'Melena', 'Hematochezia', 'Diarrhea', 'Constipation',
    'Jaundice', 'Ascites', 'Liver Failure', 'Pancreatitis', 'IBD Flare', 'GI Bleeding',
    'Appendicitis', 'Cholecystitis', 'Diverticulitis', 'Bowel Obstruction', 'Perforated Viscus',
    'Upper GI Bleed', 'Lower GI Bleed', 'Dysphagia', 'Odynophagia',

    // Neurology
    'Headache', 'Stroke', 'TIA', 'Seizure', 'Meningitis', 'Encephalitis', 'Neuropathy',
    'Myopathy', 'Movement Disorder', 'Dementia', 'Parkinsonism', 'Subarachnoid Hemorrhage',
    'Intracerebral Hemorrhage', 'Status Epilepticus', 'Guillain-Barre Syndrome', 'Myasthenia Gravis',

    // Infectious Diseases
    'Fever', 'Fever of Unknown Origin', 'Sepsis', 'Septic Shock', 'Tropical Fever',
    'Opportunistic Infection', 'Antibiotic Resistance', 'Viral Exanthem', 'Zoonosis',
    'Malaria', 'Tuberculosis', 'HIV-Related Illness', 'COVID-19', 'Influenza', 'Pneumocystis',

    // Oncology & Hematology
    'Malignancy', 'Solid Tumor', 'Hematologic Malignancy', 'Lymphoma', 'Leukemia',
    'Anemia', 'Thrombocytopenia', 'Coagulopathy', 'Hypercalcemia', 'Tumor Lysis',
    'Sickle Cell Crisis', 'Hemophilia', 'Thrombosis', 'Disseminated Intravascular Coagulation',

    // Nephrology & Electrolytes
    'Acute Kidney Injury', 'Chronic Kidney Disease', 'Electrolyte Imbalance',
    'Hyponatremia', 'Hyperkalemia', 'Acidosis', 'Alkalosis', 'Nephrotic Syndrome',
    'Nephritic Syndrome', 'Urinary Tract Infection', 'Pyelonephritis', 'Hematuria',

    // Endocrinology
    'Diabetes', 'Diabetic Ketoacidosis', 'Hypoglycemia', 'Thyroid Storm', 'Myxedema',
    'Adrenal Crisis', 'Cushing Syndrome', 'Hyperparathyroidism', 'Hypothyroidism',
    'Hyperthyroidism', 'Addison Disease',

    // Rheumatology & Immunology
    'Arthritis', 'Joint Pain', 'Vasculitis', 'Connective Tissue Disease', 'SLE Flare',
    'Anaphylaxis', 'Angioedema', 'Rheumatoid Arthritis', 'Gout', 'Pseudogout',

    // ==================== 8. PROCEDURES, IMAGING & INVESTIGATIONS ====================
    'ECG Finding', 'Echocardiogram', 'Chest X-ray', 'CT Scan', 'MRI', 'Ultrasound',
    'Endoscopy', 'Colonoscopy', 'Bronchoscopy', 'Lumbar Puncture', 'Biopsy',
    'Angiography', 'Cardiac Catheterization', 'PET Scan', 'Bone Marrow',
    'X-Ray', 'Computed Tomography', 'Magnetic Resonance Imaging', 'Positron Emission Tomography',
    'Single-Photon Emission CT', 'Mammography', 'DEXA Scan', 'Fluoroscopy',
    'Point-of-Care Ultrasound', 'FAST Exam', 'Focused Assessment with Sonography for Trauma',
    'Transesophageal Echo', 'Stress Test', 'Holter Monitor', 'EEG', 'EMG', 'Nerve Conduction Study',

    // ==================== 9. SPECIAL SITUATIONS & EMERGENCIES ====================
    'Polytrauma', 'Burn Injury', 'Drowning', 'Poisoning', 'Overdose', 'Envenomation',
    'Heat Stroke', 'Hypothermia', 'High Altitude', 'Diving Medicine', 'Disaster Medicine',
    'Mass Casualty', 'Bioterrorism', 'Pandemic', 'Outbreak', 'Cardiac Arrest',
    'Respiratory Arrest', 'Anaphylactic Shock', 'Hemorrhagic Shock', 'Cardiogenic Shock',
    'Obstructive Shock', 'Distributive Shock', 'Traumatic Brain Injury', 'Spinal Cord Injury',
    'Abdominal Compartment Syndrome', 'Compartment Syndrome', 'Rhabdomyolysis',
    'Toxicology Emergency', 'Opioid Overdose', 'Acetaminophen Toxicity', 'Salicylate Poisoning',

    // ==================== 10. PEDIATRICS & NEONATOLOGY ====================
    'Neonatal Sepsis', 'Congenital Heart Disease', 'Kernicterus', 'Respiratory Distress Syndrome',
    'Necrotizing Enterocolitis', 'Sudden Infant Death', 'Kawasaki Disease', 'Reye Syndrome',
    'Bronchiolitis', 'Croup', 'Epiglottitis', 'Intussusception', 'Pyloric Stenosis',
    'Febrile Seizure', 'Non-Accidental Trauma', 'Child Abuse', 'Pediatric Trauma',

    // ==================== 11. OBSTETRICS & GYNECOLOGY ====================
    'Eclampsia', 'HELLP Syndrome', 'Postpartum Hemorrhage', 'Ectopic Pregnancy',
    'Gestational Diabetes', 'Preeclampsia', 'Placenta Previa', 'Abruptio Placentae',
    'Amniotic Fluid Embolism', 'Postpartum Depression', 'Hyperemesis Gravidarum',

    // ==================== 12. QUALITY, SAFETY & ETHICS ====================
    'Patient Safety', 'Root Cause Analysis', 'Morbidity & Mortality', 'Handover',
    'Informed Consent', 'Shared Decision Making', 'Breaking Bad News', 'End-of-Life Care',
    'Do Not Resuscitate', 'Advance Directive', 'Medical Error Disclosure', 'Ethical Dilemma',

    // ==================== 13. MISCELLANEOUS HIGH-YIELD & RARE SYNDROMES ====================
    'Zebras vs Horses', 'Aunt Minnie', 'Spot Diagnosis', 'Image of the Week',
    'Case of the Month', 'Teaching File', 'Grand Rounds', 'Journal Club',
    'Clinical Pearl', 'Board Question', 'High-Yield Fact', 'Exam Classic',
    'Telemedicine', 'Point-of-Care Ultrasound', 'AI in Diagnosis', 'Precision Medicine',
    'Pharmacogenomics', 'Therapeutic Drug Monitoring', 'Adverse Drug Reaction',
    'Drug Interaction', 'Withdrawal Syndrome', 'Serotonin Syndrome', 'Neuroleptic Malignant Syndrome',
    'Marfan Syndrome', 'Ehlers-Danlos Syndrome', 'Down Syndrome', 'Turner Syndrome',
    'Klinefelter Syndrome', 'Prader-Willi Syndrome', 'Angelman Syndrome', 'Fragile X Syndrome',
    'Fabry Disease', 'Gaucher Disease', 'Tay-Sachs Disease', 'Hurler Syndrome',
    'Wilson Disease', 'Hemochromatosis', 'Alpha-1 Antitrypsin Deficiency', 'Cystic Fibrosis',
    'Sarcoidosis', 'Amyloidosis', 'Multiple Sclerosis', 'ALS', 'Huntington Disease',
    'Creutzfeldt-Jakob Disease', 'Wernicke Encephalopathy', 'Korsakoff Syndrome',

    // Additional high-density terms for broader coverage
    'Abdominal Pain', 'Back Pain', 'Headache', 'Dyspnea', 'Chest Pain', 'Fever', 'Weakness',
    'Dizziness', 'Seizure', 'Altered Mental Status', 'Trauma', 'Injury', 'Fall', 'Burn',
    'Laceration', 'Fracture', 'Dislocation', 'Sprain', 'Contusion', 'Concussion',
    'Sepsis Bundle', 'Surviving Sepsis', 'Ventilator Associated Pneumonia', 'Central Line Infection',
    'Pressure Ulcer', 'Deep Vein Thrombosis', 'Pulmonary Hypertension', 'Cor Pulmonale',
    'Hepatic Encephalopathy', 'Spontaneous Bacterial Peritonitis', 'Variceal Bleed',
    'Acute Pancreatitis', 'Chronic Pancreatitis', 'Cholangitis', 'Cholelithiasis',
    'Peptic Ulcer Disease', 'Gastroesophageal Reflux', 'Celiac Disease', 'Crohn Disease',
    'Ulcerative Colitis', 'Irritable Bowel Syndrome', 'Diverticular Disease',
    'Osteoporosis', 'Osteoarthritis', 'Rheumatoid Arthritis Flare', 'Gout Attack',
    'Systemic Lupus Erythematosus', 'Scleroderma', 'Polymyositis', 'Dermatomyositis',
    'Sjogren Syndrome', 'Ankylosing Spondylitis', 'Psoriatic Arthritis'
];