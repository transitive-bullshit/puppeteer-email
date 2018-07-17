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

  let page

  try {
    const page = await browser.newPage()
    await page.goto('https://outlook.live.com/mail/inbox')
    await delay(1000)

    // search for an input query to narrow down email results
    // TODO: don't require a search query
    await page.waitFor('input[aria-label=Search]', { visible: true })
    await delay(2000)

    let attempts = 0
    do {
      await page.focus('input[aria-label=Search]')
      await page.click('input[aria-label=Search]')
      await page.type('input[aria-label=Search]', query, { delay: 7 })

      const value = await page.$eval('input[aria-label=Search]', (el) => el.value)
      if (value.trim() === query.trim()) {
        break
      }

      if (++attempts > 3) {
        throw new Error(`unable to search for query "${query}"`)
      }

      // erase current input
      await page.focus('input[aria-label=Search]')
      for (let i = 0; i < value.length + 8; ++i) {
        await page.keyboard.press('Backspace')
      }
      await delay(200)
    } while (true)

    // await page.waitForNavigation({ timeout: 0 })
    await page.click('button[aria-label=Search]')
    await delay(2000)

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
  } catch (err) {
    await page.close()
    throw err
  }
}
