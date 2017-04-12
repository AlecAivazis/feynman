# feynman
[![Build Status](https://travis-ci.org/AlecAivazis/feynman.svg?branch=master)](https://travis-ci.org/AlecAivazis/feynman)
[![Coverage Status](https://coveralls.io/repos/github/AlecAivazis/feynman/badge.svg?branch=feat%2Fcoverage)](https://coveralls.io/github/AlecAivazis/feynman?branch=feat%2Fcoverage)

A javascript application for creating feynman diagrams. Live at [feynman.aivazis.com](http://feynman.aivazis.com).

This repo started as a migration of my [original](https://github.com/AlecAivazis/feynman-old) feynman diagram 
application to a leaner flask server. It then evolved from a [badly written angular 1.2 application](https://github.com/AlecAivazis/feynman/tree/angular1.x) to a less-badly written react/redux app. During that time,
the backend was also rewritten to golang. 


## Running the Tests
The tests are written using jest:

```
yarn && npm run test
```
