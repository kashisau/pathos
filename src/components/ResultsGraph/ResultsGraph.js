import React,{ useRef, useEffect, useState } from 'react'

import styles from './results-graph.module.css'
import Trend from '../react-trend'

import loadingGraphIcon from '../../img/oval.svg'

const ResultsGraph = (
  {
    moodSubmissions,
    monthsDisplayed = 13,
    showTrendline = true,
    graphRef
  }) => {
  const graphSpace = useRef()
  const [graphDimensions, setGraphDimensions] = useState({ width:0, height: 0 })

  const updateGraphSize = () => {
    if (graphSpace.current) {
      const dimensions = {
        width: graphSpace.current.offsetWidth * .9432,
        height: graphSpace.current.offsetHeight
      }
      setGraphDimensions(dimensions)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', updateGraphSize)
    updateGraphSize()
    return () => window.removeEventListener('resize', updateGraphSize)
  }, [monthsDisplayed])

  const xAxisLabels = () => {
    const labels = []
    for (let i = 0; i < monthsDisplayed - 1; i++) {
      labels.push(
        <span
          className={
            [
              styles.xAxisLabel,
              i === 0? styles.xAxisLabelFirstMonth : ''
            ].join(" ")}
          key={i}>{i + 1}</span>
      )
    }
    return labels
  }

  const averageMood = []
  for (let i = 0; i < monthsDisplayed; i++) {
    let monthsIncluded = 0
    let monthsAggregate = moodSubmissions.reduce((total, moodSubmission) => {
      if (i > (moodSubmission.mood.length - 1)) return total
      monthsIncluded++
      return total + moodSubmission.mood[i]
    }, 0)
    if (monthsIncluded) averageMood.push(monthsAggregate / monthsIncluded)
  }

  const averageMoodGraphWidth = Math.round(graphDimensions.width / monthsDisplayed * averageMood.length)

  return (
    <div className={styles.moodGraph} ref={graphRef}>
      <div className={styles.yAxisLabels}>
        <span className={styles.yAxisLabel} role="img" aria-label="Estatic">😆</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Happy">🙂</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Neutral">😐</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Unhappy">😓</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Dire">😖</span>
      </div>
      <div className={styles.xAxisLabels} style={{
          gridTemplateColumns: `repeat(${monthsDisplayed}, 1fr)`
        }}>
          <span
          className={
            [
              styles.xAxisLabel,
              styles.xAxisLabelPreDeparture
            ].join(" ")}><span className={styles.preDepartureBlock}>Pre-</span><span className={styles.preDepartureBlock}>departure</span></span>
          {xAxisLabels()}
      </div>
      <hr className={styles.baseLine} />
      <div className={styles.graphSpace} ref={graphSpace}>
        <div className={[styles.preDeparture, styles.preDeparturePadded].join(" ")} />
        {moodSubmissions.length === 0 && 
          <img
            className={styles.loadingGraphIcon}
            src={loadingGraphIcon}
            alt="Loading graph data"
            aria-label="Loading graph data" />}
        {moodSubmissions.length > 0 && moodSubmissions.map(
          (moodSubmission, i) => {
            const graphWidth = Math.round(graphDimensions.width / monthsDisplayed * moodSubmission.mood.length)
            return (
              <Trend
                smooth
                radius={10}
                strokeWidth={4}
                width={graphWidth}
                height={graphDimensions.height}
                stroke={`#${moodSubmission.colour}${showTrendline? 'aa' : ''}`}
                style={
                  {
                    gridRow: `1 / 2`,
                    gridColumn: `1 / ${moodSubmission.mood.length}`
                  }
                }
                data={moodSubmission.mood}
                key={i}
              />
              )
            }
            )}
        {moodSubmissions.length > 0 && showTrendline && <Trend
          smooth
          radius={10}
          strokeWidth={12}
          width={averageMoodGraphWidth}
          height={graphDimensions.height}
          stroke="#ffffff"
          style={
            {
              gridRow: `1 / 2`,
              gridColumn: `1 / ${averageMood.length}`
            }
          }
          data={averageMood}
        />}
      </div>
    </div>
  )
}

export default ResultsGraph