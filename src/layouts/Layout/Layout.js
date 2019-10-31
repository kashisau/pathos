import React from 'react'
import PageHeader from '../../components/PageHeader'
import styles from './layout.module.css'

const Layout = ({children}) => 
  <>
    <PageHeader />
    <main className={styles.body}>{children}</main>
    <footer className={styles.footer}>
      <div className={styles.credits}>
        <p>See source code on GitHub.com</p>
      </div>
    </footer>
  </>

export default Layout