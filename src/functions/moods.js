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

const NETLIFY_KEY = process.env.SERVER_NETLIFY_SECRET_KEY
const allowedOrigin = (process.env.NODE_ENV === "production")? 'https://avifeels.kashis.com.au' : 'http://localhost:3000'

exports.handler = function(event, context, callback) {
  console.log(process.env)
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
  return new Promise((resolve, reject) => {
    resolve({
        headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Origin': 'http://localhost:8000',
      },
      statusCode: 200,
      body: 'someBody',
    })
  })
}

const unsupportedMethod = (event, context) => {
  return {
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': 'http://localhost:8000',
    },
    statusCode: 400,
    body: 'someBody',
  }
}