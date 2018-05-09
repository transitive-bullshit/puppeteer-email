'use strict'

const faker = require('faker')
const ow = require('ow')
const puppeteer = require('puppeteer')

const PuppeteerEmailProvider = require('puppeteer-email-provider')

class PuppeteerEmail {
  constructor (provider) {
    ow(provider, ow.object.instanceOf(PuppeteerEmailProvider))

    this._provider = provider
  }

  get provider () { return this._provider }

  async signup (user, opts = { }) {
    if (!user) user = { }

    user.firstName = user.firstName || faker.name.firstName()
    user.lastName = user.lastName || faker.name.lastName()
    user.password = user.password || faker.internet.password()
    user.birthday = user.birthday || {
      month: '' + (random(1, 12) | 0),
      day: '' + (random(1, 30) | 0),
      year: '' + (random(1960, 1997) | 0)
    }

    const browser = opts.browser || await puppeteer.launch(opts.puppeteer)

    return this._provider.signup(user, {
      browser,
      ...opts
    })
  }

  async signin (user, opts = { }) {
    const browser = opts.browser || await puppeteer.launch(opts.puppeteer)

    return this._provider.signin(user, {
      browser,
      ...opts
    })
  }
}

function random (min, max) {
  return Math.random() * (max - min) + min
}

module.exports = PuppeteerEmail
