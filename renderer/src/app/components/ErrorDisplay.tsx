import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './ErrorDisplay.module.css';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss: () => void;
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error) return null;

  // 에러 메시지에서 제목과 설명 분리 (개행문자 기준)
  const [title, ...descriptionParts] = error.split('\n');
  const description = descriptionParts.join('\n');

  return (
    <div className={`${styles.errorContainer} ${error ? styles.show : ''}`}>
      <div className={styles.errorMessage}>
        <div className={styles.errorIcon}>
          <FontAwesomeIcon icon={faCircleExclamation} />
        </div>
        <div className={styles.errorContent}>
          <div className={styles.errorTitle}>{title}</div>
          {description && (
            <div className={styles.errorDescription}>{description}</div>
          )}
          <button 
            className={styles.closeButton}
            onClick={onDismiss}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
