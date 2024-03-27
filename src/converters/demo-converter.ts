import { Context } from '../types';
import { EntityBuilder } from '../builders/entity-builder';

export async function demoConverter(context: Context) {
  const buildEntity = EntityBuilder({
    type: 'renderdemo',
    ...context
  });

  for (const demo of context.data.renderdemo) {
    const entity = await buildEntity(demo);
    // const allTypes = _.findAllEntryTypes(demo.entries);
    // console.log('allTypes', allTypes);
    await entity.import();
  }
}
