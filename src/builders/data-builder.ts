import fs from 'fs';
import path from 'path';
import { ArrEntry, BackgroundEntity, Config, CopyEntity, Entity, Entry, FluffEntity } from '../types';

export const DataBuilder = (dataPath: string, config: Config) => {
  const { sources } = config;
  console.log('DataBuilder', sources, dataPath);

  /**
   * ENTRIES MERGE
   */

  function mapCopyArrEntries(arr: ArrEntry, prev: Entry[]): Entry[] {
    let entries = prev.slice();

    if (arr.mode === 'prependArr') {
      const prepend = Array.isArray(arr.items) ? arr.items : [arr.items];
      entries.unshift(...prepend);
    }

    if (arr.mode === 'insertArr') {
      const insert = Array.isArray(arr.items) ? arr.items : [arr.items];
      entries = [...entries.slice(0, arr.index), ...insert, ...entries.slice(arr.index)];
    }

    if (arr.mode === 'replaceArr') {
      const replace = Array.isArray(arr.items) ? arr.items : [arr.items];
      let replaceIndex = 0;

      if (typeof arr.replace === 'string') {
        const replaceName = arr.replace;
        const index = entries.findIndex(o => {
          if (typeof o === 'string') return o === replaceName;
          if (o.type === 'image') return o.title === replaceName;
          if ('name' in o && o.name) return o.name === replaceName;
          return false;
        });

        replaceIndex = Math.max(0, index);
      } else {
        replaceIndex = arr.replace.index;
      }

      entries = entries.reduce<Entry[]>((prev, curr, index) => {
        if (index === replaceIndex) {
          return index === replaceIndex ? [...prev, ...replace] : [...prev, curr];
        } else {
          return [...prev, curr];
        }
      }, []);
    }

    return entries;
  }

  function copyEntries(copy: CopyEntity, original: Entity | FluffEntity): Entry[] {
    if (!original.entries) {
      return [];
    }

    let entries: Entry[] = original.entries || [];

    if (!copy._mod || !copy._mod.entries) {
      return entries;
    }

    if (Array.isArray(copy._mod.entries)) {
      copy._mod.entries.forEach(arrEntry => (entries = mapCopyArrEntries(arrEntry, entries)));
    } else {
      entries = mapCopyArrEntries(copy._mod.entries, entries);
    }

    return entries;
  }

  function mergeEntityEntries<T extends Entity>(entities: Entity[], fluffs?: FluffEntity[]): T[] {
    return entities.map(entity => {
      const fluff = fluffs?.find(fluff => entity.name === fluff.name && entity.source === fluff.source);
      let fluffEntries: Entry[] = [];
      let entityEntries: Entry[] = [];

      if (fluff?.entries) {
        fluffEntries.push(...fluff.entries);
      }

      if (fluff?._copy) {
        const original = fluffs?.find(f => f.name === fluff._copy?.name);
        if (original) fluffEntries.push(...copyEntries(fluff._copy, original));
      }

      if (entity.entries) {
        entityEntries.push(...entity.entries);
      }

      if (entity._copy) {
        const original = entities.find(e => e.name === entity._copy?.name);
        if (original) entityEntries.push(...copyEntries(entity._copy, original));
      }

      let entries: Entry[] = [];

      // Add the fluff images to the start of the body
      if (fluff?.images) {
        if (Array.isArray(fluff.images)) {
          entries.push(...fluff.images);
        } else {
          entries.push(fluff.images.item);
        }
      }

      // Add the mechanics fluffs entries first and then the mechanics
      entries.push(...fluffEntries, ...entityEntries);
      return { ...entity, entries } as T;
    });
  }

  /**
   * UTILS
   */

  function readDataFile(path: string) {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw.toString());
  }

  function bySources(entity: Entity | FluffEntity): boolean {
    return sources.includes(entity.source);
  }

  /**
   * LOADERS
   */

  function loadRenderDemo() {
    const demoPath = path.resolve(dataPath, 'renderdemo.json');
    return readDataFile(demoPath).data as Entity[];
  }

  function loadBackgrounds(): BackgroundEntity[] {
    const bgPath = path.resolve(dataPath, 'backgrounds.json');
    const fluffPath = path.resolve(dataPath, 'fluff-backgrounds.json');

    const entities = (readDataFile(bgPath).background as BackgroundEntity[]).filter(bySources);
    const fluffs = (readDataFile(fluffPath).backgroundFluff as FluffEntity[]).filter(bySources);

    return mergeEntityEntries<BackgroundEntity>(entities, fluffs);
  }

  return {
    renderdemo: loadRenderDemo(),
    backgrounds: loadBackgrounds()
  };
};
