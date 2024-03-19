import { markdownTable } from 'markdown-table';
import {
  ArrEntry,
  BonusEntry,
  Context,
  CopyEntity,
  Entity,
  Entry,
  FluffEntity,
  ImageEntry,
  InlineBlockEntry,
  InlineEntry,
  InsetEntry,
  ItemEntry,
  LinkEntry,
  ListEntry,
  OptionsEntry,
  QuoteEntry,
  TableCell,
  TableEntry
} from '../types';

function isItemType(value: any): value is ItemEntry {
  const itemType = ['item', 'itemSpell', 'itemSub'] as const;
  return itemType.includes(value.type);
}

function noTitle(value: Entry): boolean {
  const noTitleTypes = ['item', 'itemSpell', 'itemSub', 'inset', 'insetReadaloud'];
  return typeof value === 'string' || !noTitleTypes.includes(value.type);
}

interface State {
  index: number;
  listLevel: number;
  headingLevel: number;
  fluff?: FluffEntity;
  entity?: Entity;
  nowrap?: boolean;
}

const defaultState: State = {
  index: 0,
  listLevel: 0,
  headingLevel: 2
};

export const MarkdownBuilder = (context: Context) => {
  const { options, entities, fluffs } = context;
  const { config, helpers: _ } = options;
  const { imageWidth, identation } = config;
  const tabs = Array(identation).fill(' ').join('');

  function entriesToMarkdown(entries: Entry[], state: State): string {
    let output = '';
    entries?.forEach((entry, index) => (output += entryToMarkdown(entry, { ...state, index })));
    return output;
  }

  function entryToMarkdown(entry: Entry, state: State): string {
    const first = state.index === 0;
    let output = first || state.nowrap ? '' : '\n\n';

    if (typeof entry === 'string') {
      output += textToMarkdown(entry, state);
      return output;
    }

    if ('name' in entry && entry.name && noTitle(entry)) {
      output += `${nameToMarkdown(entry.name, state)}\n\n`;
    }

    if (entry.type === 'list') {
      output += listToMarkdown(entry, { ...state, listLevel: 0 });
    }

    if (entry.type === 'table') {
      output += tableToMarkdown(entry, state);
    }

    if (entry.type === 'quote') {
      output += quoteToMarkdown(entry, state);
    }

    if (entry.type === 'image') {
      output += imageToMarkdown(entry, state);
    }

    if (entry.type === 'inset') {
      output += insetToMarkdown(entry, state);
    }

    if (entry.type === 'link') {
      output += linkToMarkdown(entry, state);
    }

    if (entry.type === 'options') {
      output += optionsToMarkdown(entry, state);
    }

    if (isItemType(entry)) {
      output += itemToMarkdown(entry, state);
    }

    if (entry.type === 'inline' || entry.type === 'inlineBlock') {
      output += inlineToMarkdown(entry, state);
    }

    if (entry.type === 'bonus' || entry.type === 'bonusSpeed') {
      output += bonusToMarkdown(entry, state);
    }

    if (entry.type === 'entries' || entry.type === 'section') {
      output += entriesToMarkdown(entry.entries, { ...state, headingLevel: state.headingLevel + 1 });
    }

    return output;
  }

  function textToMarkdown(text: string, state: State): string {
    // TODO: Write the text parser with links and queries
    return `${text}`;
  }

  function nameToMarkdown(name: string, state: State): string {
    const heading = Array(state.headingLevel).fill('#').join('');
    return `${heading} ${name}`;
  }

  function bonusToMarkdown(bonus: BonusEntry, state: State): string {
    if (bonus.type === 'bonus') {
      return `+${bonus.value}`;
    } else {
      return `+${bonus.value} ft.`;
    }
  }

  function optionsToMarkdown(options: OptionsEntry, state: State): string {
    const entries = _.sortEntries(options.entries);
    return entriesToMarkdown(entries, state);
  }

  function itemToMarkdown(item: ItemEntry, state: State): string {
    const subLevel = state.listLevel + 1;
    const baseSpacing = Array(state.listLevel).fill(tabs).join('');
    const subSpacing = Array(subLevel).fill(tabs).join('');
    const sufix = item.name?.endsWith(':') ? '' : '.';
    let output = state.index === 0 ? '' : baseSpacing;

    if ('name' in item && item.name) {
      if (item.type === 'item') {
        output += `**${item.name}${sufix}** `;
      }

      if (item.type === 'itemSub') {
        output += `*${item.name}${sufix}* `;
      }

      if (item.type === 'itemSpell' && item.name) {
        output += `${item.name}${sufix} `;
      }
    }

    if (item.entry) {
      if (typeof item.entry === 'string') {
        output += textToMarkdown(item.entry, state);
      } else {
        output += entryToMarkdown(item.entry, state);
      }
    }

    if ('entries' in item && item.entries) {
      item.entries.forEach((entry, i) => {
        if (i !== 0) {
          output += `\n${subSpacing}`;
        }

        if (typeof entry === 'string') {
          output += textToMarkdown(entry, state);
        } else {
          output += entryToMarkdown(entry, state);
        }
      });
    }

    return output;
  }

  function listToMarkdown(list: ListEntry, state: State): string {
    const nextState = { ...state };
    let spacing = Array(nextState.listLevel).fill(tabs).join('');
    let prefix = '-';
    let output = '';

    list.items.forEach((item, index) => {
      const first = index === 0;
      const breakline = first ? '' : '\n';
      nextState.index = index;

      if ('style' in list) {
        const start = 'start' in list && list.start ? list.start : 0;
        const number = start ? start + index : index + 1;

        if (list.style === 'list-decimal') {
          prefix = `${number}.`;
        }

        if (list.style === 'list-lower-roman') {
          prefix = `${_.numberToRoman(number)}.`;
        }

        if (list.style === 'list-upper-roman') {
          prefix = `${_.numberToRoman(number, true)}.`;
        }
      }

      const prepend = `${breakline}${spacing}${prefix}`;

      if (typeof item === 'string') {
        output += `${prepend} ${textToMarkdown(item, nextState)}`;
        return;
      }

      if (isItemType(item)) {
        output += `${prepend} ${itemToMarkdown(item, nextState)}`;
        return;
      }

      if (item.type === 'list') {
        nextState.listLevel += 1;
        output += `\n${listToMarkdown(item, nextState)}`;
        return;
      }

      output += entryToMarkdown(item, nextState);
    });

    return output;
  }

  function tableCellToMarkdown(cell: TableCell, state: State): string {
    // console.log('tableCellToMarkdow', cell);
    if (typeof cell === 'string') return textToMarkdown(cell, state);
    return '';
  }

  function tableToMarkdown(table: TableEntry, state: State): string {
    let array: string[][] = [];

    if (table.colLabelGroups && table.colLabelGroups.length) {
      const bigger = table.colLabelGroups
        .slice()
        .sort((a, b) => (b.colLabels?.length || -1) - (a.colLabels?.length || -1))[0];

      const groups = table.colLabelGroups.map(o => {
        const length = (bigger.colLabels?.length || 0) - (o.colLabels?.length || 0);
        const fill = Array(length).fill('') as string[];
        return [...fill, ...(o.colLabels || [])];
      });

      for (let index = 0; index < groups.length; index += 1) {
        const group = groups[index];
        for (let i = 0; i < group.length; i += 1) {
          const col = group[i];
          if (!array[i]) {
            array[i] = [col];
          } else {
            array[i][index] = col;
          }
        }
      }
    }

    if (table.colLabels) {
      array.push(table.colLabels);
    }

    const rows = table.rows.map(row => {
      if (Array.isArray(row)) {
        return row.map(cell => tableCellToMarkdown(cell, state));
      }

      if (Array.isArray(row.row)) {
        return row.row.map(cell => tableCellToMarkdown(cell, state));
      }

      return [tableCellToMarkdown(row.row, state)];
    });

    array.push(...rows);
    let output = '';

    if (table.caption) {
      console.log('table.caption', table.caption);
      output += `**${table.caption}**\n\n`;
    }

    output += markdownTable(array);
    return output;
  }

  function imageToMarkdown(image: ImageEntry, state: State): string {
    const { entity, fluff } = state;
    const baseUrl = 'https://5e.tools/img';
    const url = `${baseUrl}/${image.href.path}`;
    const title = image.title || entity?.name || fluff?.name;
    return `![${title}|${imageWidth}](${url})`;
  }

  function quoteToMarkdown(quote: QuoteEntry, state: State): string {
    let output = '';

    quote.entries.forEach((entry, index) => {
      state.index = index;
      const start = index === 0 ? '' : '> \n';
      const end = index === quote.entries.length - 1 ? '' : '\n';
      output += `${start}> ${textToMarkdown(entry, { ...state, index })}${end}`;
    });

    if (quote.by) {
      output += `\n\n— ${quote.by}`;
      if (quote.from) output += `, ${quote.from}`;
    }

    return output;
  }

  function insetToMarkdown(inset: InsetEntry, state: State): string {
    const calloutType = inset.type === 'inset' ? 'INFO' : 'QUOTE';
    let output = `> [!${calloutType}] ${inset.name}\n`;
    output += entriesToMarkdown(inset.entries, state).replace(/^/gm, '> ');
    return output;
  }

  function inlineToMarkdown(inline: InlineEntry | InlineBlockEntry, state: State): string {
    return entriesToMarkdown(inline.entries, {
      ...state,
      nowrap: true
    });
  }

  function linkToMarkdown(link: LinkEntry, state: State): string {
    const url = link.href.type === 'external' ? link.href.url : link.href.path;
    return `[${link.text}](${url})`;
  }

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

  function copyToMarkdown(copy: CopyEntity, state: State, fluff?: boolean): string {
    const findEntity = (e: Entity | FluffEntity) => e.name === copy.name;
    const original = fluff ? fluffs.find(findEntity) : entities.find(findEntity);

    if (!original || !original.entries) {
      return '';
    }

    if (!copy._mod || !copy._mod.entries) {
      return entriesToMarkdown(original.entries, state);
    }

    let entries: Entry[] = original.entries || [];

    if (Array.isArray(copy._mod.entries)) {
      copy._mod.entries.forEach(arrEntry => (entries = mapCopyArrEntries(arrEntry, entries)));
    } else {
      entries = mapCopyArrEntries(copy._mod.entries, entries);
    }

    return entriesToMarkdown(entries, state);
  }

  function fluffImagesToMarkdown(images: FluffEntity['images'], state: State): string {
    let output = '';

    if (Array.isArray(images)) {
      images.forEach(img => (output += imageToMarkdown(img, state)));
    } else if (images?.item) {
      output += imageToMarkdown(images.item, state);
    }

    return output;
  }

  function fluffToMarkdown(fluff: FluffEntity, state: State): string {
    let output = '';

    if (fluff.images) {
      output += fluffImagesToMarkdown(fluff.images, state);
    }

    if (fluff.entries) {
      output += entriesToMarkdown(fluff.entries, state);
    }

    if (fluff._copy) {
      output += copyToMarkdown(fluff._copy, state, true);
    }

    return output;
  }

  return function entityToMarkdown(entity: Entity, fluff?: FluffEntity): string {
    const state: State = { ...defaultState, entity, fluff: fluff };
    let output = '';

    if (fluff) {
      output += fluffToMarkdown(fluff, state);
    }

    if (entity.entries) {
      output += entriesToMarkdown(entity.entries, state);
    }

    if (entity._copy) {
      output += copyToMarkdown(entity._copy, state);
    }

    // if (entity.name === 'Variant Entertainer (Gladiator)') {
    //   console.log(entity.name, output);
    // }

    return output;
  };
};
