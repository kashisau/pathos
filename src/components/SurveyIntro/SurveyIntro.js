import React from 'react'
import styles from './survey-intro.module.css'

const Intro = ({ surveyComplete }) => 
  <section className={styles.header}>
    <h1 className={styles.welcome}>Mood trends</h1>
    <h2 className={styles.participant}>Volunteers in Nepal</h2>
    <p>We've asked all current and former AVP volunteers based in Nepal to complete a mood graph. We'll be featuring the anonymised data we collect during the November in-country meeting in Chitwan.</p>
    {!surveyComplete && <p className={styles.info}>This will take about 5 minutes to complete.</p>}
    {surveyComplete && <p className={styles.info}>Thank you for taking the time to complete this survey.</p>}
  </section>

export default Intro