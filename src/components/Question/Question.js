import React from 'react'
import styles from './question.module.css'

const Question = ({
    questionNumber,
    className = "",
    headingText,
    children
  }) => 
    <section className={[className, styles.question].join(" ")}>
      <h3 className={styles.heading}>{headingText}</h3>
      {children}
    </section>

export default Question