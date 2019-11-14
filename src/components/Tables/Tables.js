import React, { useState, useRef } from 'react'

import TablesIntro from '../TablesIntro'

import pageStyles from '../../helpers/Styles/page-components.module.css'
import tableStyles from '../../helpers/Styles/tables.module.css'

import { MONTH_NAMES } from '../../helpers/Constants/Constants'

const TABLE_DATA_URL = `${process.env.NODE_ENV === 'production'? '' : 'http://localhost:9000'}/.netlify/functions/table-data`

const Tables = () => {

  // User data
  const [tableData, setTableData] = useState()
  const [errorCode, setErrorCode] = useState()

  // Form state data
  const isCancelled = useRef(false);

  async function fetchData() {
    const fetcher = await window
                            .fetch(TABLE_DATA_URL)
                            .catch(e => setErrorCode(e))
    if ( ! fetcher) return
    if ( ! fetcher.ok) return setErrorCode(fetcher.status)
    const response = await fetcher.json()
    if (!isCancelled.current) {
      setTableData(response)
    }
  }

  React.useEffect(() => {
    fetchData()
    return () => {
      isCancelled.current = true;
    };
  }, []);

  if (!tableData)
    return (
      <>
        <TablesIntro surveyComplete={true} />
        <hr className={pageStyles.divider} />
        <div className={pageStyles.content}>
          <h2 className={pageStyles.pageHeading}>Loading data...</h2>
          {errorCode && errorCode &&
            <div className={pageStyles.serverError}>
              <h3 className={pageStyles.serverErrorHeading}>There was an error retreiving the table data.</h3>
              <p>Error connecting to the database to retrieve the submission data. Please try again later.</p>
            </div>}
        </div>
      </>
    )

    const {
      userTypes, 
      moodsOverTime,
      moodsOverYear,
      moodNegatives,
      moodPositives
    } = tableData


  const moodsOverTimeHeading = ['Pre-departure',...[...Array(12).keys()].map(i => i+1)]
  const moodsOverYearHeading = [...MONTH_NAMES]

  return (
    <>
      <TablesIntro surveyComplete={true} />
      <hr className={pageStyles.divider} />
      <div className={pageStyles.content}>
        <section className={tableStyles.tableSection}>
          <h2 className={pageStyles.pageHeading}>User types</h2>
          <p>A breakdown of the types of volunteers that are represented in the submission data.</p>
          <table className={tableStyles.dataTable}>
            <thead className={tableStyles.header}>
              <tr>
                {Object.keys(userTypes).map(
                  (userType, i) => <td className={tableStyles.numericalData} key={i}>{userType}</td>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(userTypes).map(
                  (count, i) => <td className={tableStyles.numericalData} key={i}>{count}</td>
                )}
              </tr>
            </tbody>
          </table>
        </section>
        <section className={tableStyles.tableSection}>
          <h2 className={pageStyles.pageHeading}>Positive modifiers</h2>
          <p>What people indicated as having a positive effect on their moods whilst in-country.</p>
          <table className={tableStyles.dataTable}>
            <thead className={tableStyles.header}>
              <tr>
                {Object.keys(moodPositives).map(
                  (userType, i) => <td className={tableStyles.numericalData} key={i}>{userType}</td>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(moodPositives).map(
                  (count, i) => <td className={tableStyles.numericalData} key={i}>{count}</td>
                )}
              </tr>
            </tbody>
          </table>
        </section>
        <section className={tableStyles.tableSection}>
          <h2 className={pageStyles.pageHeading}>Negative modifiers</h2>
          <p>What people indicated as having a negative effect on their moods whilst in-country.</p>
          <table className={tableStyles.dataTable}>
            <thead className={tableStyles.header}>
              <tr>
                {Object.keys(moodNegatives).map(
                  (userType, i) => <td className={tableStyles.numericalData} key={i}>{userType}</td>
                )}
              </tr>
            </thead>
            <tbody>
              <tr>
                {Object.values(moodNegatives).map(
                  (count, i) => <td className={tableStyles.numericalData} key={i}>{count}</td>
                )}
              </tr>
            </tbody>
          </table>
        </section>
        <section className={tableStyles.tableSection}>
          <h2 className={pageStyles.pageHeading}>Moods over time (normalised)</h2>
          <p>Displays all participants' mood over time, normalised to align all start dates between individuals.</p>
          <table className={tableStyles.dataTable}>
            <thead className={tableStyles.header}>
              <tr>
                {moodsOverTimeHeading.map(month => 
                  <td className={tableStyles.numericalData} key={month}>{month}</td>
                )}
              </tr>
            </thead>
            <tbody>
                {moodsOverTime.map(
                  (moodSubmission, i) => 
                    <tr key={i}>
                      {moodSubmission.map((moodValue, j) => <td key={j}>{moodValue}</td>)}
                    </tr>
                )}
            </tbody>
          </table>
        </section>
        <section className={tableStyles.tableSection}>
          <h2 className={pageStyles.pageHeading}>Moods over year</h2>
          <p>Participants' moods over the course of 12-months, adjusted for start date.</p>
          <table className={tableStyles.dataTable}>
            <thead className={tableStyles.header}>
              <tr>
                {moodsOverYearHeading.map(month => 
                  <td className={tableStyles.numericalData} key={month}>{month}</td>
                )}
              </tr>
            </thead>
            <tbody>
                {moodsOverYear.map(
                  (moodSubmission, i) => 
                    <tr key={i}>
                      {moodSubmission.map((moodValue, j) => <td key={j}>{moodValue || '-'}</td>)}
                    </tr>
                )}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
  
}

export default Tables