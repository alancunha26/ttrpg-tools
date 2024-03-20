import fs from 'fs';
import path from 'path';
import { Config, Entity, FluffEntity, EntityType, Entry, ShortAttribute } from './types';

export const helpers = (config: Config, output: string) => {
  const { sources, linkStyle, paths } = config;

  function findAllEntryTypes(entries?: any[], types: string[] = []) {
    let append: string[] = [];

    entries?.forEach(entry => {
      if (typeof entry === 'string') {
        if (!types.includes('string')) types.push('string');
        return;
      }

      if (!types.includes(entry.type)) {
        types.push(entry.type);
      }

      if (entry.entries) {
        append.push(...findAllEntryTypes(entry.entries));
        return;
      }

      if (entry.items) {
        append.push(...findAllEntryTypes(entry.items));
        return;
      }
    });

    append.forEach(type => {
      if (!types.includes(type)) {
        types.push(type);
      }
    });

    return types;
  }

  function findFluff(entity: Entity, fluffEntities: FluffEntity[]) {
    return fluffEntities.find(fluff => entity.name === fluff.name && entity.source === fluff.source);
  }

  function filterBySources(entities: Entity[]) {
    return entities.filter(entity => sources.includes(entity.source));
  }

  function readJsonFile(path: string) {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw.toString());
  }

  function convertToValidFilename(text: string): string {
    return text.replace(/[\/|\\:*?"<>]/g, ' ');
  }

  function getVaultPath(name: string, type: EntityType): string {
    const title = convertToValidFilename(name);
    return path.join(paths[type], title);
  }

  function getFilePath(name: string, type: EntityType): string {
    const title = convertToValidFilename(name);
    return path.resolve(process.cwd(), output, paths[type], `${title}.md`);
  }

  function getDirPath(type: EntityType): string {
    return path.resolve(process.cwd(), output, paths[type]);
  }

  function formatLink(name: string, type: EntityType): string {
    const vaultPath = getVaultPath(name, type);
    return linkStyle === 'wikilink' ? `[[${vaultPath}]]` : `[${name}](/${vaultPath}.md)`;
  }

  function getAttrName(attr: ShortAttribute): string {
    if (attr === 'str') {
      return 'Strength';
    }

    if (attr === 'con') {
      return 'Constitution';
    }

    if (attr === 'dex') {
      return 'Dexterity';
    }

    if (attr === 'int') {
      return 'Intelligence';
    }

    if (attr === 'cha') {
      return 'Charisma';
    }

    if (attr === 'wis') {
      return 'Wisdom';
    }

    return attr;
  }

  function numberToRoman(num: number, upper?: boolean): string {
    let string = '';
    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    } as const;

    Object.keys(roman).forEach(key => {
      const k = key as keyof typeof roman;
      const q = Math.floor(num / roman[k]);
      num -= q * roman[k];
      string += key.repeat(q);
    });

    if (upper) {
      return string;
    }

    return string.toLowerCase();
  }

  function sortEntries(entries: Entry[]): Entry[] {
    return entries.sort((a, b) => {
      let toSortA = '';
      let toSortB = '';

      if (typeof a === 'string') toSortA = `${a}`;
      if (typeof a !== 'string' && 'name' in a && a.name) toSortA = `${a.name}`;

      if (typeof b === 'string') toSortB = `${b}`;
      if (typeof b !== 'string' && 'name' in b && b.name) toSortB = `${b.name}`;

      return toSortA.toLowerCase() > toSortB.toLowerCase() ? 1 : -1;
    });
  }

  return {
    findAllEntryTypes,
    findFluff,
    filterBySources,
    readJsonFile,
    getVaultPath,
    getFilePath,
    formatLink,
    getDirPath,
    numberToRoman,
    sortEntries,
    convertToValidFilename,
    getAttrName,

    handlebars: {
      formatLink
    }
  };
};
