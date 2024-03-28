import path from 'path';
import { ATTRIBUTES, AttributeCode } from './models/attribute';
import { AbbreviationCopy, Config, Copy } from './types';
import { EntityType } from './models/entity';
import { ArrEntry, Entry } from './models/entry';

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

//
// function mergeEntityEntries<T extends Entity>(entities: Entity[], fluffs?: FluffEntity[]): T[] {
//   return entities.map(entity => {
//     const fluff = fluffs?.find(fluff => entity.name === fluff.name && entity.source === fluff.source);
//     let fluffEntries: Entry[] = [];
//     let entityEntries: Entry[] = [];
//
//     if (fluff?.entries) {
//       fluffEntries.push(...fluff.entries);
//     }
//
//     if (fluff?._copy) {
//       const original = fluffs?.find(f => f.name === fluff._copy?.name);
//       if (original) fluffEntries.push(...copyEntries(fluff._copy, original));
//     }
//
//     if (entity.entries) {
//       entityEntries.push(...entity.entries);
//     }
//
//     if (entity._copy) {
//       const original = entities.find(e => e.name === entity._copy?.name);
//       if (original) entityEntries.push(...copyEntries(entity._copy, original));
//     }
//
//     let entries: Entry[] = [];
//
//     // Add the fluff images to the start of the body
//     if (fluff?.images) {
//       if (Array.isArray(fluff.images)) {
//         entries.push(...fluff.images);
//       } else {
//         entries.push(fluff.images.item);
//       }
//     }
//
//     // Add the mechanics fluffs entries first and then the mechanics
//     entries.push(...fluffEntries, ...entityEntries);
//     return { ...entity, entries } as T;
//   });
// }

export const helpers = (config: Config, output: string) => {
  const { linkStyle, paths } = config;

  function copyEntries(copy: Copy | AbbreviationCopy, entries: Entry[]): Entry[] {
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
    getFilePath,
    getVaultLink,
    getDirPath,
    numberToRoman,
    sortEntries,
    nameToTitle,
    getAttrName,
    copyEntries,

    handlebars: {
      link: getVaultLink,
      log: console.log
    }
  };
};
