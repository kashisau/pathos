import React from 'react';
import Layout from './layouts/Layout'
import Intro from './components/Intro'
import Survey from './components/Survey'

const App = () =>
  <Layout>
    <Intro participantName="Kashi Samaraweera" />
    <Survey />
  </Layout>

export default App;
