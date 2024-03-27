import { Context } from '../types';
import { EntityBuilder } from '../builders/entity-builder';

export async function backgroundConverter(context: Context) {
  const buildEntity = EntityBuilder({
    type: 'backgrounds',
    ...context
  });

  for (const background of context.data.backgrounds) {
    // Import entity data with extra data
    const entity = await buildEntity(background);
    await entity.import();
  }
}
