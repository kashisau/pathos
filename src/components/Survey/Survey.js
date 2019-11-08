import React, { useState, useEffect, useRef } from 'react'

import SurveyIntro from '../SurveyIntro'
import Question from '../Question'

import pageStyles from '../../helpers/Styles/page-components.module.css'
import styles from './survey.module.css'

import rangeStyles from './range.module.css'
import MoodGraph from '../MoodGraph/MoodGraph'

import spinner from '../../img/oval.svg'
import success from '../../img/icon-success.svg'

import { 
  MONTH_NAMES,
  MOOD_POSITIVES,
  MOOD_NEGATIVES
} from '../../helpers/Constants/Constants'

const Survey = ({ surveyComplete }) => {

  // Pure constants
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() - 1

  // User data
  const [onAssignment, setOnAssignment] = useState()
  const [startMonth, setStartMonth] = useState(currentMonth)
  const [duration, setDuration] = useState(7)
  const [months, setMonths] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [moodPositives, setPositives] = useState([])
  const [moodNegatives, setNegatives] = useState([])

  // Form state data
  const [errorStates, setErrorStates] = useState([])
  const [submitState, setSubmitState] = useState()

  const formRef = useRef()
  const encode = (data) => Object.keys(data)
                            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
                            .join("&")
  
  const validate = () => {
    const errorStates = []
    if ( ! onAssignment) {
      errorStates.push('onAssignment')
    }
    if ( ! moodPositives.length) {
      errorStates.push('moodPositives')
    }
    if ( ! moodNegatives.length) {
      errorStates.push('moodNegatives')
    }
    setErrorStates(errorStates)
    return errorStates.length === 0
  }

  // Preload these images
  useEffect(() => {
    const preloadImages = () => {
      new Image().src = spinner
      new Image().src = success
    }
    window.addEventListener('load', preloadImages)
    return () => window.removeEventListener('load', preloadImages)
  }, [])

  const processSubmission = e => {
    // Handle the form submission here.
    e.preventDefault()
    e.stopPropagation()
    if ( ! validate()) return
    
    setSubmitState("pending")
    
    const submissionData = encode({
      "form-name": "pathos",
      "Assignment status": onAssignment,
      "Assignment start month": startMonth,
      "Months completed": duration,
      "Mood": months.join(","),
      "Mood positives": moodPositives.join(","),
      "Mood negatives": moodNegatives.join(",")
    })
    
    fetch("/submit", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: submissionData
    })
    .then(response => setSubmitState(response.ok? 'submitted' : 'error'))
    .then(() => window.localStorage.setItem('surveyComplete', true))
    .catch(error => setSubmitState('error'))
  }

  const setRadio = e => {
    const input = e.currentTarget
    const name = input.name
    const value = input.value

    switch(name) {
      case 'onAssignment':
        setOnAssignment(value)
        setErrorStates([...errorStates].filter(field => field !== 'onAssignment'))
        break
      default:
        console.warn("An input was changed but could not be mapped to a state handler.")
    }
  }

  const setCheckbox = e => {
    const input = e.currentTarget
    const name = input.name

    const activeValues = Array.from(formRef.current[name])
                          .filter(checkbox => checkbox.checked)
                          .map(checkbox => checkbox.value)

    switch(name) {
      case 'moodPositives':
        setPositives(activeValues)
        setErrorStates([...errorStates].filter(field => field !== 'moodPositives'))
        break
      case 'moodNegatives':
        setNegatives(activeValues)
        setErrorStates([...errorStates].filter(field => field !== 'moodNegatives'))
        break
      default:
        console.warn("An input was changed but could not be mapped to a state handler.")
    }
  }

  const submitArea = () => {
    switch(submitState) {
      case "pending":
        return (
          <>
            <input disabled={submitState} className={[styles.submitBtn, styles.pending].join(" ")} type="submit" value="Sending..."/>
            <img className={[styles.submitIcon, styles.pendingSpinner].join(" ")} src={spinner} alt="Loading animation for pending submission" />
          </>)
      case "submitted":
        return (
          <>
            <input disabled={true} className={[styles.submitBtn, styles.submitted].join(" ")} type="submit" value="Submitted" />
            <img className={[styles.submitIcon, styles.submitTick].join(" ")} src={success} alt="Submit success icon" />
          </>)
      case "error":
        return (
          <>
            <input className={styles.submitBtn} type="submit" />
            <div className={styles.submitError}>There was an error submitting your results. Please check your internet connection and try again.</div>
          </>)
      default:
        return <input className={styles.submitBtn} type="submit" />
    }
  }

  if (surveyComplete)
    return (
      <>
        <SurveyIntro surveyComplete={surveyComplete} />
        <hr className={pageStyles.divider} />
        <div className={pageStyles.content}>
        <h2 className={pageStyles.pageHeading}>Thank you for completing the survey</h2>
        <p className={pageStyles.bodyCentre}>The results will be presented at Chitwan during the November in country meeting.</p>
        </div>
      </>
    )

  return (<>
    <SurveyIntro />
    <section className={styles.survey}>
      <hr className={pageStyles.divider} />
      <form
        ref={formRef}
        name="pathos"
        method="post"
        action="/submit"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={e => processSubmission(e)}>
        <div className={pageStyles.content}>
          <Question
            headingText="Let's begin">
              <p className={styles.questionText}>Are you currently on assignment?</p>
              <label className={styles.closedQuestion}>
                <input className={styles.closedAnswer} disabled={submitState} type="radio" name="onAssignment" value="Volunteer" onChange={setRadio} />
                Yes
              </label>
              <label className={styles.closedQuestion}>
                <input className={styles.closedAnswer} disabled={submitState} type="radio" name="onAssignment" value="Partner" onChange={setRadio} />
                Yes, as a volunteer partner
              </label>
              <label className={styles.closedQuestion}>
                <input className={styles.closedAnswer} disabled={submitState} type="radio" name="onAssignment" value="Alumni" onChange={setRadio} />
                No, I've completed mine
              </label>
              <label className={styles.closedQuestion}>
                <input className={styles.closedAnswer} disabled={submitState} type="radio" name="onAssignment" value="Alumni partner" onChange={setRadio} />
                No, I was a volunteer partner
              </label>
              <div className={
                [
                  styles.errorState,
                  errorStates.includes('onAssignment')? styles.errorStateActive : undefined
                ].join(" ")}>Please specify the state of your volunteer assignment above</div>
          </Question>
          <Question
            headingText="Time on assignment">
              <p className={styles.questionText}>Which month did you arrive in-country?</p>
              <label>
                <select
                  className={styles.startMonth}
                  onChange={e => { setStartMonth(e.currentTarget.selectedIndex) }}
                  disabled={submitState} 
                  value={MONTH_NAMES[startMonth]}>
                  {
                    MONTH_NAMES.map(
                      (month, index) => <option key={index}>{month}</option>
                    )
                  }
                </select>
              </label>
              <p className={styles.questionText}>How many full months have you spent in-country?</p>
              <label>
                <input disabled={submitState} className={[styles.monthsRange, rangeStyles.range].join(" ")} type="range" min="2" max="13" onChange={(e) => setDuration(e.currentTarget.value)} value={duration} />
                <div className={styles.monthsText}>
                  <span className={styles.monthsValue}>{duration - 1}</span>
                  <span className={styles.monthsUnit}>{duration === 1? 'month' : 'months'}</span>
                </div>
              </label>
          </Question>
          <Question
            headingText="Mood"
            className={styles.moodGraphQuestion}>
            <p className={styles.questionText}>Fill out the mood graph below by sliding each point up or down to reflect your mood during that time.</p>
            <p className={styles.questionTextEm}>Hint: Turn your mobile device sideways to make dragging each data point a little easier.</p>
            <MoodGraph
              dataPoints={duration}
              months={months}
              startMonth={startMonth}
              setMonths={setMonths}
              submitState={submitState}
              />
          </Question>
          <Question
            headingText="Positive effects">
            <p className={styles.questionText}>What has had the biggest <u>positive</u> effects on your mood during your assignment?<br />(Select all that apply)</p>
              {
                MOOD_POSITIVES.map((moodPositive, i) => 
                  <label className={styles.closedQuestion} key={i}>
                    <input
                      className={styles.closedAnswer}
                      type="checkbox"
                      name="moodPositives"
                      value={moodPositive}
                      disabled={submitState} 
                      selected={moodPositives.includes(moodPositive)}
                      onChange={setCheckbox} />
                      {moodPositive}
                  </label>
                )
              }
              <div className={
                [
                  styles.errorState,
                  errorStates.includes('moodPositives')? styles.errorStateActive : undefined
                ].join(" ")}>Please choose at least one positive contributor to your mood from the list above</div>
          </Question>
          <Question
            headingText="Negative effects">
            <p className={styles.questionText}>What has had the biggest <u>negative</u> effects on your mood during your assignment?<br />(Select all that apply)</p>
              {
                  MOOD_NEGATIVES.map((moodNegative, i) => 
                    <label className={styles.closedQuestion} key={i}>
                      <input
                        className={styles.closedAnswer}
                        type="checkbox"
                        name="moodNegatives"
                        value={moodNegative}
                        disabled={submitState} 
                        selected={moodNegatives.includes(moodNegative)}
                        onChange={setCheckbox} />
                        {moodNegative}
                    </label>
                  )
                }
                <div className={
                [
                  styles.errorState,
                  errorStates.includes('moodNegatives')? styles.errorStateActive : undefined
                ].join(" ")}>Please choose at least one negative contributor to your mood from the list above</div>
          </Question>
          {
            errorStates.length > 0 && <p className={styles.formError}>There were missing questionnaire responses above. Please check that you have answered all the questions above and try again.</p>
          }
          <div className={styles.submitArea}>
            {submitArea()}
          </div>
          <p className={styles.disclaim}>Your responses to this questionnaire will be presented anonymously, and this information will only be used by AVP.</p>
        </div>
      </form>
    </section>
  </>)
}

export default Survey