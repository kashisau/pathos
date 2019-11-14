import React from 'react'
import styles from './tables-intro.module.css'

const TablesIntro = ({ surveyComplete }) => 
  <section className={styles.header}>
    <h1 className={styles.welcome}>Table data</h1>
    <h2 className={styles.participant}>Volunteers in Nepal</h2>
    <p>This page holds the data tables for responses to the survey. It'll allow you to import data into your favourite spreadsheet application for analysis.</p>
    {!surveyComplete && <p className={styles.info}>This will take about 5 minutes to complete.</p>}
  </section>

export default TablesIntro