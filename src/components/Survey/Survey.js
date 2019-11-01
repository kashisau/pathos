import React, { useState, useEffect } from 'react'
import Question from '../Question'

import styles from './survey.module.css'
import rangeStyles from './range.module.css'
import MoodGraph from '../MoodGraph/MoodGraph'

const Survey = () => {
  const [duration, setDuration] = useState(6)
  const [months, setMonths] = useState([0, 0, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0, 0])

  return (<section className={styles.survey}>
    <hr className={styles.divider} />
    <div className={styles.content}>
      <Question
        headingText="Let's begin">
          <p className={styles.questionText}>Are you currently on assignment?</p>
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
            No, I've completed mine
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="radio" name="onAssignment" value="Alumni" />
            No, I was a volunteer partner
          </label>
      </Question>
      <Question
        headingText="Time on assignment">
          <p className={styles.questionText}>How long have you been on assignment in-country?</p>
          <label>
            <input className={[styles.monthsRange, rangeStyles.range].join(" ")} type="range" min="1" max="12" onChange={(e) => setDuration(e.currentTarget.value)} value={duration} />
            <div className={styles.monthsText}>
              <span className={styles.monthsValue}>{duration}</span>
              <span className={styles.monthsUnit}>{duration === 1? 'month' : 'months'}</span>
            </div>
          </label>
      </Question>
      <Question
        headingText="Mood"
        className={styles.moodGraphQuestion}>
        <p className={styles.questionText}>Fill out the mood graph below by sliding each point up or down to reflect your mood during that time.</p>
        <MoodGraph
          dataPoints={duration}
          months={months}
          setMonths={setMonths}
          />
      </Question>
      <Question
        headingText="Positive effects">
        <p className={styles.questionText}>What has had the biggest <u>positive</u> effects on your mood during your assignment?<br />(Select all that apply)</p>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Holidays / travel
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Social activities
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Assignment progress
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Time off work
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Establishing a routine
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Colleagues within the PO
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodPositives" />
            Other
          </label>
      </Question>
      <Question
        headingText="Negative effects">
        <p className={styles.questionText}>What has had the biggest <u>negative</u> effects on your mood during your assignment?<br />(Select all that apply)</p>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodNegatives" />
            Workload
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodNegatives" />
            Progress (or lack thereof)
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodNegatives" />
            Isolation
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodNegatives" />
            Colleagues within the PO
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodNegatives" />
            Unrealistic assignment goals
          </label>
          <label className={styles.closedQuestion}>
            <input className={styles.closedAnswer} type="checkbox" name="moodNegatives" />
            Other
          </label>
      </Question>
      <input className={styles.submitBtn} type="submit" />
      <p>Your specific responses will not be shared in our presentation, and this information will not be shared with anyone outside AVP.</p>
    </div>
  </section>)
}

export default Survey