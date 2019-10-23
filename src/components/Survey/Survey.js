import React, { useState } from 'react'
import Question from '../Question'

import styles from './survey.module.css'
import rangeStyles from './range.module.css'
import MoodGraph from '../MoodGraph/MoodGraph'

const Survey = () => {
  const [duration, updateDuration] = useState(1)

  return (<section className={styles.survey}>
    <hr className={styles.divider} />
    <div className={styles.content}>
      <Question
        headingText="Let's begin"
        questionText="Are you currently on assignment?">
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="radio" name="onAssignment" value="Yes" />
            Yes
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="radio" name="onAssignment" value="Partner" />
            Yes, as a volunteer partner
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="radio" name="onAssignment" value="Alumni" />
            No, I've completed my assignment
          </label>
      </Question>
      <Question
        headingText="Time on assignment"
        questionText="How long have you been on assignment in-country?">
          <label>
            <input className={[styles.monthsRange, rangeStyles.range].join(" ")} type="range" min="1" max="12" onChange={(e) => updateDuration(e.currentTarget.value)} value={duration} />
            <div className={styles.monthsText}>
              <span className={styles.monthsValue}>{duration}</span>
              <span className={styles.monthsUnit}>months</span>
            </div>
          </label>
      </Question>
      <Question
        headingText="Mood"
        questionText="Fill out the mood graph below by sliding each point up or down to reflect your mood during that time.">
        <MoodGraph dataPoints={duration} />
      </Question>
    </div>
  </section>)
}

export default Survey