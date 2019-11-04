import React from 'react'
import styles from './intro.module.css'

const Intro = ({participantName}) => 
  <section className={styles.header}>
    <h1 className={styles.welcome}>Welcome</h1>
    <h2 className={styles.participant}>ICM Survey 2019</h2>
    <p>All of the current and former volunteers in Nepal have been asked to complete a mood graph using this page for the upcoming In Country Meeting in Chitwan.</p>
    <p className={styles.info}>This will take about 5 minutes to complete.</p>
  </section>

export default Intro