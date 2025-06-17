import styles from '../../styles/caseForm.module.css';

export default function ProgressBar({ currentStep, stepsLength }) {
  return (
    <>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentStep + 1) / stepsLength) * 100}%` }}
        ></div>
      </div>
      <p className={styles.stepIndicator}>
        Step {currentStep + 1} of {stepsLength}
      </p>
    </>
  );
}