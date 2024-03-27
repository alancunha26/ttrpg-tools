import fs from 'fs';
import path from 'path';
import { ArrEntry, BackgroundEntity, ClassFile, Config, CopyEntity, Entity, Entry, FluffEntity } from '../types';

export const DataBuilder = (dataPath: string, config: Config) => {
  const { sources } = config;

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

  function readDataFile(file: string) {
    const data = path.resolve(dataPath, file);
    const raw = fs.readFileSync(data);
    return JSON.parse(raw.toString());
  }

  function bySources(entity: Entity | FluffEntity): boolean {
    return sources.includes(entity.source);
  }

  /**
   * LOADERS
   */

  function loadBackgrounds(): BackgroundEntity[] {
    const file = readDataFile('backgrounds.json');
    const fluffFile = readDataFile('fluff-backgrounds.json');

    const entities = (file.background as BackgroundEntity[]).filter(bySources);
    const fluffs = (fluffFile.backgroundFluff as FluffEntity[]).filter(bySources);

    return mergeEntityEntries<BackgroundEntity>(entities, fluffs);
  }

  function loadClasses(): ClassFile {
    const artificer = readDataFile('class/class-artificer.json') as ClassFile;
    const barbarian = readDataFile('class/class-barbarian.json') as ClassFile;
    const bard = readDataFile('class/class-bard.json') as ClassFile;
    const cleric = readDataFile('class/class-cleric.json') as ClassFile;
    const druid = readDataFile('class/class-druid.json') as ClassFile;
    const fighter = readDataFile('class/class-fighter.json') as ClassFile;
    const monk = readDataFile('class/class-monk.json') as ClassFile;
    const mystic = readDataFile('class/class-mystic.json') as ClassFile;
    const paladin = readDataFile('class/class-paladin.json') as ClassFile;
    const ranger = readDataFile('class/class-ranger.json') as ClassFile;
    const rogue = readDataFile('class/class-rogue.json') as ClassFile;
    const sorcerer = readDataFile('class/class-sorcerer.json') as ClassFile;
    const warlock = readDataFile('class/class-warlock.json') as ClassFile;
    const wizard = readDataFile('class/class-wizard.json') as ClassFile;

    const classes = [
      artificer,
      barbarian,
      bard,
      cleric,
      druid,
      fighter,
      monk,
      mystic,
      paladin,
      ranger,
      rogue,
      sorcerer,
      warlock,
      wizard
    ];

    const data: ClassFile = {
      class: [],
      subclass: [],
      classFeature: [],
      subclassFeature: []
    };

    return classes.reduce(
      (prev, curr) => ({
        class: [...prev.class, ...curr.class.filter(bySources)],
        subclass: [...prev.subclass, ...curr.subclass.filter(bySources)],
        classFeature: [...prev.classFeature, ...curr.classFeature.filter(bySources)],
        subclassFeature: [...prev.subclassFeature, ...curr.subclassFeature.filter(bySources)]
      }),
      data
    );
  }

  const renderdemo = readDataFile('renderdemo.json').data as Entity[];
  const backgrounds = loadBackgrounds();
  const classes = loadClasses();

  return {
    renderdemo,
    backgrounds,
    classes: classes.class,
    subclasses: classes.subclass,
    classFeatures: classes.classFeature,
    subclassFeatures: classes.subclassFeature
  };
};
