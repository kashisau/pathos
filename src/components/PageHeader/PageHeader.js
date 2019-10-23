import React from 'react'
import styles from './page-header.module.css'
import pathosLogo from '../../img/pathos-logo@2x.png'

const PageHeader = () => 
  <header className={styles.header}>
    <img src={pathosLogo} className={styles.logotype} alt="Pathos Logo" />
  </header>

export default PageHeader