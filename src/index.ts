import fs from 'fs';
import Handlebars from 'handlebars';
import { Config } from './types';

const ENTITIES = [
  'monsters',
  'classes',
  'subclasses',
  'races',
  'subraces',
  'variants',
  'equipment',
  'magic-items',
  'spells',
  'backgrounds',
  'transports',
  'rewards',
  'feats',
  'traps',
  'psionics',
  'optional-features'
] as const;

function getData(entity: keyof typeof ENTITIES): Object[] {
  return [{}];
}

async function main() {
  const rawdata = fs.readFileSync(`${process.cwd()}/config.json`);
  const config = JSON.parse(rawdata.toString()) as Config;
  const entities = ENTITIES.filter(entity => !(config.exclude || []).includes(entity));

  entities.forEach(entity => {
    const templatePath = `${process.cwd()}/${config.templates[entity]}`;
    const templateRaw = fs.readFileSync(templatePath);
    const template = Handlebars.compile(templateRaw.toString(), { noEscape: true });
    const output = `${process.cwd()}/${config.outputs[entity]}`;
    let data: Object[] = [];

    if (entity === 'backgrounds') {
      const backgroundsPath = `${process.cwd()}/src/data/backgrounds.json`;
      const backgroundsRawData = fs.readFileSync(backgroundsPath);
      const backgroundsData = JSON.parse(backgroundsRawData.toString());
      data = backgroundsData.background;
    }

    console.log('data', data);

    // data.forEach(data => {
    //   const helpers = {};
    //   const content = template(data, { helpers });
    //   fs.writeFileSync()
    // });h
  });
}

main();
