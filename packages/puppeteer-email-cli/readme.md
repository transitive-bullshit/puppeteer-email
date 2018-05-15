# puppeteer-email-cli

> CLI for email automation driven by headless chrome.

[![NPM](https://img.shields.io/npm/v/puppeteer-email-cli.svg)](https://www.npmjs.com/package/puppeteer-email-cli) [![Build Status](https://travis-ci.com/transitive-bullshit/puppeteer-email.svg?branch=master)](https://travis-ci.com/transitive-bullshit/puppeteer-email) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save puppeteer-email-cli
```

## Usage

```bash
  Usage: puppeteer-email [options] [command]

  Options:

    -V, --version              output the version number
    -u, --username <username>  email account username
    -p, --password <password>  email account password
    -e, --email <email>        email account address (overrides username and provider)
    -P, --provider <provider>  email provider (default: outlook)
    -H, --no-headless          (puppeteer) disable headless mode
    -s, --slow-mo <timeout>    (puppeteer) slows down operations by the given ms (default: 0)
    -h, --help                 output usage information

  Commands:

    signup [options]
    signin
    get-emails [options]
```

## Related

-   [puppeteer-email](https://github.com/transitive-bullshit/puppeteer-email) - Email automation driven by headless chrome.

## License

MIT © [Travis Fischer](https://github.com/transitive-bullshit)
