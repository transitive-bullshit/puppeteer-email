'use strict'

const delay = require('delay')
const ow = require('ow')
const pMap = require('p-map')

const getEmail = require('./get-email')

module.exports = async (opts) => {
  const {
    concurrency = 1,
    browser,
    query
  } = opts

  ow(opts.query, ow.string.nonEmpty)

  const page = await browser.newPage()
  await page.goto('https://outlook.live.com/mail/inbox')

  // search for
  await page.waitFor('input[aria-label=Search]', { visible: true })
  await page.type('input[aria-label=Search]', query)
  await page.click('[data-click-source=search_box] [data-icon-name=Search]')
  await delay(1000)

  // fetch list of email ids
  const ids = await page.$$eval('[data-convid]', $els => {
    return $els.map(($el) => $el.getAttribute('data-convid'))
  })

  // fetch and parse individual emails
  return pMap(ids, (id) => getEmail(id, opts), {
    concurrency
  })
}
