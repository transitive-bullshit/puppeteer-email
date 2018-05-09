'use strict'

class PuppeteerEmailProvider {
  get name () {
    throw new Error('email provider must override "name"')
  }

  async signup (user, opts = { }) {
    throw new Error('email provider must override "signup"')
  }

  async signin (user, opts = { }) {
    throw new Error('email provider must override "signin"')
  }

  async signout (session) {
    throw new Error('email provider must override "signout"')
  }

  async sendEmail (session, email, opts) {
    throw new Error('email provider must override "sendEmail"')
  }

  async getEmails (session, opts) {
    throw new Error('email provider must override "getEmails"')
  }
}

module.exports = PuppeteerEmailProvider
