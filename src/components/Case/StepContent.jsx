// StepContent.jsx
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from '../../styles/caseForm.module.css';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const quillModules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    [{ 'line-height': ['1', '1.15', '1.5', '1.75', '2'] }],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
  keyboard: {
    bindings: {
      space: {
        key: ' ',
        handler: function (range, context) {
          this.quill.insertText(range.index, ' ');
          this.quill.setSelection(range.index + 1);
          return false;
        },
      },
    },
  },
};

export default function StepContent({
  steps,
  currentStep,
  formData,
  handleChange,
  handleDeleteMedia,
  widgetRef,
  isUploading,
  isEditMode = false,
}) {
  const step = steps[currentStep];

  return (
    <div className={styles.carousel}>
      <div
        className={styles.carouselInner}
        style={{
          display: 'flex',
          width: `${steps.length * 100}%`,
          transition: 'transform 0.4s ease-in-out',
          transform: `translateX(-${currentStep * (100 / steps.length)}%)`,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.name}
            className={`${styles.carouselItem} ${index === currentStep ? styles.active : ''}`}
            style={{
              width: `${100 / steps.length}%`,
              flexShrink: 0,
              padding: '0 1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div className={styles.stepContent}>
              <label className={styles.fieldLabel}>{step.label}</label>
              {step.type === 'richtext' && (
                <ReactQuill
                  theme="snow"
                  value={formData[step.name]}
                  onChange={(value) => handleChange(value, step.name)}
                  placeholder={step.placeholder}
                  modules={quillModules}
                  className={styles.quillEditor}
                  formats={[
                    'header',
                    'bold',
                    'italic',
                    'underline',
                    'list',
                    'bullet',
                    'link',
                    'line-height',
                  ]}
                />
              )}
              {step.type === 'select' && (
                <select
                  name={step.name}
                  value={formData[step.name]}
                  onChange={(e) => handleChange(e, step.name)}
                  multiple
                  size="5"
                  className={styles.selectInput}
                >
                  {step.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {step.type === 'media' && (
                <div className={styles.mediaSection}>
                  <button
                    type="button"
                    onClick={() => {
                      widgetRef.current?.open();
                      if (window.gtag && !isEditMode) {
                        window.gtag('event', 'media_upload_button_clicked', {
                          event_category: 'CaseForm',
                          event_label: 'Upload Media Button Clicked',
                        });
                      }
                    }}
                    disabled={!widgetRef.current || isUploading}
                    className={styles.uploadButton}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.uploadIcon}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {isUploading ? 'Uploading...' : 'Upload Media'}
                  </button>
                  {formData.mediaUrls.length > 0 && (
                    <div className={styles.mediaPreview}>
                      <p className={styles.mediaPreviewLabel}>Uploaded media:</p>
                      <div className={styles.mediaGrid}>
                        {formData.mediaUrls.map((url, index) => (
                          <div key={index} className={styles.mediaItem}>
                            <Image
                              src={url}
                              alt={`Uploaded media ${index + 1}`}
                              width={140}
                              height={140}
                              className={styles.mediaImage}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(index)}
                              disabled={isUploading}
                              className={styles.deleteButton}
                              aria-label="Delete media"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.deleteIcon}
                              >
                                <path d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}