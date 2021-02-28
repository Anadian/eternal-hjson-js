# eternal-hjson
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Semantic Versioning 2.0.0](https://img.shields.io/badge/semver-2.0.0-brightgreen?style=flat-square)](https://semver.org/spec/v2.0.0.html)
[![License](https://img.shields.io/github/license/Anadian/eternal-hjson-js)](https://github.com/Anadian/eternal-hjson-js/blob/master/LICENSE)
> A fork of [hjson-js](https://github.com/hjson/hjson-js) with the goal of making hjson immortal!!

![Hjson Intro](https://hjson.github.io/hjson1.gif)

JSON is easy for humans to read and write ... in theory. In practice, JSON gives us plenty of opportunities to make mistakes without even realizing it.

Hjson is a syntax extension to JSON. It's NOT a proposal to replace JSON or to incorporate it into the JSON spec itself. It's intended to be used like a user interface for humans, to read and edit before passing the JSON data to the machine.
```hjson
{
  # specify rate in requests/second (because comments are helpful!)
  rate: 1000

  // prefer c-style comments?
  /* feeling old fashioned? */

  # did you notice that rate doesn't need quotes?
  hey: look ma, no quotes for strings either!

  # best of all
  notice: []
  anything: ?

  # yes, commas are optional!
}
```

The JavaScript implementation of HJSON is based on [JSON-js](https://github.com/douglascrockford/JSON-js). For other platforms see [hjson.github.io](http://hjson.github.io).
# Table of Contents
- [Background](#Background)
- [Install](#Install)
- [Usage](#Usage)
- [CLI](#CLI)
- [API](#API)
- [Contributing](#Contributing)
- [License](#License)
# Background
I created this fork as the [original HJSON package](https://github.com/hjson/hjson-js) has been largely unmaintained and is in need of a significant refactoring. I believe the [HJSON format](https://hjson.github.io) is still as necessary as ever as there still isn't a good standard for user-facing config without it. HJSON works as a light layer that sits on top of existing JSON implementations and supersedes the standard to be more user friendly and produce less syntax errors; HJSON is **not** designed to replace or extend the [JSON standard](https://www.json.org/json-en.html), rather HJSON is designed to be seamlessly and consistently converted to proper JSON for data exchange (machine-to-machine) purposes. 

[JSON](https://en.wikipedia.org/wiki/JSON) remains the king of data serialisation formats and for good reason: its syntax is **very simple and consistent**, it can handle structured data beautifully, it's fairly intuitive and human readable, and most importantly it is universally recognised and has robust parsers and formatters in just about every single language/environment imaginable. JSON isn't particularly pleasant to edit/write by hand as that's irrelevant to its actual goal of being a perfect data-exchange format: JSON doesn't have comments for a [good (data-exchange) reason](https://archive.vn/20150704102718/https://plus.google.com/+DouglasCrockfordEsq/posts/RK8qyGVaGSr) and the simplicity and consistency required by its syntax can be frustrating when edited directly by an end user which make it less than ideal as a format for user-facing config files. Now, what if we could leverage the universality of JSON for config files without having to require our users to worry about trailing commas or missing braces?

Enter, [HJSON](https://hjson.github.io): the human interface for JSON! Its got comments, no trailing-comma errors, doesn't require double-quotes around key names, and much, much more. The best part is HJSON is designed to sit on top of existing JSON infrastructure, not replace JSON itself, so you can present friendly HJSON to your end users and easily to convert it to regular JSON when you need to do some machine-to-machine communication. HJSON's syntax is a superset of usability concepts to standard JSON's data-exchange-oriented syntax so all existing JSON is also valid HJSON.

So now that you know what HJSON is and, hopefully, why I like it so much, it might be helpful to explain why I feel none of other serilisation/config formats fit the bill:
- [XML](https://en.wikipedia.org/wiki/XML) is extremely complex and requires a massive codebase to implement the whole standard; its syntax is verbose, declarative, and very unpleasant to write directly. There's a reason JSON overtook it as the de facto data serialisation format.
- [YAML](https://yaml.org/) is one of the first major attempts to design a data serilisation standard specifically for user configuration files but, I feel, it falls short in many areas: its standard has been amended several times and virtually none of the existing YAML engine compliantly implement a single version of the standard, let alone keep pace with latest standard and its syntax is littered with nasty, undocumented gotchas, like its whitespacing rules, which are only intuitive to Python programmers.
- [TOML](https://toml.io/en/) is an attempt to standardise the ol'INI-style config files: unfortunately, it inherits the main weakness of INI files witch is their lack of an easy and succinct way to represent structured data.
- [JSON5](https://json5.org/) is deliberately confusingly named to make it sound more important than it is: it is not a revision of JSON, let alone the fifth version. It is its own JSON-like format that is incompatible with existing JSON engines and aims to **replace** JSON as its own format. It extends the JSON standard with features that serve no purpose in the context of data exchange and lack any agreed-upon semantic meaning outside of ECMAscript.
# Install
To use `eternal-hjson` as a dependency in your project, run:
```sh
npm install --save eternal-hjson
```
To use `eternal-hjson`'s built-in CLI globally, run:
```sh
npm install --global eternal-hjson
```
# Usage
```js
const HJSON = require('eternal-hjson');

var obj = HJSON.parse(hjsonText);
var text2 = HJSON.stringify(obj);
```
## CLI
# API
# Contributing
Changes are tracked in [CHANGELOG.md](CHANGELOG.md).
# License
MIT ©2021 Anadian

SEE LICENSE IN [LICENSE](LICENSE)

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)\
This project's documentation is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
