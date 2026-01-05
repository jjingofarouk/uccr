import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addECG } from '../../firebase/firestore';
import styles from '../../styles/ecgForm.module.css';
import {
    ChevronRight,
    ChevronLeft,
    Upload,
    CheckCircle2,
    Activity,
    Clock,
    Stethoscope,
    FileText,
    AlertCircle,
    Brain
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ECGForm = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        clinicalContext: '',
        rate: '',
        rhythm: '',
        axis: '',
        pWave: '',
        prInterval: '',
        qrsComplex: '',
        stSegment: '',
        tWave: '',
        qtInterval: '',
        interpretation: '',
        teachingPoints: '',
        category: 'All',
        mediaUrls: [],
    });

    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        if (typeof window !== 'undefined' && user) {
            const script = document.createElement('script');
            script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                cloudinaryRef.current = window.cloudinary;
                if (cloudinaryRef.current) {
                    widgetRef.current = cloudinaryRef.current.createUploadWidget(
                        {
                            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
                            folder: `ecgs/${user.uid}`,
                            sources: ['local', 'camera'],
                            multiple: false,
                            resourceType: 'image',
                            clientAllowedFormats: ['jpg', 'png', 'jpeg'],
                            maxFileSize: 10000000,
                            public_id: `ecg_${uuidv4()}`,
                        },
                        (error, result) => {
                            if (result && result.event === 'upload-added') {
                                setIsUploading(true);
                            }
                            if (!error && result && result.event === 'success') {
                                setFormData((prev) => ({
                                    ...prev,
                                    mediaUrls: [...prev.mediaUrls, result.info.secure_url],
                                }));
                                setIsUploading(false);
                            } else if (error) {
                                setError('Image upload failed. Please try again.');
                                setIsUploading(false);
                            }
                        }
                    );
                }
            };
            return () => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            };
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const steps = [
        {
            title: 'Basic Information',
            description: 'Start with the clinical setting and case title.',
            fields: ['title', 'clinicalContext', 'category']
        },
        {
            title: 'Rhythm & Intervals',
            description: 'Describe the fundamental ECG findings.',
            fields: ['rate', 'rhythm', 'axis', 'prInterval', 'qtInterval']
        },
        {
            title: 'Morphology',
            description: 'Detail the wave and segment characteristics.',
            fields: ['pWave', 'qrsComplex', 'stSegment', 'tWave']
        },
        {
            title: 'Interpretation',
            description: 'Your final diagnosis and educational takeaways.',
            fields: ['interpretation', 'teachingPoints', 'mediaUrls']
        }
    ];

    const validateStep = () => {
        const currentFields = steps[currentStep].fields;
        for (const field of currentFields) {
            if (field === 'mediaUrls' && formData.mediaUrls.length === 0) {
                setError('Please upload at least one ECG image.');
                return false;
            }
            if (field !== 'mediaUrls' && !formData[field].trim()) {
                setError(`Please fill in all fields.`);
                return false;
            }
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep()) return;

        setIsLoading(true);
        try {
            const ecgData = {
                ...formData,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                photoURL: user.photoURL || '',
            };
            await addECG(ecgData);
            router.push('/ecg-learning');
        } catch (err) {
            setError('Failed to save ECG case. Please try again.');
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className={styles.ecgFormWrapper}>
                <div className={styles.errorBox}>
                    <AlertCircle />
                    <span>Please log in to share an ECG case.</span>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.ecgFormWrapper}>
            <div className={styles.ecgForm}>
                <div className={styles.formHeader}>
                    <h1 className={styles.formTitle}>Post New ECG Case</h1>
                    <p className={styles.formSubtitle}>{steps[currentStep].description}</p>
                </div>

                <div className={styles.progressContainer}>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentStep === 0 && (
                        <div className={styles.stepContainer}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><FileText size={18} className={styles.labelIcon} /> Case Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Anterior Wall STEMI in a 55-year-old male"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Stethoscope size={18} className={styles.labelIcon} /> Clinical Context</label>
                                <textarea
                                    name="clinicalContext"
                                    value={formData.clinicalContext}
                                    onChange={handleChange}
                                    placeholder="Describe the patient's presentation, history, and symptoms..."
                                    className={styles.textarea}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Activity size={18} className={styles.labelIcon} /> Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="All">Select Category</option>
                                    <option value="Ischemia">Ischemia/Infarction</option>
                                    <option value="Arrhythmia">Arrhythmia</option>
                                    <option value="Metabolic">Metabolic/Electrolytes</option>
                                    <option value="Pre-excitation">Pre-excitation</option>
                                    <option value="Conduction">Conduction Disturbances</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className={styles.stepContainer}>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}><Activity size={18} className={styles.labelIcon} /> Heart Rate (bpm)</label>
                                    <input
                                        type="text"
                                        name="rate"
                                        value={formData.rate}
                                        onChange={handleChange}
                                        placeholder="e.g. 75"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}><Activity size={18} className={styles.labelIcon} /> Rhythm</label>
                                    <input
                                        type="text"
                                        name="rhythm"
                                        value={formData.rhythm}
                                        onChange={handleChange}
                                        placeholder="e.g. Sinus Rhythm"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Activity size={18} className={styles.labelIcon} /> Cardiac Axis</label>
                                <input
                                    type="text"
                                    name="axis"
                                    value={formData.axis}
                                    onChange={handleChange}
                                    placeholder="e.g. Normal (60 degrees)"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}><Clock size={18} className={styles.labelIcon} /> PR Interval (ms)</label>
                                    <input
                                        type="text"
                                        name="prInterval"
                                        value={formData.prInterval}
                                        onChange={handleChange}
                                        placeholder="e.g. 160"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}><Clock size={18} className={styles.labelIcon} /> QT/QTc Interval (ms)</label>
                                    <input
                                        type="text"
                                        name="qtInterval"
                                        value={formData.qtInterval}
                                        onChange={handleChange}
                                        placeholder="e.g. 420 / 440"
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={styles.stepContainer}>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>P Wave</label>
                                    <input
                                        type="text"
                                        name="pWave"
                                        value={formData.pWave}
                                        onChange={handleChange}
                                        placeholder="Normal, peaked, bifid..."
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>QRS Complex</label>
                                    <input
                                        type="text"
                                        name="qrsComplex"
                                        value={formData.qrsComplex}
                                        onChange={handleChange}
                                        placeholder="Duration, pathological Q waves..."
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            <div className={styles.grid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>ST Segment</label>
                                    <input
                                        type="text"
                                        name="stSegment"
                                        value={formData.stSegment}
                                        onChange={handleChange}
                                        placeholder="Elevation, depression..."
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>T Wave</label>
                                    <input
                                        type="text"
                                        name="tWave"
                                        value={formData.tWave}
                                        onChange={handleChange}
                                        placeholder="Inverted, hyperacute..."
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.stepContainer}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Brain size={18} className={styles.labelIcon} /> Final Interpretation</label>
                                <textarea
                                    name="interpretation"
                                    value={formData.interpretation}
                                    onChange={handleChange}
                                    placeholder="Provide a comprehensive diagnosis based on the findings..."
                                    className={styles.textarea}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Brain size={18} className={styles.labelIcon} /> Teaching Points</label>
                                <textarea
                                    name="teachingPoints"
                                    value={formData.teachingPoints}
                                    onChange={handleChange}
                                    placeholder="What can others learn from this case? Key diagnostic criteria..."
                                    className={styles.textarea}
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}><Upload size={18} className={styles.labelIcon} /> ECG Images</label>
                                <div className={styles.uploadArea} onClick={() => widgetRef.current?.open()}>
                                    <Upload className={styles.uploadIcon} size={48} />
                                    <p>{isUploading ? 'Uploading...' : 'Click to upload ECG traces'}</p>
                                </div>
                                {formData.mediaUrls.map((url, index) => (
                                    <img key={index} src={url} alt="ECG Preview" className={styles.previewImage} />
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorBox}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.navigation}>
                        {currentStep > 0 && (
                            <button
                                type="button"
                                onClick={handlePrev}
                                className={`${styles.navButton} ${styles.prevButton}`}
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>
                        )}
                        <div style={{ flex: 1 }} />
                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className={`${styles.navButton} ${styles.nextButton}`}
                            >
                                Next Step <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isLoading || isUploading}
                                className={`${styles.navButton} ${styles.submitButton}`}
                            >
                                {isLoading ? 'Saving...' : 'Submit Case'} <CheckCircle2 size={20} style={{ marginLeft: '8px' }} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ECGForm;
