import { resolve } from 'path';
import { BackgroundEntity, FluffEntity, Options } from '../types';
import { EntityBuilder } from '../builders/entity-builder';

export async function backgroundConverter(dataPath: string, options: Options) {
  const { helpers: _ } = options;

  const path = resolve(dataPath, 'backgrounds.json');
  const fluffPath = resolve(dataPath, 'fluff-backgrounds.json');
  const backgrounds = _.readJsonFile(path).background as BackgroundEntity[];
  const backgroundsFluff = _.readJsonFile(fluffPath).backgroundFluff as FluffEntity[];

  const buildEntity = EntityBuilder({
    options,
    fluffs: backgroundsFluff,
    entities: backgrounds,
    type: 'backgrounds'
  });

  for (const background of _.filterBySources(backgrounds)) {
    // Import entity data with extra data
    const entity = await buildEntity(background);
    await entity.import();
  }
}
