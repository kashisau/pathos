import React,{ useRef, useLayoutEffect, useState } from 'react'
import styles from './mood-graph.module.css'
import Draggable from 'react-draggable'
import LineGraph from 'smooth-line-graph'

const NODE_SCALER = 116

const MoodGraph = ({ dataPoints = 12, months, setMonths }) => {
  const sliders = []
  const graphSpace = useRef()
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
      const dimensions = {
        width: graphSpace.current.offsetWidth,
        height: graphSpace.current.offsetHeight
      }
      setGraphDimensions(dimensions)
    }
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', updateGraphSize)
    updateGraphSize()
    return () => window.removeEventListener('resize', updateGraphSize)
  }, []);
  

  for (let i=0; i < dataPoints; i++) {
    sliders.push(<Draggable
        axis="y"
        bounds="parent"
        onDrag={updateMonths}
        defaultPosition={ {x: 0, y: months[i]*-NODE_SCALER} }
        key={i}
        >
      <div className={styles.monthNode} data-month={i}>
        <div className={styles.monthNodeCircle} />
      </div>
      </Draggable>)
  }

  const graphData = [...months]
                      .map((value, month) => [month, value])
                      .filter((value, month) => month < dataPoints)

  const props = {
      name: 'simple',
      minY: -1,
      maxY: 1,
      width: graphDimensions.width,
      height: 258,
      lines: [
          {
              key: 'mykey',
              data: graphData,
              color: 'black',
              smooth: true
          }
      ],
      svgClasses: 'bears'
  };

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
      <div className={styles.graphSpace} ref={graphSpace}>
        <LineGraph {...props} />
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