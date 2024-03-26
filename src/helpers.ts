import fs from 'fs';
import path from 'path';
import { Config, Entity, FluffEntity, EntityType, Entry, AttributeCode, SourceCode, SkillCode } from './types';
import { ATTRIBUTES } from './models/attributes';
import { SOURCES } from './models/sources';
import { SKILLS } from './models/skills';

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

  function nameToTitle(name: string): string {
    const connectors = [
      'a',
      'an',
      'the',
      'of',
      'for',
      'and',
      'but',
      'or',
      'nor',
      'on',
      'at',
      'to',
      'by',
      'with',
      'as',
      'in'
    ];

    const words = name
      .replace(/[\/|\\:*?"<>]/g, ' ')
      .toLowerCase()
      .split(' ');

    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    for (let i = 1; i < words.length; i++) {
      if (!connectors.includes(words[i])) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      }
    }

    return words.join(' ');
  }

  function convertToSnakeCase(text: string): string {
    return text.replace(/\s+/g, '_').toLowerCase();
  }

  function getDirPath(type: EntityType): string {
    return path.resolve(process.cwd(), output, paths[type]);
  }

  function getFilePath(name: string, type: EntityType): string {
    const title = nameToTitle(name);
    return path.resolve(process.cwd(), output, paths[type], `${title}.md`);
  }

  function getVaultLink(name: string, type: EntityType, alias?: string, section?: string): string {
    let title = nameToTitle(name);
    let vaultPath = path.join(paths[type], title);

    if (section) {
      vaultPath += linkStyle === 'wikilink' ? `#${nameToTitle(section)}` : `#${convertToSnakeCase(section)}`;
    }

    const aliases = alias || section || name;
    return linkStyle === 'wikilink' ? `[[${vaultPath}|${aliases}]]` : `[${aliases}](/${vaultPath}.md)`;
  }

  function getAttrName(attr: AttributeCode): string {
    return ATTRIBUTES.find(a => a.code === attr)!.name;
  }

  function getSkillName(skill: SkillCode): string {
    return SKILLS.find(s => s.code === skill)!.name;
  }

  function getSourceName(source: SourceCode): string {
    return SOURCES.find(s => s.code === source)!.name;
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
    getFilePath,
    getVaultLink,
    getDirPath,
    numberToRoman,
    sortEntries,
    nameToTitle,
    getAttrName,
    getSourceName,
    getSkillName,

    handlebars: {
      link: getVaultLink
    }
  };
};
