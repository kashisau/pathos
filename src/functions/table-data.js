import fetch from 'node-fetch'

/**
 * Moods tables serverless function
 * 
 * Arranges data into tables for use with presentations.
 * 
 * @author Kashi Samaraweera <kashi@kashis.com.au>
 */

const netlifyKey = process.env.SERVER_NETLIFY_SECRET_KEY
const formId = process.env.SERVER_NETLIFY_FORM_ID
const allowedOrigin = process.env.URL || 'http://localhost:3000'

exports.handler = async function(event, context) {
  switch (event.httpMethod) {
    case 'GET':
      return getTables()
    default:
      return unsupportedMethod(event, context)
  }
}

const fetchData = async () => {
  return fetch(`https://api.netlify.com/api/v1/forms/${formId}/submissions`,
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
  .then(submissions => submissions.map(submission => {
    return submission
  }))
  .catch(e => console.error(e))
}

const getTables = async () => {
  const submissions = await fetchData()
  return ({
    headers: {
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': allowedOrigin,
    },
    statusCode: 200,
    body: JSON.stringify({
      userTypes: userTypes(submissions),
      moodsOverTime: moodsOverTime(submissions),
      moodsOverYear: moodsOverYear(submissions),
      moodPositives: moodModifiers(submissions, true),
      moodNegatives: moodModifiers(submissions, false)
    }),
  })
}

/**
 * Returns respondents' mood data taking into account the month that they began
 * their assignment / partner's assignment. Each mood array will contain
 * exactly 12 elements, however they will be `undefined` if the participant was
 * not in-country at the time (or hasn't yet reached that month).
 * 
 * @param {*} submissions 
 */
const moodsOverYear = submissions => {
  const monthsModulo = monthNo => ((monthNo%12)+12)%12
  const moods = submissions
    .map(submission => submission.data)
    .map(submissionData => {
      const {
        'Mood': moodString,
        'Months completed': monthsCompletedString,
        'Assignment start month': startMonthString
      } = submissionData

      const monthsCompleted = parseInt(monthsCompletedString)
      const startMonth = parseInt(startMonthString)
      
      const moodsAdjusted = [
                              null,null,null,null,
                              null,null,null,null,
                              null,null,null,null
                            ]

      moodString
        .split(',')
        .filter((_, i) => i < monthsCompleted)
        .map(moodValue => parseFloat(moodValue))
        .forEach((moodValue, i) => {
          if (i === 0) return // Discard pre-departure data
          moodsAdjusted[monthsModulo(startMonth + i)] = moodValue
        })

      return moodsAdjusted
    })
  return moods
}

/**
 * Categorises respondents and counts them according to their volunteer status.
 * 
 * @param {*} submissions 
 */
const userTypes = submissions => {
  return submissions
    .map(submission => submission.data)
    .reduce((userTypes, submissionData) => {
      const {
        'Assignment status': assignmentStatus
      } = submissionData

      if (userTypes.hasOwnProperty(assignmentStatus)) {
        return {
          ...userTypes,
          [assignmentStatus]: userTypes[assignmentStatus] + 1
        }
      }
      return {
        ...userTypes,
        [assignmentStatus]: 1
      }
    }, {})
}

/**
 * Extracts mood data from the set of submissions.
 * 
 * @param {*} submissions 
 * @return {[][]}  Returns an array with each element representing a user's
 *                 submission as a list of mood values over time from -1 to 1.
 */
const moodsOverTime = submissions => {
  return submissions
    .map(submission => submission.data)
    .map(submissionData => {
      const {
        'Mood': moodString,
        'Months completed': monthsCompletedString
      } = submissionData

      const monthsCompleted = parseInt(monthsCompletedString)
      const moods = moodString
                      .split(',')
                      .filter((_, i) => i < monthsCompleted)
                      .map(moodValue => parseFloat(moodValue))

      return moods
    })
}

/**
 * Extracts a list of the positive or negative impacts to a volunteer's or
 * partner's mood.
 *
 * @param {*} submissions 
 * @param {bool} positive Determines which polarity of responses to gather, with
 *                        true resolving the positive modifiers, and false
 *                        resolving the negative modifiers.
 */
const moodModifiers = (submissions, positive = true) => {
  return submissions
    .map(submission => submission.data)
    .reduce((moodModifiers, submissionData) => {
      const moodModifierType = positive? 'Mood positives' : 'Mood negatives'
      const moodModifiersString = submissionData[moodModifierType]
      const submissionMoodModifiers = moodModifiersString.split(',')
      submissionMoodModifiers.forEach(
        modifier => {
          if (moodModifiers.hasOwnProperty(modifier)) {
            return moodModifiers[modifier]++
          }
          return moodModifiers[modifier] = 1
        }
      )
      return moodModifiers
    }, {})
}

const table = (head, body, title) => `
  ${title && `<h1>${title}</h1>`}
  <table>
    <thead>
      ${head.map(headRow => `<tr>${
        headRow.map(headCell => `<td>${headCell}</td>`).join('')
      }</tr>`).join("")}
    </thead>
    <tbody>
      ${body.map(bodyRow => `<tr>${
        bodyRow.map(bodyCell => `<td>${bodyCell}</td>`).join('')
      }</tr>`).join("")}
    </tbody>
  </table>
`

const html = body => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>title</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
  </head>
  <body>
    ${body}
  </body>
</html>`

const unsupportedMethod = async () => ({
      headers: {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': allowedOrigin,
      },
      statusCode: 422,
      body: 'someBody',
    })
