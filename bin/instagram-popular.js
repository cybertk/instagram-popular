#!/usr/bin/env node

var optimist = require("optimist");
var chalk = require("chalk");

var collectPopular = require("../lib");

process.on('SIGINT', function () {
  console.log("\nCollected " + chalk.green(collectPopular.collected) + " media");
  process.exit(0);
});

argv = optimist
  .usage("Usage: \n  instagram-popular <access_token> [OPTIONS]" +
  "\n\nExample: \n  " + "instagram-popular 1538218134.1677ed0.714cc89f60494a32a21e2948482d3336")
  .options({
    "dest": {
      "alias": 'd',
      "description": 'The directory where all download images stored',
      "default": 'instagram-media'
    }
  })
  .wrap(80)
  .argv;

if (argv._[0] === undefined) {
  console.error('Error: Must specify Instagram access token.');
  optimist.showHelp(fn=console.error);
  process.exit(1);
}

console.log('Collecting');
collectPopular(argv._[0], argv.dest);
