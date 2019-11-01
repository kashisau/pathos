import React,{ useRef, useEffect, useState } from 'react'
import styles from './mood-graph.module.css'
import Draggable from 'react-draggable'
import Trend from '../react-trend'

const NODE_SCALER = 116

const MoodGraph = ({ dataPoints = 12, months, setMonths }) => {
  const sliders = []
  const graphSpace = useRef()
  const sliderRefs = [useRef(), useRef(), useRef(), useRef(),
                      useRef(), useRef(), useRef(), useRef(),
                      useRef(), useRef(), useRef(), useRef()]

  const [graphDimensions, setGraphDimensions] = useState({ width:0, height: 0 })

  const updateMonths = (nativeEvent, draggableData) => {
    const month = parseInt(draggableData.node.dataset.month, 10)
    const monthValue = (parseInt(draggableData.y, 10) * -1) / NODE_SCALER
    const newMonths = [...months]
    newMonths[month] = monthValue
    setMonths(newMonths)
  }

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

  useEffect(() => {
    window.addEventListener('resize', updateGraphSize)
    updateGraphSize()
    return () => window.removeEventListener('resize', updateGraphSize)
  }, [dataPoints])

  for (let i=0; i < dataPoints; i++) {
    sliders.push(<Draggable
        axis="y"
        bounds="parent"
        onDrag={updateMonths}
        defaultPosition={ {x: 0, y: months[i]*-NODE_SCALER} }
        key={i}
        >
      <div className={styles.monthNode} data-month={i} ref={sliderRefs[i]}>
        <div className={styles.monthNodeCircle} />
      </div>
      </Draggable>)
  }

  const graphData = [...months]
                      .filter((value, month) => month < dataPoints)

  return (
    <div className={styles.moodGraph}>
      <div className={styles.axisLabels}>
        <span className={styles.axisLabel} role="img" aria-label="Estatic">😆</span>
        <span className={styles.axisLabel} role="img" aria-label="Happy">🙂</span>
        <span className={styles.axisLabel} role="img" aria-label="Neutral">😐</span>
        <span className={styles.axisLabel} role="img" aria-label="Unhappy">😓</span>
        <span className={styles.axisLabel} role="img" aria-label="Dire">😖</span>
      </div>
      <hr className={styles.baseLine} />
      <div className={styles.graphSpace} ref={graphSpace}>
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
      <div className={styles.graphNodes} style={{
          gridTemplateColumns: `repeat(${dataPoints}, 1fr)`
        }}>
        {sliders}
      </div>
    </div>
  )
}

export default MoodGraph