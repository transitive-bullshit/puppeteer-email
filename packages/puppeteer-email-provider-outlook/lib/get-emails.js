'use strict'

const delay = require('delay')
const ow = require('ow')
const pMap = require('p-map')

const getEmail = require('./get-email')

module.exports = async (opts) => {
  const {
    browser,
    query
  } = opts

  ow(query, ow.string.nonEmpty.label('query'))

  const page = await browser.newPage()
  await page.goto('https://outlook.live.com/mail/inbox')

  // search for an input query to narrow down email results
  // TODO: don't require a search query
  await page.waitFor('input[aria-label=Search]', { visible: true })
  await delay(1000)
  await page.focus('input[aria-label=Search]')
  await page.click('input[aria-label=Search]')
  await page.type('input[aria-label=Search]', query, { delay: 7 })
  // await page.waitForNavigation({ timeout: 0 })
  await page.click('button[aria-label=Search]')
  await delay(4000)

  const $emails = await page.$$('[data-convid] > div > div')

  // fetch and parse individual emails
  const emails = await pMap($emails, async ($email) => {
    await Promise.all([
      page.waitForNavigation(),
      $email.click()
    ])

    return getEmail(page)
  }, {
    concurrency: 1
  })

  await page.close()
  return emails
}
