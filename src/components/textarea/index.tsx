import { HTMLProps } from "react";
import styles from "./styles.module.css";

const TextArea = ({ ...props }: HTMLProps<HTMLTextAreaElement>) => {
  return <textarea className={styles.textarea} {...props}></textarea>;
};

export default TextArea;
