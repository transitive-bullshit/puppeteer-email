'use strict'

const delay = require('delay')
const parseEmail = require('parse-email')

module.exports = async (page) => {
  // await page.waitForNavigation({ timeout: 0 })

  // view original message source from the email overflow options menu
  await page.waitFor('.allowTextSelection button[aria-label="More mail actions"]', { visible: true })
  await page.click('.allowTextSelection button[aria-label="More mail actions"]')
  await page.waitFor('button[name~=View]', { visible: true })
  await page.click('button[name~=View]')

  await page.waitFor('[role=dialog] .allowTextSelection', { visible: true })
  await delay(500)
  const content = await page.$eval('[role=dialog] .allowTextSelection', $el => $el.textContent)
  await page.click('[role=dialog] button')
  await delay(500)

  try {
    const email = await parseEmail(content)
    return email
  } catch (err) {
    return null
  }
}
