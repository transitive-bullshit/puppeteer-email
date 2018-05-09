'use strict'

module.exports = async (user, opts) => {
  const {
    browser
  } = opts

  const page = await browser.newPage()
  await page.goto('https://login.live.com/')

  await page.waitFor('input[type=email]', { visible: true })
  await page.type('input[type=email]', user.username)
  await page.click('input[type=submit]')

  await page.waitFor('input[type=password]', { visible: true })
  await page.type('input[type=password]', user.password)
  await Promise.all([
    page.waitForNavigation(),
    page.click('input[type=checkbox]')
  ])

  // should now be at
  // https://account.microsoft.com/?lang=en-US&refd=account.live.com&refp=landing

  await page.close()
}
