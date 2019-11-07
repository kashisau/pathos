/**
 * Moods data serverless function
 * 
 * Written for use with Netlify's Functions product, this script will accept an
 * AJAX request from the client in order to relay the full suite of submissions
 * to the client.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 */

exports.handler = function(event, context, callback) {
  switch (event.httpMethod) {
    case 'GET':
      return callback(null, getMoods(event, context))
    default:
      return callback(null, unsupportedMethod(event, context))
  }
}

/**
 * Retrieves a full set of submissions made to the pathos app via Netlify Forms.
 * @param {*} event The Netlify Functions Event object.
 * @param {*} context The Netlify Functions context object.
 */
const getMoods = (event, context) => {
  const NETLIFY_KEY = process.env.SERVER_NETLIFY_SECRET_KEY
  console.log("NETLIFY_KEY: ", NETLIFY_KEY)

}

const unsupportedMethod = (event, context) => {
  console.log("Called the unsupportedMethod method. ", event)
}