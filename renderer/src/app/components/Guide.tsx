import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import styles from "./Guide.module.css";
import GuideModal from "./GuideModal";

export default function Guide() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className={styles.guideIcon} onClick={toggleModal}>
        <FontAwesomeIcon icon={faQuestion} />
      </div>
      <GuideModal isOpen={isModalOpen} onClose={toggleModal} />
    </>
  );
}