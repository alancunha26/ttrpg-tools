import { Context } from '../types';
import { EntityBuilder } from '../builders/entity-builder';

export async function demoConverter(context: Context) {
  const buildEntity = EntityBuilder({
    type: 'renderdemo',
    ...context
  });

  const { renderdemo } = context.data;
  const entity = await buildEntity(renderdemo);
  await entity.import();
}
