import React from 'react'
import styles from './question.module.css'

const Question = ({
    questionNumber,
    className = "",
    headingText,
    questionText,
    children
  }) => 
    <section className={[className, styles.question].join(" ")}>
      <h3 className={styles.heading}>{headingText}</h3>
      <p className={styles.questionText}>{questionText}</p>
      {children}
    </section>

export default Question