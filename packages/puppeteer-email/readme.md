# puppeteer-email

> Email automation drive by headless chrome.

[![NPM](https://img.shields.io/npm/v/puppeteer-email.svg)](https://www.npmjs.com/package/puppeteer-email) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-email.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-email) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install --save puppeteer-email
```


## Usage

```js
const PuppeteerEmail = require('puppeteer-email')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')

const provider = new PuppeteerEmailProviderOutlook()
const client = new PuppeteerEmail(provider)

const session = await client.signin(user)
const emails = await session.getEmails({
  query: 'from:github'
})
await session.close()
```

See [parse-email](https://github.com/transitive-bullshit/parse-email) for details on email model properties.


## API

**TODO**

- puppeteer-email
  - constructor(provider: PuppeteerEmailProvider)
  - signup: function(user: PuppeteerEmailUser, opts) => Promise<PuppeteerEmailSession>
  - signin: function(user: Object, opts) => Promise<PuppeteerEmailSession>


## Related

- [puppeteer-email-cli](packages/puppeteer-email-cli) - CLI for executing one-off email automation tasks.
- [puppeteer-email-session](https://github.com/transitive-bullshit/puppeteer-email/tree/master/packages/puppeteer-email-session) - Holds state for an authenticated puppeteer email session.
- [parse-email](https://github.com/transitive-bullshit/parse-email) - Parses mime-encoded email messages.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
