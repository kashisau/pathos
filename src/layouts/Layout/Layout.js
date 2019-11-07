import React from 'react'
import PageHeader from '../../components/PageHeader'
import styles from './layout.module.css'

import kashisLogo from '../../img/kashis.com.au-logo.png'
import githubLogo from '../../img/github-logo.png'
import ccLogo from '../../img/cc-logo.svg'

const Layout = ({children}) => 
  <>
    <PageHeader />
    <main className={styles.body}>{children}</main>
    <footer className={styles.footer}>
      <div className={styles.credits}>
        <p className={styles.links}>
          <a className={styles.kashisLogoLink} href="https://kashis.com.au" title="Visit the author's website (Kashi Samaraweera)" target="blank" rel="noopener"><img className={styles.kashisLogoImage} src={kashisLogo} alt="Kashi Samaraweera's website logo" /></a>
          <a className={styles.codeLink} href="https://github.com/kashisau/pathos" rel="noopener noreferrer" title="See the source code on GitHub" target="_blank"><img className={styles.codeLinkImage} src={githubLogo} alt="GitHub logo" /></a>
          <a className={styles.licenseLink} href="https://github.com/kashisau/pathos/blob/master/LICENSE.md" rel="noopener noreferrer" title="Creative Commons Attribution 4.0 International Public License" target="_blank"><img className={styles.licenseLinkImage} src={ccLogo} alt="Creative Commons Attribution 4.0 International Public License logo" /></a>
        </p>
      </div>
    </footer>
  </>

export default Layout