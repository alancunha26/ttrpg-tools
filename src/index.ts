import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { Config, Context } from './types';
import { backgroundConverter } from './converters/background-converter';
import { helpers as HelpersBuilder } from './helpers';
import { demoConverter } from './converters/demo-converter';
import { DataBuilder } from './builders/data-builder';

function errorColor(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

(async function main() {
  const DEFAULT_CONFIG = path.resolve(process.cwd(), 'example/config.json');
  const DEFAULT_OUTPUT = path.resolve(process.cwd(), 'zcompendium');

  const program = new Command();

  program
    .name('5e-tools-converter')
    .description('A CLI that converts content from 5eTools to Markdown')
    .version('0.0.1');

  program
    .option('-c, --config <string>', 'Config file path', DEFAULT_CONFIG)
    .option('-o, --output <string>', 'Output directory', DEFAULT_OUTPUT)
    .option('-d, --data  <string>', '5eTools data path');

  program.configureOutput({
    writeOut: str => process.stdout.write(`[OUT] ${str}`),
    writeErr: str => process.stdout.write(`[ERR] ${str}`),
    outputError: (str, write) => write(errorColor(str))
  });

  program.parse();
  const opts = program.opts();

  if (!opts.data) {
    program.error('You need to pass the -d, --data argument.');
    return;
  }

  const rawConfig = fs.readFileSync(opts.config);
  const config = JSON.parse(rawConfig.toString()) as Config;

  const data = DataBuilder(opts.data, config);
  const helpers = HelpersBuilder(config, opts.output);

  // Converters
  const context: Context = { data, helpers, config, output: opts.output };
  await backgroundConverter(context);
  await demoConverter(context);
})();
