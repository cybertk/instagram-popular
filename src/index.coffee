request = require 'request'
async = require 'async'
_ = require 'underscore'
path = require 'path'
fs = require 'fs'
mkdirp = require 'mkdirp'
crypto = require 'crypto'

CONCURRENT_JOB = 50

String::endsWith = (suffix) ->
  -1 != @indexOf suffix, @length - suffix.length


# Download worker
worker = (task, callback) ->
  task (error) ->
    module.exports.collected++ unless error
    process.stdout.write '.'
    callback()

fetch = (url, to, done) ->
  options =
    url: url
    encoding: null
  request options, (error, response, body) ->

    return done(error) if error

    to = path.resolve to
    if to.endsWith '/'
      name = path.basename url
      to = path.join to, name

    mkdirp path.dirname(to), (error) ->
      return done(error) if error

      fs.writeFile to, body, done

collectPopular = (access_token, dest) ->
  options =
    url: 'https://api.instagram.com/v1/media/popular'
    qs: {access_token}
    # 30s timeout
    timeout: 30000

  queue = async.queue worker, CONCURRENT_JOB
  queue.empty = () ->
    request options, (error, response, body) ->
      return console.log('ck', error) if error

      status = response.statusCode
      try
        json = JSON.parse body
      catch
        console.log "invalid json: #{body}"
        return

      if status != 200
        console.log """
        Returned #{status}
        #{JSON.stringify(json, null, 4)}
        """

        return

      async.each json.data, (media, callback) ->
        filename = crypto.randomBytes(8).toString('hex')
        filename += path.extname media.images.standard_resolution.url
        task = _.partial fetch, media.images.standard_resolution.url, "#{dest}/#{filename}"
        queue.push task, () ->
          queue.empty() if queue.length() < 50
        callback()

      , (err) ->
        console.log err if err

  queue.empty()

module.exports = collectPopular
module.exports.collected = 0
