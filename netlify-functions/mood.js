/**
 * Mood data serverless function
 * 
 * Written for use with Netlify's Functions product, this script will accept an
 * AJAX request from the client, validate its contents and then adds it as a
 * document to the FaunaDB instance used by this app.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 */

exports.handler = function(event, context, callback) {
  console.log(event)

  switch (event.httpMethod) {
    case 'POST':
      return callback(submitMood(event, context))
    case 'GET':
      return callback(getMoods(event, context))
    default:
      return callback(unsupportedMethod(event, context))
  }
}

const submitMood = (event, context) => {
  console.log("Called the submitMood method. ", event)
}

const getMoods = (event, context) => {
  console.log("Called the getMoods method. ", event)
}

const unsupportedMethod = (event, context) => {
  console.log("Called the unsupportedMethod method. ", event)
}