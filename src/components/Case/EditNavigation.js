import styles from '../../styles/caseForm.module.css';

export default function Navigation({
  currentStep,
  stepsLength,
  isUploading,
  isLoading,
  nextStep,
  prevStep,
  submitText = "Submit Case",
}) {
  return (
    <div className={styles.navigation}>
      <button
        type="button"
        onClick={prevStep}
        disabled={currentStep === 0 || isUploading}
        className={styles.navButton}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          className={styles.navIcon}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>
      {currentStep < stepsLength - 1 ? (
        <button
          type="button"
          onClick={nextStep}
          disabled={isUploading}
          className={styles.navButton}
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className={styles.navIcon}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className={styles.submitButton}
        >
          {submitText}
        </button>
      )}
    </div>
  );
}