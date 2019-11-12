import React,{ useRef, useEffect, useState } from 'react'
import styles from './mood-graph.module.css'
import Draggable from 'react-draggable'
import Trend from '../react-trend'

import { getMonth } from '../../helpers/Constants/Constants'

const NODE_SCALER = 116

const MoodGraph = ({ dataPoints = 12, months, setMonths, startMonth, submitState }) => {
  const sliders = []
  
  const isDraggingRef = useRef(false)
  const graphSpace = useRef()
  const sliderRefs = [useRef(), useRef(), useRef(), useRef(),
                      useRef(), useRef(), useRef(), useRef(),
                      useRef(), useRef(), useRef(), useRef(), useRef()]

  const [graphDimensions, setGraphDimensions] = useState({ width:0, height: 0 })

  // Cancels page scrolling if the user is dragging a slider.
  const preventScrollRef = useRef(e => {
    if (isDraggingRef.current) {
      e.preventDefault()
    } 
  })

  const updateMonths = (nativeEvent, draggableData) => {
    nativeEvent.preventDefault()
    const month = parseInt(draggableData.node.dataset.month, 10)
    const monthValue = (parseInt(draggableData.y, 10) * -1) / NODE_SCALER
    const newMonths = [...months]
    newMonths[month] = monthValue
    setMonths(newMonths)
  }

  // Intervenes page scrolling and cancels the event so that the page doesn't
  // scroll whilst the user is trying to use the sliders.
  const addPreventScroll = () => {
    document.body.addEventListener("touchmove", preventScrollRef.current, { passive: false, capture: true })
    document.body.addEventListener("touchstart", preventScrollRef.current, { passive: false, capture: true })
  }
  const removePreventScroll = () => {
    document.body.removeEventListener("touchmove", preventScrollRef.current, { passive: false, capture: true })
    document.body.removeEventListener("touchstart", preventScrollRef.current, { passive: false, capture: true })
  }

  // Add on page load, as well as an update to the number of data points
  useEffect(() => {
    window.addEventListener('resize', updateGraphSize)
    addPreventScroll()
    updateGraphSize()
    return () => {
      window.removeEventListener('resize', updateGraphSize)
      removePreventScroll()
    }
  }, [dataPoints])

  const updateGraphSize = () => {
    if (graphSpace.current) {
      const firstSlider = sliderRefs[0].current
      const lastSlider = sliderRefs[sliders.length - 1].current

      // We want to get the width between the centre of the first slider and the
      // centre of the second slider.
      const firstSliderCentreX = firstSlider.offsetLeft + firstSlider.offsetWidth / 2
      const lastSliderCentreX = lastSlider.offsetLeft + lastSlider.offsetWidth / 2
      const graphWidth = lastSliderCentreX - firstSliderCentreX + 16

      const dimensions = {
        width: graphWidth,
        height: graphSpace.current.offsetHeight
      }

      setGraphDimensions(dimensions)
    }
  }

  for (let i=0; i < dataPoints; i++) {
    sliders.push(<Draggable
        axis="y"
        bounds="parent"
        onStart={_ => isDraggingRef.current = true}
        onStop={_ => isDraggingRef.current = false}
        onDrag={updateMonths}
        defaultPosition={ {x: 0, y: months[i]*-NODE_SCALER} }
        disabled={submitState}
        key={i}>
      <div className={styles.monthNode} data-month={i} ref={sliderRefs[i]} style={{
          gridColumn: `${i+1} / ${i+2}`
        }}>
        <div className={styles.monthNodeCircle} />
      </div>
      </Draggable>)
  }

  const xAxisLabels = () => {
    const labels = []
    for (let i = 0; i < dataPoints - 1; i++) {
      labels.push(
        <span
          className={
            [
              styles.xAxisLabel,
              i === 0? styles.xAxisLabelFirstMonth : ''
            ].join(" ")}
          key={i}>{getMonth(i + startMonth).substr(0, 3)}</span>
      )
    }
    return labels
  }

  const graphData = [...months]
                      .filter((value, month) => month < dataPoints)

  return (
    <div className={styles.moodGraph}
      // onTouchStartCapture={_ => isDraggingRef.current = true}
      // onTouchEnd={_ => isDraggingRef.current = false}
    >
      <div className={styles.yAxisLabels}>
        <span className={styles.yAxisLabel} role="img" aria-label="Estatic">😆</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Happy">🙂</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Neutral">😐</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Unhappy">😓</span>
        <span className={styles.yAxisLabel} role="img" aria-label="Dire">😖</span>
      </div>
      <div className={styles.xAxisLabels} style={{
          gridTemplateColumns: `repeat(${dataPoints}, 1fr)`
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
      <div
        className={styles.graphSpace}
        ref={graphSpace}>
        <Trend
          smooth
          radius={20}
          strokeWidth={4}
          width={graphDimensions.width}
          height={264}
          stroke="#ffffff"
          strokeOpacity={0.5}
          data={graphData} />
      </div>
      <div
        className={styles.graphNodes}
        style={{
          gridTemplateColumns: `repeat(${dataPoints}, 1fr)`
        }}>
        <div className={styles.preDeparture} />
        <div className={styles.onAssignment} style={{
          gridColumn: `2 / ${dataPoints + 1}`
        }} />
        {sliders}
      </div>
    </div>
  )
}

export default MoodGraph