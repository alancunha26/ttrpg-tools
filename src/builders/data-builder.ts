import fs from 'fs';
import path from 'path';
import { Config } from '../types';
import { Background, BackgroundFluff } from '../models/background';
import { Entity } from '../models/entity';

export const DataBuilder = (dataPath: string, config: Config) => {
  function readDataFile(file: string) {
    const data = path.resolve(dataPath, file);
    const raw = fs.readFileSync(data);
    return JSON.parse(raw.toString());
  }

  return {
    // Demo
    renderdemo: readDataFile('renderdemo.json').data[0] as Entity,

    // Official Content
    races: {
      items: [],
      fluffs: []
    },
    backgrounds: {
      items: readDataFile('backgrounds.json').background as Background[],
      fluffs: readDataFile('fluff-backgrounds.json').backgroundFluff as BackgroundFluff[]
    }
  };
};
