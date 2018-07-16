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

  ow(query, ow.string.nonEmpty)

  const page = await browser.newPage()
  await page.goto('https://mail.yahoo.com')

  // TODO

  await page.close()
  return emails
}
