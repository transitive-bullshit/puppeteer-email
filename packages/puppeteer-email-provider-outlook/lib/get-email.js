'use strict'

const ow = require('ow')
const parseEmail = require('parse-email')

module.exports = async (id, opts) => {
  const {
    browser
  } = opts

  ow(id, ow.string.nonEmpty)
  ow(opts.query, ow.string.nonEmpty)

  const url = `https://outlook.live.com/mail/id/${encodeURIComponent(id)}`

  const page = await browser.newPage()
  await page.goto(url)

  // view original message source from the email overflow options menu
  await page.waitFor('.ms-OverflowSet-overflowButton button', { visible: true })
  await page.click('.ms-OverflowSet-overflowButton button')
  await page.waitFor('button[name~=View]', { visible: true })
  await page.click('button[name~=View]')

  await page.waitFor('[role=dialog] .allowTextSelection', { visible: true })
  const content = await page.$eval('[role=dialog] .allowTextSelection', $el => $el.textContent)
  await page.close()

  const email = await parseEmail(content)
  return email
}
