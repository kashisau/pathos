import React from 'react'

import pageStyles from '../../helpers/Styles/page-components.module.css'
import styles from './results.module.css'

import ResultsIntro from '../ResultsIntro'
import ResultsGraph from '../ResultsGraph'

const Results = ({ surveyComplete }) => {

  return (
    <>
      <ResultsIntro surveyComplete={surveyComplete} />
      <hr className={pageStyles.divider} />
      <div className={[pageStyles.content, styles.results].join(" ")}>
        <ResultsGraph /> 
      </div>
    </>
  )
}

export default Results