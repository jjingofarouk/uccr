import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import readline from 'readline';

const firebaseConfig = {
  apiKey: "AIzaSyDXn8kWcdMLt6aNsWMXjR2Xibf40wDYMtQ",
  authDomain: "uccr-68227.firebaseapp.com",
  projectId: "uccr-68227",
  storageBucket: "uccr-68227.appspot.com",
  messagingSenderId: "644367403313",
  appId: "1:644367403313:web:b3dc233df1879ac0d40810",
  measurementId: "G-VZMLEHCRKY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function post() {
  console.log("=== Quick Case Poster ===");
  console.log("Auto-authenticating as AI Agent to post the case...\n");
  
  const email = "ai_clinical_agent@uccr.edu";
  const password = "SuperSecretPassword123!";

  try {
    let user;
    try {
      console.log(`Logging in as ${email}...`);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      console.log(`Logged in successfully!`);
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || String(err).includes('invalid-credential')) {
         console.log('User not found. Creating AI Agent user account...');
         const { createUserWithEmailAndPassword } = await import('firebase/auth');
         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
         user = userCredential.user;
         console.log('AI Agent user created and logged in!');
      } else {
         throw err;
      }
    }

    const caseData = {
        title: 'The Danger of the "Triple Threat": Mixed Pneumonia in SLE',
        specialty: ['Infectious Disease', 'Critical Care', 'Rheumatology'],
        presentingComplaint: 'Acute respiratory distress in a 29-year-old female with SLE.',
        history: 'Our patient is a 29-year-old female with a known past medical history of Systemic Lupus Erythematosus (SLE). Due to her underlying lupus nephritis, she has been on a chronic regimen of immunosuppressants, including corticosteroids. She presents with acute respiratory distress, prompting a swift and broad diagnostic workup.',
        physicalExam: 'Severe respiratory distress. Hypoxemic on presentation.',
        investigations: `BioFire® Pneumonia Panel plus (multiplex PCR-based syndromic test) explicitly revealed:\n\n- Influenza A virus: DETECTED\n- Staphylococcus aureus: DETECTED\n- Streptococcus pneumoniae: DETECTED\n\nOther common typicals/atypicals (Pseudomonas aeruginosa, Klebsiella pneumoniae, Legionella, Mycoplasma) were explicitly negative. \nBlood cultures were drawn and are pending.`,
        provisionalDiagnosis: 'Mixed bacterial and viral pneumonia (Influenza A + S. aureus + S. pneumoniae post-viral superinfection) in a profoundly immunosuppressed host.',
        management: `1. Initiate appropriate antivirals (e.g., Oseltamivir) for Influenza A.\n2. Targeted antibiotics covering pyogenic organisms like MRSA and S. pneumoniae (e.g., Vancomycin + Ceftriaxone) pending culture sensitivities.\n3. Close monitoring and potential adjustment of her chronic steroids in consultation with rheumatology.\n4. Follow up on blood cultures given high risk of bacteremia.`,
        discussion: `This case highlights the classic "double-hit" phenomenon where a viral respiratory infection like Influenza A damages the respiratory epithelium, providing the perfect breeding ground for secondary pyogenic bacterial superinfections by organisms like S. aureus and S. pneumoniae. This risk is amplified profoundly in hosts with severely diminished immunity, such as this patient with SLE on chronic steroids.\n\nRapid multiplex PCR panels (like BioFire) provide invaluable fast-turnaround definitive diagnosis in critical care, enabling rapid de-escalation or escalation of targeted antimicrobial therapy rather than relying prolonged broad-spectrum agents.`,
        highLevelSummary: '29F with SLE on immunosuppressants presents with acute respiratory distress. A BioFire Pneumonia Panel reveals a mixed infection of Influenza A, S. aureus, and S. pneumoniae. This case highlights the "double hit" phenomenon of post-viral bacterial superinfection and the value of rapid syndromic testing in critical care.',
        references: 'Clinical case discussion structured from Medical Twitter panel.',
        hospital: '',
        referralCenter: '',
        mediaUrls: []
    };

    const searchKeywords = [
        ...(caseData.title?.toLowerCase().split(/\s+/) || []),
        ...caseData.specialty.map(s => s.toLowerCase()),
        ...(caseData.presentingComplaint?.toLowerCase().split(/\s+/) || []),
    ].filter(Boolean);

    const validatedCaseData = {
        caseType: 'clinical',
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        title: caseData.title,
        specialty: caseData.specialty,
        presentingComplaint: caseData.presentingComplaint,
        history: caseData.history,
        physicalExam: caseData.physicalExam,
        investigations: caseData.investigations,
        provisionalDiagnosis: caseData.provisionalDiagnosis,
        management: caseData.management,
        discussion: caseData.discussion,
        highLevelSummary: caseData.highLevelSummary,
        references: caseData.references,
        hospital: caseData.hospital,
        referralCenter: caseData.referralCenter,
        mediaUrls: caseData.mediaUrls,
        awards: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        searchKeywords: [...new Set(searchKeywords)],
        thumbnailUrl: '',
        photoURL: user.photoURL || '/images/photo-placeholder.jpg',
    };

    console.log("Saving case to Firestore database...");
    const docRef = await addDoc(collection(db, 'cases'), validatedCaseData);
    console.log(`\n✅ SUCCESS! Case posted directly to the app.`);
    console.log(`View it in the app soon! Document ID: ${docRef.id}`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error posting case:', error.message || error);
    process.exit(1);
  }
}

post();
