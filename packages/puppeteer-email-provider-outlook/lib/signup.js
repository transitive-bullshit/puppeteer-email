'use strict'

const delay = require('delay')
const faker = require('faker')
const tempy = require('tempy')

module.exports = async (user, opts) => {
  const {
    browser
  } = opts

  const page = await browser.newPage()
  await page.goto('https://signup.live.com/signup')

  // email / username
  // ----------------

  await page.waitFor('#liveSwitch', { visible: true })
  await page.click('#liveSwitch', { delay: 10 })
  await delay(100)

  let error = null
  do {
    await page.type('#MemberName', user.username, { delay: 40 })
    await delay(250)
    await page.click('#iSignupAction', { delay: 20 })

    await delay(1000)
    error = await page.$('#MemberNameError')

    // TODO: there is an issue here where if one username fails, the next will
    // always also fail
    if (error) {
      await page.focus('#MemberName')
      for (let i = 0; i < user.username.length + 8; ++i) {
        await page.keyboard.press('Backspace')
      }

      user.username = faker.internet.userName()
    }
  } while (error)

  console.log(JSON.stringify(user, null, 2))

  // password
  // -------------------

  await page.waitFor('#Password', { visible: true })
  await delay(100)
  await page.type('#Password', user.password, { delay: 10 })
  await delay(100)
  await page.click('#iOptinEmail', { delay: 10 })
  await delay(100)
  await page.click('#iSignupAction', { delay: 30 })

  // first and last name
  // -------------------

  await page.waitFor('#FirstName', { visible: true })
  await delay(100)
  await page.type('#FirstName', user.firstName, { delay: 30 })
  await delay(120)
  await page.type('#LastName', user.lastName, { delay: 35 })
  await delay(260)
  await page.click('#iSignupAction', { delay: 25 })

  // birth date
  // ----------

  await page.waitFor('#BirthMonth', { visible: true })
  await delay(100)
  await page.select('#BirthMonth', user.birthday.month)
  await delay(120)
  await page.select('#BirthDay', user.birthday.day)
  await delay(260)
  await page.select('#BirthYear', user.birthday.year)
  await delay(220)
  await page.click('#iSignupAction', { delay: 8 })

  // captcha or sms validation
  // -------------------------

  await delay(1000)

  if (await page.$('#hipTemplateContainer')) { // captcha
    await page.waitFor('#hipTemplateContainer img', { visible: true })

    const $img = await page.$('#hipTemplateContainer img')
    const captchaPath = tempy.file({ extension: 'png' })
    await $img.screenshot({
      path: captchaPath
    })

    console.log({ captchaPath })

    // TODO: actually solve captcha...
    const captcha = 'test'
    await page.type('#hipTemplateContainer input', captcha, { delay: 40 })

    // TODO: verify this is the correct button
    // TODO: handle incorrect captcha result

    await Promise.all([
      page.waitForNavigation({ timeout: 0 }),
      page.click('#iSignupAction', { delay: 9 })
    ])
  } else {
    // TODO: handle case of sms validation
    await page.waitForNavigation({ timeout: 0 })
  }

  // main account page
  // -----------------

  await delay(500)
  await page.goto('https://www.outlook.com/?refd=account.microsoft.com&fref=home.banner.profile')

  // inbox page first-run
  // --------------------

  await delay(800)

  // keep pressing next...
  while (true) {
    if (!await page.$('.dialog button.nextButton')) break
    await page.click('.dialog button.nextButton', { delay: 5 })
    await delay(220)
  }

  // wait until "let's go" button appears...
  while (true) {
    await delay(1000)
    if (await page.$('.dialog button.primaryButton')) break
  }

  await delay(120)
  await Promise.all([
    page.waitForNavigation(),
    page.click('.dialog button.primaryButton', { delay: 7 })
  ])

  // should now be at https://outlook.live.com/mail/inbox
  await page.close()
}
