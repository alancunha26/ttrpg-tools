import fs from 'fs';

interface Entities {
  monsters?: string;
  classes?: string;
  subclasses?: string;
  races?: string;
  variants?: string;
  equipment?: string;
  'magic-items'?: string;
  spells?: string;
  backgrounds?: string;
  transports?: string;
  rewards?: string;
  feats?: string;
  objects?: string;
  traps?: string;
}

interface Config {
  data: string;
  linkStyle: string;
  sources: string[];
  exclude: string[];
  outputs: Entities;
  templates: Entities;
}

async function main() {
  const rawdata = fs.readFileSync(`${__dirname}/../config.json`);
  const config = JSON.parse(rawdata.toString()) as Config;

  Object.keys(config.templates).forEach(entity => {
    // const output = config.outputs[entity];
    // console.log('output', output);
  });
}

// Runs the converter
main();
