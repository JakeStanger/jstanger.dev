import React, { useCallback } from "react";
import styles from "./Dialog.module.scss";
import IDialogProps from "./IDialogProps";

const Dialog: React.FC<IDialogProps> = ({
  title,
  isOpen,
  onDismiss,
  children,
}) => {
  const onContainerClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.container} onClick={onContainerClick}>
      <div className={styles.dialog}>
        <header>
          <h1>{title}</h1>
          <button className={styles.close} onClick={onDismiss}>
            x
          </button>
        </header>

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
