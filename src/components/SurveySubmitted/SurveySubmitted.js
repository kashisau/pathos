import React, { useState, useRef } from 'react'

import SurveyIntro from '../SurveyIntro'
import ResultsGraph from '../ResultsGraph'

import pageStyles from '../../helpers/Styles/page-components.module.css'

const MOOD_DATA_URL = `${process.env.NODE_ENV === 'production'? '' : 'http://localhost:9000'}/.netlify/functions/moods`

const Survey = ({ surveySubmissionUuid }) => {

  // User data
  const [submissionData, setSubmissionData] = useState([])
  const [errorCode, setErrorCode] = useState()

  // Form state data
  const isCancelled = useRef(false);

  const clearExistingSurvey = () => {
    localStorage.clear()
    window.location.reload()
  }

  async function fetchData() {
    if ( ! surveySubmissionUuid) return
    const fetcher = await window
                            .fetch(`${MOOD_DATA_URL}/${surveySubmissionUuid}`)
                            .catch(e => setErrorCode(e))
    if ( ! fetcher) return
    if ( ! fetcher.ok) return setErrorCode(fetcher.status)
    const response = await fetcher.json()
    if (!isCancelled.current) {
      setSubmissionData([response])
    }
  }

  React.useEffect(() => {
    fetchData()
    return () => {
      isCancelled.current = true;
    };
  }, [surveySubmissionUuid]);

  return (
    <>
      <SurveyIntro surveyComplete={true} />
      <hr className={pageStyles.divider} />
      <div className={pageStyles.content}>
      <h2 className={pageStyles.pageHeading}>Your mood over time (months)</h2>
      {errorCode && errorCode === 404 &&
        <div className={pageStyles.serverError}>
          <h3 className={pageStyles.serverErrorHeading}>There was an error retreiving your submission.</h3>
          <p>We seem to have lost your submission. Please try submitting your mood information again by clicking the new submission button below.</p>
          <button className={pageStyles.btn} onClick={clearExistingSurvey}>New submission</button>
        </div>}
      {errorCode && errorCode !== 404 &&
        <div className={pageStyles.serverError}>
          <h3 className={pageStyles.serverErrorHeading}>There was an error retreiving your submission.</h3>
          <p>An internal server error prevented the retreival of your previous submission. Please try again later.</p>
        </div>}
      {submissionData && !errorCode && <ResultsGraph
        moodSubmissions={submissionData}
        monthsDisplayed={13}
        showTrendline={false} />}
      <p className={pageStyles.bodyCentre}>The full set of results will be presented at Chitwan during the November in country meeting.</p>
      </div>
    </>
  )
}

export default Survey