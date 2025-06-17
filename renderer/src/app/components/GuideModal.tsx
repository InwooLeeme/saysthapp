import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./GuideModal.module.css";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className={styles.modalTitle}>사용 가이드</h2>
        <div className={styles.guideSection}>
          <h3 className={styles.sectionTitle}>음성 및 텍스트 명령 예시</h3>
          <ul className={styles.guideList}>
            <li className={styles.guideItem}>웹 검색 실행 - (EX : 네이버 켜줘)</li>
            <li className={styles.guideItem}>특정 애플리케이션 실행 - (EX : 메모장 켜줘)</li>
          </ul>
        </div>
        <div className={styles.guideSection}>
          <h3 className={styles.sectionTitle}>단축키</h3>
          <ul className={styles.guideList}>
            <li className={styles.guideItem}>마이크 버튼 클릭 - 음성 명령 시작/종료</li>
            <li className={styles.guideItem}>Enter 키 - 텍스트 명령 전송</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
