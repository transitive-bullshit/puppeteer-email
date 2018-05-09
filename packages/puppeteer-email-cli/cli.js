#!/usr/bin/env node
'use strict'

const program = require('commander')

const PuppeteerEmail = require('puppeteer-email')

const providers = require('./lib/providers')
const { version } = require('./package')

module.exports = (argv) => {
  program
    .version(version)
    .option('-u, --username <username>', 'email account username')
    .option('-p, --password <password>', 'email account password')
    .option('-P, --provider <provider>', 'email provider', /^(outlook)$/, 'outlook')
    .option('-H, --no-headless', '(puppeteer) disable headless mode')
    .option('-s, --slow-mo <timeout>', '(puppeteer) slows down operations by the given ms', parseInt, 0)

  program
    .command('signup')
    .option('-n, --first-name', 'user first name')
    .option('-l, --last-name', 'user last name')
    .option('-b, --birthday', 'user birthday (month/day/year)')
    .action(async (opts) => {
      try {
        const Provider = providers[program.provider]
        const provider = new Provider()
        const client = new PuppeteerEmail(provider)

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
          puppeteer: {
            headless: !!program.headless,
            slowMo: program.slowMo
          }
        })

        user.email = session.email
        console.log(JSON.stringify(user, null, 2))
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    })

  program
    .command('signin')
    .action(async () => {
      try {
        const Provider = providers[program.provider]
        if (!Provider) throw new Error('invalid provider')
        const provider = new Provider()
        const client = new PuppeteerEmail(provider)

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

        console.log(session.email)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    })

  program.parse(argv)
}

module.exports(process.argv)
