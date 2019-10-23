import React from 'react'
import PageHeader from '../../components/PageHeader'
import styles from './layout.module.css'

const Layout = ({children}) => 
  <>
    <PageHeader />
    <main className={styles.body}>{children}</main>
    <footer></footer>
  </>

export default Layout