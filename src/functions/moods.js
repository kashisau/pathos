import fetch from 'node-fetch'
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

console.log("URL Environment Variable: ", process.env.URL)
console.log("allowedOrigin: ", allowedOrigin)

exports.handler = function(event, context, callback) {
  switch (event.httpMethod) {
    case 'GET':
      getMoods(event, context)
        .then((moodData) => callback(null, moodData))
      break;
    default:
      return callback(null, unsupportedMethod(event, context))
  }
}

/**
 * Retrieves a full set of submissions made to the pathos app via Netlify Forms.
 * @param {*} event The Netlify Functions Event object.
 * @param {*} context The Netlify Functions context object.
 */
const getMoods = async (event, context) => {
  return fetch(`https://api.netlify.com/api/v1/forms/${formId}/submissions`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${netlifyKey}`
      },
    })
    .then(response => {
      if (!response.ok) throw new Error(response.statusText)
      return response.json()
    })
    .then(moodJson => moodJson.map(submission => {
      const {
        data: {
          Mood: moodString,
          'Months completed': monthsCompleted
        }
      } = submission
      const mood = moodString.split(',')
      const moodTruncated = mood
        .filter((moodValue, index) => index < monthsCompleted)
        .map(moodValue => parseFloat(moodValue))

      return moodTruncated
    }))
    .then(moodData => {
      return ({
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Origin': allowedOrigin,
        },
        statusCode: 200,
        body: JSON.stringify(moodData),
      })
    })
  }

const unsupportedMethod = (event, context) => {
  return {
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': allowedOrigin,
    },
    statusCode: 422,
    body: 'someBody',
  }
}