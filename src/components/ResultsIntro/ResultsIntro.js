import React from 'react'
import styles from './results-intro.module.css'

const Intro = ({ surveyComplete }) =>
  <section className={styles.header}>
    <h1 className={styles.welcome}>Mood trends</h1>
    <h2 className={styles.participant}>Volunteers' results</h2>
    <p>Below is a graph of all the responses to this survey so far, unadjusted for month.</p>
    {!surveyComplete && <p className={styles.info}><a className={styles.surveyLink} href="/" title="Go to the survey page.">Click here to take the survey</a></p>}
    {surveyComplete && <p className={styles.info}>Thank you for taking the time to complete the survey.</p>}
  </section>

export default Intro