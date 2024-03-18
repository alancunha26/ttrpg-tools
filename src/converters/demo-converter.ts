import { resolve } from 'path';
import { Entity, Options } from '../types';
import { EntityBuilder } from '../builders/entity-builder';

export async function demoConverter(dataPath: string, options: Options) {
  const { helpers: _ } = options;

  const path = resolve(dataPath, 'renderdemo.json');
  const entities = _.readJsonFile(path).data as Entity[];

  const buildEntity = EntityBuilder({
    options,
    entities,
    fluffs: [],
    type: 'renderdemo'
  });

  for (const demo of entities) {
    const entity = await buildEntity(demo);
    // const allTypes = _.findAllEntryTypes(demo.entries);
    // console.log('allTypes', allTypes);
    await entity.import();
  }
}
