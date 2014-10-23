(function() {
  var argv, async, chalk, collectImages, collected, fetch, fn, fs, mkdirp, optimist, path, request, worker, _;

  request = require('request');

  async = require('async');

  chalk = require('chalk');

  _ = require('underscore');

  path = require('path');

  fs = require('fs');

  mkdirp = require('mkdirp');

  optimist = require('optimist');

  String.prototype.endsWith = function(suffix) {
    return -1 !== this.indexOf(suffix, this.length - suffix.length);
  };

  collected = 0;

  worker = function(task, callback) {
    return task(function(error) {
      if (!error) {
        collected++;
      }
      process.stdout.write('.');
      return callback();
    });
  };

  fetch = function(url, to, done) {
    var options;
    options = {
      url: url,
      encoding: null
    };
    return request(options, function(error, response, body) {
      var name;
      if (error) {
        return done(error);
      }
      to = path.resolve(to);
      if (to.endsWith('/')) {
        name = path.basename(url);
        to = path.join(to, name);
      }
      return mkdirp(path.dirname(to), function(error) {
        if (error) {
          return done(error);
        }
        return fs.writeFile(to, body, done);
      });
    });
  };

  collectImages = function(access_token, dest) {
    var i, options, queue;
    options = {
      url: 'https://api.instagram.com/v1/media/popular',
      qs: {
        access_token: access_token
      }
    };
    queue = async.queue(worker, 10);
    i = 0;
    queue.empty = function() {
      return request(options, function(error, response, body) {
        var json, status;
        if (error) {
          return console.log('ck', error);
        }
        status = response.statusCode;
        try {
          json = JSON.parse(body);
        } catch (_error) {
          console.log("invalid json: " + body);
          return;
        }
        if (status !== 200) {
          console.log("Returned " + status + "\n" + (JSON.stringify(json, null, 4)));
          return;
        }
        return async.each(json.data, function(media, callback) {
          var filename, task;
          filename = "" + (i++) + (path.extname(media.images.standard_resolution.url));
          task = _.partial(fetch, media.images.standard_resolution.url, "" + dest + "/" + filename);
          queue.push(task);
          return callback();
        }, function(err) {
          if (err) {
            return console.log(err);
          }
        });
      });
    };
    return queue.empty();
  };

  process.on('SIGINT', function() {
    console.log("\nCollected " + (chalk.green(collected)) + " images");
    return process.exit(0);
  });

  argv = optimist.usage("Usage: \n  instagram-images <access_token> [OPTIONS]" + "\n\nExample: \n  " + "instagram-images 1538218134.1677ed0.714cc89f60494a32a21e2948482d3336").options({
    dest: {
      alias: 'd',
      description: 'The directory where all download images stored',
      "default": 'instagram-images'
    }
  }).wrap(80).argv;

  if (!argv._[0]) {
    console.error('Error: Must specify Instagram access token.');
    optimist.showHelp(fn = console.error);
    process.exit(1);
  }

  console.log('Collecting');

  collectImages(argv._[0], argv.dest);

}).call(this);
