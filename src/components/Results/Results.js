import React, { useState, useRef } from 'react'

import pageStyles from '../../helpers/Styles/page-components.module.css'
import styles from './results.module.css'
import rangeStyles from '../Survey/range.module.css'

import ResultsIntro from '../ResultsIntro'
import ResultsGraph from '../ResultsGraph'

import iconFullscreen from '../../img/icon-fullscreen.svg'

const DEFAULT_MONTH_DISPLAYED = 13;

const Results = ({ surveyComplete }) => {
  const [monthsDisplayed, setMonthsDisplayed] = useState(DEFAULT_MONTH_DISPLAYED)
  const [showTrendline, setShowTrendline] = useState(true)
  const graphRef = useRef()

  return (
    <>
      <ResultsIntro surveyComplete={surveyComplete} />
      <hr className={pageStyles.divider} />
      <div className={[pageStyles.content, styles.results].join(" ")} ref={graphRef}>
        <div className={styles.graphRange}>
          <p className={styles.questionText}>Graph range</p>
          <label>
            <input className={[styles.monthsRange, rangeStyles.range].join(" ")} type="range" min="2" max="13" onChange={(e) => setMonthsDisplayed(e.currentTarget.value)} value={monthsDisplayed} />
            <div className={styles.monthsText}>
              <span className={styles.monthsValue}>{monthsDisplayed - 1}</span>
              <span className={styles.monthsUnit}>{monthsDisplayed === 1? 'month' : 'months'}</span>
            </div>
          </label>
        </div>
        <div className={styles.graphSettings}>
          <p className={styles.questionText}>Trendline</p>
          <label className={styles.closedQuestion}>
            <input
              className={styles.closedAnswer}
              checked={showTrendline}
              onChange={e => setShowTrendline(e.currentTarget.checked)}
              type="checkbox"
              name="moodNegatives"
               />
              Show average trendline
          </label>
        </div>
        {/* <button
          className={styles.fullscreenBtn}
          onClick={() => graphRef.current.requestFullscreen()}
          aria-label="Show full-screen graph"><img src={iconFullscreen} alt="fullscreen icon" aria-label="Fullscreen" /></button> */}
        <ResultsGraph
          monthsDisplayed={monthsDisplayed}
          showTrendline={showTrendline} /> 
      </div>
      
    </>
  )
}

export default Results