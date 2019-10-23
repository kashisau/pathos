import React from 'react'
import styles from './intro.module.css'

const Intro = ({participantName}) => 
  <section className={styles.header}>
    <h1 className={styles.welcome}>Welcome</h1>
    <h2 className={styles.participant}>{participantName}</h2>
    <p>All our current and former volunteers have been asked to complete a mood graph using this app for the upcoming In Country Meeting in Chitwan in November 2019.</p>
    <p className={styles.info}>This will take about 5 minutes to complete. Read the FAQ >></p>
  </section>

export default Intro