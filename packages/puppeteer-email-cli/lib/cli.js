#!/usr/bin/env node
'use strict'

require('dotenv').config()

const program = require('commander')

const PuppeteerEmail = require('puppeteer-email')
const CaptchaSolver = require('captcha-solver')
const SMSNumberVerifier = require('sms-number-verifier')

const { version } = require('../package')

module.exports = (argv) => {
  program
    .version(version)
    .option('-u, --username <username>', 'email account username')
    .option('-p, --password <password>', 'email account password')
    .option('-e, --email <email>', 'email account address (overrides username and provider)')
    .option('-P, --provider <provider>', 'email provider', /^(outlook)$/, 'outlook')
    .option('-H, --no-headless', '(puppeteer) disable headless mode')
    .option('-s, --slow-mo <timeout>', '(puppeteer) slows down operations by the given ms', parseInt, 0)
    .option('-c, --captchaProvider <string>', 'API key for captcha provider', /^(anti-captcha)$/, 'anti-captcha')
    .option('-k, --captchaKey <string>', 'Captcha solver provider')
    .option('-s, --smsProvider <string>', 'SMS number verifier provider', 'plivo')

  program
    .command('signup')
    .option('-n, --first-name <name>', 'user first name')
    .option('-l, --last-name <name>', 'user last name')
    .option('-b, --birthday <date>', 'user birthday (month/day/year); eg 9/20/1986')
    .action(async (opts) => {
      try {
        const client = new PuppeteerEmail(program.email || program.provider)
        const captchaSolver = program.captchaKey
          ? new CaptchaSolver(program.captchaProvider, { key: program.captchaKey })
          : null
        const smsNumberVerifier = program.smsProvider
          ? new SMSNumberVerifier(program.smsProvider)
          : null

        /*
        const number = '17204491791' // await smsNumberVerifier.getNumber()
        console.log(number)
        const codes = await smsNumberVerifier.getAuthCodes({ number, service: 'microsoft', timeout: 600000 })
        console.log(codes)
        */

        const user = {
          username: program.username,
          password: program.password,
          firstName: opts.firstName,
          lastName: opts.lastName
        }

        if (opts.birthday) {
          const [ month, day, year ] = opts.birthday
          user.birthday = { month, day, year }
        }

        const session = await client.signup(user, {
          captchaSolver,
          smsNumberVerifier,
          puppeteer: {
            headless: !!program.headless,
            slowMo: program.slowMo
          }
        })

        user.email = session.email
        console.log(JSON.stringify(user, null, 2))

        await session.close()

        if (smsNumberVerifier && smsNumberVerifier.provider.close) {
          await smsNumberVerifier.provider.close()
        }
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    })

  program
    .command('signin')
    .action(async () => {
      try {
        const client = new PuppeteerEmail(program.email || program.provider)

        const user = {
          username: program.username,
          password: program.password
        }

        if (!user.username || !user.username.length) {
          throw new Error('missing required "username"')
        }

        if (!user.password || !user.password.length) {
          throw new Error('missing required "password"')
        }

        const session = await client.signin(user, {
          puppeteer: {
            headless: !!program.headless,
            slowMo: program.slowMo
          }
        })

        await session.close()

        console.log(session.email)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    })

  program
    .command('get-emails')
    .option('-q, --query <string>', 'query string to filter emails')
    .action(async (opts) => {
      try {
        const client = new PuppeteerEmail(program.email || program.provider)

        const user = {
          username: program.username,
          password: program.password
        }

        if (!user.username || !user.username.length) {
          throw new Error('missing required "username"')
        }

        if (!user.password || !user.password.length) {
          throw new Error('missing required "password"')
        }

        if (!opts.query || !opts.query.length) {
          throw new Error('missing required "query"')
        }

        const session = await client.signin(user, {
          puppeteer: {
            headless: !!program.headless,
            slowMo: program.slowMo
          }
        })

        const emails = await session.getEmails({
          query: opts.query
        })

        await session.close()

        console.log(JSON.stringify(emails, null, 2))
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    })

  program.parse(argv)
}

module.exports(process.argv)
