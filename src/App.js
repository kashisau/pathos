import React, { useState, useEffect } from 'react';
import Layout from './layouts/Layout'
import Survey from './components/Survey'
import Results from './components/Results'
import { BrowserRouter, Route } from 'react-router-dom'

const App = () => {
  const [surveyComplete, setSurveyComplete] = useState()
  useEffect(() => {
    setSurveyComplete(window.localStorage.getItem('surveyComplete'))
  }, [])
  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" component={(props) => <Survey {...props} surveyComplete={surveyComplete} />} exact/>
        <Route path="/results" component={(props) => <Results {...props} surveyComplete={surveyComplete} />} exact/>
      </Layout>
    </BrowserRouter>
  )
}

export default App;
