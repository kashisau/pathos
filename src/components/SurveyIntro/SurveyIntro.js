import React from 'react'
import styles from './survey-intro.module.css'

const Intro = () => 
  <section className={styles.header}>
    <h1 className={styles.welcome}>Mood trends</h1>
    <h2 className={styles.participant}>Volunteers in Nepal</h2>
    <p>We've asked all current and former AVP volunteers based in Nepal to complete a mood graph. We'll be featuring the anonymised data we collect during the November in-country meeting in Chitwan.</p>
    <p className={styles.info}>This will take about 5 minutes to complete.</p>
  </section>

export default Intro