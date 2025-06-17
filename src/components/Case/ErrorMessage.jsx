import styles from '../../styles/caseForm.module.css';

export default function ErrorMessage({ error }) {
  return error ? (
    <p role="alert" className={styles.error}>
      {error}
      {window.gtag &&
        window.gtag('event', 'form_error', {
          event_category: 'CaseForm',
          event_label: 'Form Error Displayed',
          value: error,
        })}
    </p>
  ) : null;
}