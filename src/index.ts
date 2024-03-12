import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { Config } from './types';

function errorColor(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

(async function main() {
  const DEFAULT_CONFIG = path.join(process.cwd(), 'example/config.json');
  const DEFAULT_OUTPUT = path.join(process.cwd(), 'output');
  const program = new Command();

  program
    .name('5e-tools-converter')
    .description('A CLI that converts content from 5eTools to Markdown')
    .version('0.0.1');

  program
    .option('-c, --config', 'Config file path', DEFAULT_CONFIG)
    .option('-o, --output', 'Output directory', DEFAULT_OUTPUT)
    .option('-d, --data', '5eTools data path');

  program.configureOutput({
    writeOut: str => process.stdout.write(`[OUT] ${str}`),
    writeErr: str => process.stdout.write(`[ERR] ${str}`),
    outputError: (str, write) => write(errorColor(str))
  });

  program.parse();
  const options = program.opts();

  if (!options.data) {
    program.error('You need to pass the -d, --data argument.');
    return;
  }

  const rawConfig = fs.readFileSync(options.config);
  const config = JSON.parse(rawConfig.toString()) as Config;
  console.log('config', config);
})();
