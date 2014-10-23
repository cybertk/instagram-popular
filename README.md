## instagram-popular

Collect Instagram popular images and video

[![Build Status](http://img.shields.io/travis/cybertk/instagram-popular.svg?style=flat)](https://travis-ci.org/cybertk/instagram-popular)
[![Dependency Status](https://david-dm.org/cybertk/instagram-popular.png)](https://david-dm.org/cybertk/instagram-popular)
[![devDependency Status](https://david-dm.org/cybertk/instagram-popular/dev-status.svg)](https://david-dm.org/cybertk/instagram-popular#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/cybertk/instagram-popular/badge.png?branch=master)](https://coveralls.io/r/cybertk/instagram-popular?branch=master)

## Installation

[Node.js][] and [NPM][] is required.

    $ npm install instagram-popular

[Node.js]: https://npmjs.org/
[NPM]: https://npmjs.org/

## Usage

```
$ instagram-popular 1538218134.1677ed0.714cc8 -d images
```

Click [here][] to get Instagram **Access Token** via [pixelunion].

[here]: https://instagram.com/oauth/authorize/?client_id=1677ed07ddd54db0a70f14f9b1435579&redirect_uri=http://instagram.pixelunion.net&response_type=token
[pixelunion]: http://instagram.pixelunion.net/

### Options

```
Usage:
  instagram-popular <access_token> [OPTIONS]

Example:
  instagram-popular 1538218134.1677ed0.714cc89f60494a32a21e2948482d3336

Options:
  --dest, -d  The directory where all download images stored
                                                    [default: "instagram-media"]

```

## Run Tests

    $ npm test

## Contribution

Any contribution is more then welcome!
