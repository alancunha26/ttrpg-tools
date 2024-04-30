import fs from 'fs';
import path from 'path';
import { Config } from '../types';
import { Background } from '../models/background';
import { Entity } from '../models/entity';
import { RacesFile } from '../models/race';
import { ClassFile } from '../models/classe';
import { Fluff } from '../models/fluff';
import { ItemsBaseFile, ItemsFile } from '../models/item';

export const DataBuilder = (dataPath: string, config: Config) => {
  function readDataFile(file: string) {
    const data = path.resolve(dataPath, file);
    const raw = fs.readFileSync(data);
    return JSON.parse(raw.toString());
  }

  // Background
  const backgrounds = readDataFile('backgrounds.json').background as Background[];
  const fluffBackgrounds = readDataFile('fluff-backgrounds.json').backgroundFluff as Fluff[];

  // Races
  const races = readDataFile('races.json') as RacesFile;
  const fluffRaces = readDataFile('fluff-races.json').raceFluff as Fluff[];

  // Items
  const baseItems = readDataFile('items-base.json') as ItemsBaseFile;
  const fluffItems = readDataFile('fluff-items.json').itemFluff as Fluff[];
  const items = readDataFile('items.json') as ItemsFile;

  // Classes
  const classes: ClassFile = (
    [
      readDataFile('class/class-artificer.json'),
      readDataFile('class/class-barbarian.json'),
      readDataFile('class/class-bard.json'),
      readDataFile('class/class-cleric.json'),
      readDataFile('class/class-druid.json'),
      readDataFile('class/class-fighter.json'),
      readDataFile('class/class-monk.json'),
      readDataFile('class/class-mystic.json'),
      readDataFile('class/class-paladin.json'),
      readDataFile('class/class-ranger.json'),
      readDataFile('class/class-rogue.json'),
      readDataFile('class/class-sorcerer.json'),
      readDataFile('class/class-warlock.json'),
      readDataFile('class/class-wizard.json')
    ] as ClassFile[]
  ).reduce((prev: ClassFile, curr: ClassFile) => ({
    class: [...prev.class, ...curr.class],
    subclass: [...prev.subclass, ...curr.subclass],
    classFeature: [...prev.classFeature, ...curr.classFeature],
    subclassFeature: [...prev.subclassFeature, ...curr.subclassFeature]
  }));

  return {
    // Demo
    renderdemo: readDataFile('renderdemo.json').data[0] as Entity,

    // Official Content
    races: {
      races: races.race,
      subraces: races.subrace,
      fluffs: fluffRaces
    },
    classes: {
      classes: classes.class,
      subclasses: classes.subclass,
      classFeatures: classes.classFeature,
      subclassFeatures: classes.subclassFeature
    },
    backgrounds: {
      backgrounds: backgrounds,
      fluffs: fluffBackgrounds
    },
    items: {
      baseItems: baseItems.baseitem,
      properties: baseItems.itemProperty,
      types: baseItems.itemType,
      typesEntries: baseItems.itemTypeAdditionalEntries,
      itemsEntries: baseItems.itemEntry,
      groups: items.itemGroup,
      items: items.item,
      flufs: fluffItems
    }
  };
};
