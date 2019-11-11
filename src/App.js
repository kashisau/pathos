import React, { useState, useEffect } from 'react';
import Layout from './layouts/Layout'
import Survey from './components/Survey'
import SurveySubmitted from './components/SurveySubmitted'
import Results from './components/Results'
import { BrowserRouter, Route } from 'react-router-dom'

const App = () => {
  const [surveyComplete, setSurveyComplete] = useState()
  const [surveyMood, setSurveyMood] = useState()
  const [surveySubmissionUuid, setSurveySubmissionUuid] = useState()

  useEffect(() => {
    setSurveyComplete(window.localStorage.getItem('surveyComplete'))
    setSurveySubmissionUuid(window.localStorage.getItem('surveySubmissionUuid'))
    const moods = window.localStorage.getItem('surveyMoods')
    if ( ! moods) return
    const months = moods
                    .split(",")
                    .map(mood => parseFloat(mood))
    setSurveyMood(months)
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" component={
          (props) => 
            !surveyComplete?
              <Survey
                {...props}
                surveyComplete={surveyComplete}
                surveyMood={surveyMood}
                surveySubmissionUuid={surveySubmissionUuid} />
              :
              <SurveySubmitted
                {...props}
                surveyComplete={surveyComplete}
                surveyMood={surveyMood}
                surveySubmissionUuid={surveySubmissionUuid} />
            } exact/>
        <Route path="/results" component={
          (props) =>
            <Results
            {...props}
            surveyComplete={surveyComplete}
            surveyMood={surveyMood}
            surveySubmissionUuid={surveySubmissionUuid} />
          } exact/>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
