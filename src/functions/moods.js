import fetch from 'node-fetch'
import palette from 'google-palette'

/**
 * Moods data serverless function
 * 
 * Written for use with Netlify's Functions product, this script will accept an
 * AJAX request from the client in order to relay the full suite of submissions
 * to the client.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 */

const netlifyKey = process.env.SERVER_NETLIFY_SECRET_KEY
const formId = process.env.SERVER_NETLIFY_FORM_ID
const allowedOrigin = process.env.URL || 'http://localhost:3000'

exports.handler = async function(event, context) {
  switch (event.httpMethod) {
    case 'GET':
      const { path } = event
      const uuid = path.split('/')
                .filter(pathPart => pathPart !== '')
                .pop()

      // Get all the moods
      if (uuid === 'moods') return getMoods()

      // Get a single mood
      return getMood(uuid)
    default:
      return unsupportedMethod(event, context)
  }
}

const fetchMoods = async () => 
  fetch(`https://api.netlify.com/api/v1/forms/${formId}/submissions`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${netlifyKey}`
      },
    }
  )
  .then(response => {
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(moodJson => moodJson.map(submission => {
    const {
      data: {
        Mood: moodString,
        'Months completed': monthsCompleted,
        'Survey Submission Uuid': newSubmissionUuid
      }
    } = submission
    const mood = moodString.split(',')
    const moodTruncated = mood
      .filter((moodValue, index) => index < monthsCompleted)
      .map(moodValue => parseFloat(moodValue))

    return {
      uuid: newSubmissionUuid,
      mood: moodTruncated
    }
  }))
  .then(moodData => {
    // Give each submission a particular colour
    const graphColors = palette('mpn65', moodData.length)
    return moodData.map((mood, i) => ({
      ...mood,
      colour: graphColors[i]
    }))
  })
  .catch(e => console.error(e))


/**
 * Retrieves a full set of submissions made to the pathos app via Netlify Forms.
 * @param {*} event The Netlify Functions Event object.
 * @param {*} context The Netlify Functions context object.
 */
const getMoods = async () =>
  fetchMoods()
    .then(moodData => ({
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        statusCode: 200,
        body: JSON.stringify(moodData)
      })
    )
    .catch(e => console.error(e))

const getMood = async uuid => 
  fetchMoods()
    .then(moods => {
      const mood = moods.filter(submission => submission.uuid === uuid)
      if (mood.length === 0) throw new Error('empty')
      return mood.pop()
    })
    .then(moodData => ({
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        statusCode: 200,
        body: JSON.stringify(moodData),
      })
    )
    .catch(e => ({
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        statusCode: e.message === 'empty'? 404 : 500,
        body: JSON.stringify([]),
      })
    )

const unsupportedMethod = async () => ({
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      statusCode: 422,
      body: 'someBody',
    })
