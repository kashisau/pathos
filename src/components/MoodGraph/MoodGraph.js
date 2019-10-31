import React,{ useRef } from 'react'
import styles from './mood-graph.module.css'

const MoodGraph = ({ dataPoints = 12, months, setMonths }) => {
  const sliders = []
  const graphSpace = useRef()

  const updateMonths = updateEvent => {
    const month = parseInt(updateEvent.currentTarget.dataset.month, 10)
    const monthValue = parseInt(updateEvent.currentTarget.value)
    const newMonths = [...months]
    newMonths[month] = monthValue
    setMonths(newMonths)
  }

  for (let i=0; i < dataPoints; i++) {
    sliders.push(
      <div className={styles.graphRangeDiv} key={i}>
        <input
          className={styles.graphRange}
          type="range"
          name={`month${i}`}
          min="-7"
          max="7"
          orient="vertical"
          value={months[i]}
          data-month={i}
          onChange={updateMonths}
          aria-label={`Mood for month ${i + 1}`} />
      </div>)
  }

  return (
    <div className={styles.moodGraph}>
      <div className={styles.axisLabels}>
        <span className={styles.axisLabel} role="img" aria-label="Estatic">😆</span>
        <span className={styles.axisLabel} role="img" aria-label="Happy">🙂</span>
        <span className={styles.axisLabel} role="img" aria-label="Underwhelmed">😐</span>
        <span className={styles.axisLabel} role="img" aria-label="Unhappy">😓</span>
        <span className={styles.axisLabel} role="img" aria-label="Dire">😖</span>
      </div>
      <hr className={styles.baseLine} />
      <div className={styles.graphSpace} ref={graphSpace} />
      <div className={styles.graphNodes} style={{
          gridTemplateColumns: `repeat(${dataPoints}, 1fr)`
        }}>
        {sliders}
      </div>
    </div>
  )
}

export default MoodGraph