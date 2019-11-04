import React from 'react'
import PageHeader from '../../components/PageHeader'
import styles from './layout.module.css'

const Layout = ({children}) => 
  <>
    <PageHeader />
    <main className={styles.body}>{children}</main>
    <footer className={styles.footer}>
      <div className={styles.credits}>
        <p><a className={styles.codeLink} href="https://github.com/kashisau/pathos" rel="noopener noreferrer" target="_blank">See source code on GitHub.com</a></p>
      </div>
    </footer>
  </>

export default Layout