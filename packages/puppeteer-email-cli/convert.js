#!/usr/bin/env node
'use strict'

const fs = require('fs')
const input = fs.readFileSync('./test.json', 'utf8')
const json = JSON.parse(input)

const output = json
  .map((u) => `${u.firstName}\t${u.lastName}\t${u.birthday.month}/${u.birthday.day}/${u.birthday.year}\t${u.email}\t${u.password}`)
  .map((u) => u.toString()).join('\n')

fs.writeFileSync('out.txt', output, 'utf8')
