import { Context } from '../types';
import { EntityBuilder } from '../builders/entity-builder';
import { Entity } from '../models/entity';

export async function backgroundConverter(context: Context) {
  const { data, config, helpers: _ } = context;
  const { backgrounds } = data;
  const { sources } = config;

  const buildEntity = EntityBuilder({
    type: 'backgrounds',
    ...context
  });

  for (const background of backgrounds.backgrounds.filter(b => sources.includes(b.source))) {
    // Import entity data with extra data
    const { name, source, page, srd } = background;
    const fluff = backgrounds.fluffs.find(f => f.name === name && f.source === source);

    let imageEntries = [];
    let fluffEntries = fluff?.entries || [];
    let defaultEntries = background.entries || [];

    if (fluff?._copy) {
      const original = backgrounds.fluffs?.find(f => f.name === fluff._copy?.name);
      if (original?.entries) fluffEntries.push(..._.copyEntries(fluff._copy, original.entries));
    }

    if (background._copy) {
      const original = backgrounds.backgrounds.find(e => e.name === background._copy?.name);
      if (original?.entries) defaultEntries.push(..._.copyEntries(background._copy, original.entries));
    }

    // Add the fluff images to the start of the body
    if (fluff?.images) {
      if (Array.isArray(fluff.images)) {
        imageEntries.push(...fluff.images);
      } else {
        imageEntries.push(fluff.images.item);
      }
    }

    const entity: Entity = {
      name,
      source,
      page,
      srd: Boolean(srd),
      type: 'backgrounds',
      entries: [...imageEntries, ...fluffEntries, ...defaultEntries]
    };

    const importer = await buildEntity(entity);
    await importer.import();
  }
}
