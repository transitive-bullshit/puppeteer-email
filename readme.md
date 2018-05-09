# puppeteer-email

> Email automation driven by headless chrome.


## Features

- automate email account creation
- automate email sending
- automate email fetching
- automate email verification from third-party services
  - twitter
  - github
  - facebook
  - etc.
- comes with a [library](packages/puppeteer-email) and [CLI](packages/puppeteer-email-cli)
- uses [puppeteer](https://github.com/GoogleChrome/puppeteer) under the hood
- perfect for bots...


## Status

This project is an early WIP, but the [CLI](packages/puppeteer-email-cli) currently works to automate [Outlook](https://outlook.live.com). See [todo](#todo) for more details on the immediate roadmap.


## Packages

- [puppeteer-email](packages/puppeteer-email) - Main library entrypoint.
- [puppeteer-email-cli](packages/puppeteer-email-cli) - CLI for executing one-off email automation tasks.
- [puppeteer-email-session](packages/puppeteer-email-session) - Holds state for an authenticated puppeteer email session.
- [puppeteer-email-provider](packages/puppeteer-email-provider) - Abstract base class for puppeteer email providers.
  - [puppeteer-email-provider-outlook](packages/puppeteer-email-provider-outlook) - Puppeteer email provider for [Outlook](https://outlook.live.com).
  - [puppeteer-email-provider-gmail](packages/puppeteer-email-provider-gmail) - Puppeteer email provider for [Gmail](https://www.google.com/gmail). (TODO)
  - [puppeteer-email-provider-yahoo](packages/puppeteer-email-provider-yahoo) - Puppeteer email provider for [Yahoo Mail](https://mail.yahoo.com/). (TODO)
- [parse-email](https://github.com/transitive-bullshit/parse-email) - Parses mime-encoded email messages.
- [sms-number-verifier](https://github.com/transitive-bullshit/sms-number-verifier) - Allows you to spoof SMS number verification.


## Usage

### CLI

```bash
npm install -g puppeteer-email-cli
```

```bash
  Usage: puppeteer-email [options] [command]

  Options:

    -V, --version              output the version number
    -u, --username <username>  email account username
    -p, --password <password>  email account password
    -P, --provider <provider>  email provider (default: outlook)
    -H, --no-headless          (puppeteer) disable headless mode
    -s, --slow-mo <timeout>    (puppeteer) slows down operations by the given ms (default: 0)
    -h, --help                 output usage information

  Commands:

    signup [options]
    signin
    get-emails [options]
```


### Library

This example signs into an [Outlook](https://outlook.live.com) account, searches for a given query, and then parses and returns all emails returned for that query.

```bash
npm install --save puppeteer-email
npm install --save puppeteer-email-provider-outlook
```

```js
const PuppeteerEmail = require('puppeteer-email')
const PuppeteerEmailProviderOutlook = require('puppeteer-email-provider-outlook')

const provider = new PuppeteerEmailProviderOutlook()
const client = new PuppeteerEmail(provider)

const username = 'XXX'
const password = 'XXX'

const session = await client.signin({ username, password })
const emails = await session.getEmails({ query: 'from:github' })
await session.close()
```

See [parse-email](https://github.com/transitive-bullshit/parse-email) for details on email model properties.


## Todo

- providers
  - [x] outlook
  - [ ] gmail
  - [ ] yahoo mail
- captcha-solver integration
- sms-verifier integration


## Related

- [puppeteer](https://github.com/GoogleChrome/puppeteer) - Headless Chrome Node API used under the hood.
- [parse-email](https://github.com/transitive-bullshit/parse-email) - Parses mime-encoded email messages.
- [sms-number-verifier](https://github.com/transitive-bullshit/sms-number-verifier) - Allows you to spoof SMS number verification.


## Disclaimer

Using this softare to violate the terms and conditions of any third-party service is strictly against the intent of this software. By using this software, you are acknowledging this fact and absolving the author or any potential liability or wrongdoing it may cause. This software is meant for testing and experimental purposes only, so please act responsibly.


## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
