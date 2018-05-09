# puppeteer-email-provider

> Abstract base class for puppeteer email providers.

[![NPM](https://img.shields.io/npm/v/puppeteer-email-provider.svg)](https://www.npmjs.com/package/puppeteer-email-provider) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-email.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-email) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save puppeteer-email-provider
```


## Usage

**TODO**


## API

**TODO**

- puppeteer-email-provider
  - signup: function(user: PuppeteerEmailUser, opts) => Promise<PuppeteerEmailSession>
  - signin: function(user: Object, opts) => Promise<PuppeteerEmailSession>
  - signout: function(session: PuppeteerEmailSession) => Promise
  - sendEmail: function(session: PuppeteerEmailSession, email: Object, opts) => Promise
  - getEmails: function(session: PuppeteerEmailSession, opts) => Promise<PuppeteerEmailModel>


## Related

- [puppeteer-email](https://github.com/transitive-bullshit/puppeteer-email) - Email automation driven by headless chrome.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
