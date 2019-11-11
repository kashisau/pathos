import React, { useState, useRef } from 'react'

import SurveyIntro from '../SurveyIntro'
import ResultsGraph from '../ResultsGraph'

import pageStyles from '../../helpers/Styles/page-components.module.css'

const MOOD_DATA_URL = `${process.env.NODE_ENV === 'production'? '' : 'http://localhost:9000'}/.netlify/functions/moods`

const Survey = ({ surveySubmissionUuid }) => {

  // User data
  const [submissionData, setSubmissionData] = useState([])

  // Form state data
  const isCancelled = useRef(false);

  async function fetchData() {
    if ( ! surveySubmissionUuid) return
    const fetcher = await window.fetch(`${MOOD_DATA_URL}/${surveySubmissionUuid}`)
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
      {submissionData && <ResultsGraph
        moodSubmissions={submissionData}
        monthsDisplayed={13}
        showTrendline={false} />}
      <p className={pageStyles.bodyCentre}>The full set of results will be presented at Chitwan during the November in country meeting.</p>
      </div>
    </>
  )
}

export default Survey