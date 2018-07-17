'use strict'

const delay = require('delay')
// const faker = require('faker') // TODO

module.exports = async (user, opts) => {
  const {
    smsNumberVerifier,
    browser
  } = opts

  const page = await browser.newPage()
  await page.goto('https://login.yahoo.com/account/create')

  // basic user info
  // ---------------

  await page.type('input[name=firstName]', user.firstName, { delay: 40 })
  await delay(250)
  await page.type('input[name=lastName]', user.lastName, { delay: 8 })
  await delay(330)
  await page.type('input[name=yid]', user.username, { delay: 32 })
  await delay(134)

  // sms validation
  // --------------

  if (!smsNumberVerifier) {
    throw new Error('sms validation required')
  }

  let attempts = 0
  let service = 'yahoo'
  let number

  do {
    number = await smsNumberVerifier.getNumber({ service })
    if (!number) throw new Error() // TODO

    const info = smsNumberVerifier.getNumberInfo(number)
    if (!info || !info.isValid()) throw new Error() // TODO

    // select country code prefix
    await page.select('select[name=shortCountryCode]', info.getRegionCode().toUpperCase())

    // ignore country code prefix
    const shortNumber = info.getNumber('significant')

    await page.type('input[name=phone]', shortNumber, { delay: 13 })

    // birth date
    // ----------

    await delay(33)
    await page.type('input[name=password]', user.password, { delay: 3 })
    await delay(47)
    await page.select('select[name=mm]', user.birthday.month)
    await delay(62)
    await page.type('input[name=dd]', user.birthday.day)
    await delay(23)
    await page.type('input[name=yyyy]', user.birthday.year)
    await delay(76)

    await Promise.all([
      page.click('button[type=submit]', { delay: 9 }),
      page.waitForNavigation({ timeout: 0 })
    ])

    await delay(1000)

    let error = null

    if (await page.$('#reg-error-phone')) {
      await page.waitFor('#reg-error-phone', { visible: true })
        .then(() => page.$eval('#reg-error-phone', (e) => e.innerText))
        .then((e) => { error = e.trim() })
    }

    if (error) {
      ++attempts
      console.warn(`phone number error "${number}" (${attempts} attempts):`, error)

      if (smsNumberVerifier.provider.addNumberToBlacklist) {
        const result = await smsNumberVerifier.provider.addNumberToBlacklist({ service, number })
        console.warn('sms adding to blacklist', { service, number }, result)
      }

      if (++attempts > 3) {
        throw new Error(`phone number error: ${error}`)
      }

      await delay(5000)
    } else {
      break
    }
  } while (true)

  // TODO: waitForNavigation also happens for errors and wipes out most fields
  // birth date, password, and phone number stuffs
  // if there's an error,

  // sms validation
  // --------------

  let waitForNavigation = true

  const waitForManualInput = async (msg) => {
    console.warn(msg)
    console.warn('waiting for manual input...')
    await page.waitForNavigation({ timeout: 200000 })
    waitForNavigation = false
  }

  if (await page.$('button[type=submit][name=sendCode]')) {
    await page.click('button[type=submit][name=sendCode]', { delay: 9 })
    await page.waitFor('input[name=code]')

    const authCodes = await smsNumberVerifier.getAuthCodes({ number, service })
    console.log('sms request', service, number, authCodes)

    if (authCodes.length) {
      for (let i = 0; i < authCodes.length; ++i) {
        const code = authCodes[i]
        await page.type('input[name=code]', code)

        let error = false
        await Promise.all([
          page.click('button[name=verifyCode]', { delay: 4 }),
          Promise.race([
            page.waitForNavigation({ timeout: 0 })
              .then(() => { waitForNavigation = false }),
            page.waitFor('.error-msg', { visible: true })
              .then(() => page.$eval('.error-msg', (e) => e.innerText))
              .then((e) => { error = e.trim() })
          ])
        ])

        if (error) {
          console.warn('sms code error', { number, code }, error)

          await delay(1000)
          await page.focus('input[type=code]')
          for (let i = 0; i < code.length + 8; ++i) {
            await page.keyboard.press('Backspace')
          }
          await delay(1000)
        } else {
          break
        }
      }
    }

    if (waitForNavigation) {
      await waitForManualInput('sms number verification failed')
    }
  }

  await page.waitFor('.mail-button-wait button[type=submit]', { visible: true })
  await Promise.all([
    page.click('.mail-button-wait button[type=submit]', { delay: 9 }),
    page.waitForNavigation()
  ])

  // main account page
  // -----------------

  await page.goto('http://mail.yahoo.com/')

  // email inbox first-run
  // ---------------------

  await delay(800)

  // close any first-run dialogs
  while (true) {
    if (!await page.$('button[title=Close]')) break
    await page.click('button[title=Close]', { delay: 9 })
    await delay(350)

    try {
      await page.click('button[title="Not now"]', { delay: 9 })
    } catch (err) { }
  }

  // should now be at https://mail.yahoo.com/mail/inbox
  await page.close()
}
