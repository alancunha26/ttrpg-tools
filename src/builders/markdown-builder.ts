import { markdownTable } from 'markdown-table';
import {
  AbilityAttackModEntry,
  AbilityDcEntry,
  AbilityGenericEntry,
  ArrEntry,
  BonusEntry,
  Context,
  CopyEntity,
  DiceEntry,
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
  OptFeatureEntry,
  OptionsEntry,
  QuoteEntry,
  TableCell,
  TableEntry,
  VariantEntry
} from '../types';

function isItemType(value: any): value is ItemEntry {
  const itemType = ['item', 'itemSpell', 'itemSub'] as const;
  return itemType.includes(value.type);
}

function hasTitle(value: Entry): boolean {
  const noTitleTypes = [
    'item',
    'itemSpell',
    'itemSub',
    'inset',
    'insetReadaloud',
    'abilityDc',
    'abilityAttackMod',
    'abilityGeneric',
    'variant',
    'variantSub'
  ];

  return typeof value === 'string' || !noTitleTypes.includes(value.type);
}

interface State {
  index: number;
  listLevel: number;
  headingLevel: number;
  fluff?: FluffEntity;
  entity?: Entity;
  nowrap?: boolean;
  notitle?: boolean;
}

const defaultState: State = {
  index: 0,
  listLevel: 0,
  headingLevel: 2
};

export const MarkdownBuilder = (context: Context) => {
  const { options, entities, fluffs } = context;
  const { config, helpers: _ } = options;
  const { imageWidth, identation, alwaysIncreaseHeadingLevel } = config;
  const tabs = Array(identation).fill(' ').join('');

  function entriesToMarkdown(entries: Entry[], state: State): string {
    let output = '';
    entries?.forEach((entry, index) => (output += entryToMarkdown(entry, { ...state, index })));
    return output;
  }

  function entryToMarkdown(entry: Entry, state: State): string {
    const first = state.index === 0;
    let output = first || state.nowrap ? '' : '\n\n';
    let nextState = { ...state };

    if (typeof entry === 'string') {
      output += textToMarkdown(entry, state);
      return output;
    }

    // The original parser from 5eTools increases the heading level even if there's no name
    // to write on the body, here instead I prefer to ignore this and keep heading levels
    // that make sense by default, to disable this functionality pass
    // `awaysIncreaseHeadingLevel` as true in the config file.
    if ('name' in entry && entry.name && hasTitle(entry) && !state.notitle) {
      output += `${nameToMarkdown(entry.name, nextState)}\n\n`;
      if (!alwaysIncreaseHeadingLevel) nextState.headingLevel += 1;
    }

    if (hasTitle(entry) && alwaysIncreaseHeadingLevel) {
      nextState.headingLevel += 1;
    }

    if (entry.type === 'list') {
      nextState.listLevel = 0;
      output += listToMarkdown(entry, nextState);
    }

    if (entry.type === 'table') {
      output += tableToMarkdown(entry, nextState);
    }

    if (entry.type === 'quote') {
      output += quoteToMarkdown(entry, nextState);
    }

    if (entry.type === 'image') {
      output += imageToMarkdown(entry, nextState);
    }

    if (entry.type === 'link') {
      output += linkToMarkdown(entry, nextState);
    }

    if (entry.type === 'options') {
      output += optionsToMarkdown(entry, nextState);
    }

    if (entry.type === 'dice') {
      output += diceToMarkdown(entry, nextState);
    }

    if (entry.type === 'abilityDc') {
      output += abilityDcToMarkdown(entry, nextState);
    }

    if (entry.type === 'abilityAttackMod') {
      output += abilityAttackModToMarkdown(entry, nextState);
    }

    if (entry.type === 'abilityGeneric') {
      output += abilityGenericToMarkdown(entry, nextState);
    }

    if (entry.type === 'optfeature') {
      output += optFeatureToMarkdown(entry, nextState);
    }

    if (isItemType(entry)) {
      output += itemToMarkdown(entry, nextState);
    }

    if (entry.type === 'inset' || entry.type === 'insetReadaloud') {
      output += insetToMarkdown(entry, nextState);
    }

    if (entry.type === 'variant' || entry.type === 'variantSub') {
      output += variantToMarkdown(entry, nextState);
    }

    if (entry.type === 'inline' || entry.type === 'inlineBlock') {
      output += inlineToMarkdown(entry, nextState);
    }

    if (entry.type === 'bonus' || entry.type === 'bonusSpeed') {
      output += bonusToMarkdown(entry, nextState);
    }

    if (entry.type === 'entries' || entry.type === 'section') {
      output += entriesToMarkdown(entry.entries, nextState);
    }

    if (entry.type === 'statblock' || entry.type === 'statblockInline') {
      return '';
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

      if (typeof item !== 'string' && item.type === 'list') {
        nextState.listLevel += 1;
        output += `\n${listToMarkdown(item, nextState)}`;
        return;
      }

      const prepend = `${breakline}${spacing}${prefix}`;
      output += `${prepend} ${entryToMarkdown(item, {
        ...nextState,
        notitle: true,
        nowrap: true
      })}`;
    });

    return output;
  }

  function diceToMarkdown(dice: DiceEntry, state: State): string {
    let output = '';

    dice.toRoll.forEach((roll, index) => {
      const prefix = index !== 0 ? '+' : '';
      const number = roll.number >= 1 ? roll.number : 1;
      const sufix = roll.modifier && !roll.hideModifier ? `+${roll.modifier}` : '';
      output += `${prefix}${number}d${roll.faces}${sufix}`;
    });

    return output;
  }

  function abilityDcToMarkdown(ability: AbilityDcEntry, state: State): string {
    let output = `**${ability.name} save DC** = 8 + your proficiency bonus + your `;

    ability.attributes.forEach((attr, index) => {
      const prefix = index !== 0 ? ' or ' : '';
      output += `${prefix}${_.getAttrName(attr)}`;
    });

    output += ' modifier';

    if (ability.attributes.length > 1) {
      output += ' (your choice)';
    }

    return output;
  }

  function abilityAttackModToMarkdown(attack: AbilityAttackModEntry, state: State): string {
    let output = `**${attack.name} attack modifier** = your proficiency bonus + your `;

    attack.attributes.forEach((attr, index) => {
      const prefix = index !== 0 ? ' or ' : '';
      output += `${prefix}${_.getAttrName(attr)}`;
    });

    output += ' modifier';

    if (attack.attributes.length > 1) {
      output += ' (your choice)';
    }

    return output;
  }

  function abilityGenericToMarkdown(generic: AbilityGenericEntry, state: State): string {
    let output = '';

    if (generic.name) {
      output += `**${generic.name}** = `;
    }

    output += generic.text;

    if (generic.attributes) {
      output += ' ';

      generic.attributes.forEach((attr, index) => {
        const prefix = index !== 0 ? ' or ' : '';
        output += `${prefix}${_.getAttrName(attr)}`;
      });

      output += ' modifier';

      if (generic.attributes.length > 1) {
        output += ' (your choice)';
      }
    }

    return output;
  }

  function tableCellToMarkdown(cell: TableCell, state: State): string {
    if (typeof cell === 'string') {
      return textToMarkdown(cell, state);
    }

    if (cell.type === 'cell') {
      let output = '';

      if (cell.roll.exact) {
        output = cell.roll.exact < 10 && cell.roll.pad ? `0${cell.roll.exact}` : cell.roll.exact.toString();
      }

      if (cell.roll.min && cell.roll.max) {
        const min = cell.roll.min < 10 && cell.roll.pad ? `0${cell.roll.min}` : cell.roll.min;
        const max = cell.roll.max < 10 && cell.roll.pad ? `0${cell.roll.max}` : cell.roll.max;
        output = `${min}-${max}`;
      }

      return output;
    }

    // TODO: create a inline way to draw lists
    if (cell.type === 'list') {
      return '';
    }

    // TODO: create a inline way to draw entries
    if (cell.type === 'entries') {
      return '';
    }

    // TODO: create a inline way to draw sections
    if (cell.type === 'section') {
      return '';
    }

    return entryToMarkdown(cell, { ...state, notitle: true, nowrap: true });
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
      output += `**${table.caption}**\n\n`;
    }

    output += markdownTable(array);
    return output;
  }

  function imageToMarkdown(image: ImageEntry, state: State): string {
    const { entity, fluff } = state;
    const baseUrl = 'https://5e.tools/img';
    const url = new URL(`${baseUrl}/${image.href.path}`);
    const title = image.title || entity?.name || fluff?.name;
    return `![${title}|${imageWidth}](${url.href})`;
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
      output += `\n\n*— ${quote.by}`;
      if (quote.from) output += `, ${quote.from}`;
      output += '*';
    }

    return output;
  }

  function insetToMarkdown(inset: InsetEntry, state: State): string {
    const calloutType = inset.type === 'inset' ? 'INFO' : 'QUOTE';
    const nextState = { ...state, headingLevel: defaultState.headingLevel };

    let output = `> [!${calloutType}]+ ${inset.name}\n`;
    output += entriesToMarkdown(inset.entries, nextState).replace(/^/gm, '> ');

    return output;
  }

  function variantToMarkdown(inset: VariantEntry, state: State): string {
    const calloutType = inset.type === 'variant' ? 'EXAMPLE' : 'NOTE';
    const nextState = { ...state, headingLevel: defaultState.headingLevel };

    let output = `> [!${calloutType}]+ ${inset.name}\n`;
    output += entriesToMarkdown(inset.entries, nextState).replace(/^/gm, '> ');
    return output;
  }

  function inlineToMarkdown(inline: InlineEntry | InlineBlockEntry, state: State): string {
    return entriesToMarkdown(inline.entries, {
      ...state,
      nowrap: true
    });
  }

  function linkToMarkdown(link: LinkEntry, state: State): string {
    const url = link.href.type === 'external' ? new URL(link.href.url).href : link.href.path;
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

  function optFeatureToMarkdown(opt: OptFeatureEntry, state: State): string {
    let output = '';
    if (opt.prerequisite) output += `***${opt.prerequisite}***\n\n`;
    output += entriesToMarkdown(opt.entries, state);
    return output;
  }

  function copyEntries(copy: CopyEntity, fluff?: boolean): Entry[] {
    const findEntity = (e: Entity | FluffEntity) => e.name === copy.name;
    const original = fluff ? fluffs.find(findEntity) : entities.find(findEntity);

    if (!original || !original.entries) {
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

  function entityToMarkdown(entity: Entity, fluff?: FluffEntity): string {
    const state: State = { ...defaultState, entity, fluff: fluff };
    let fluffEntries: Entry[] = [];
    let entityEntries: Entry[] = [];

    if (fluff?.entries) {
      fluffEntries.push(...fluff.entries);
    }

    if (fluff?._copy) {
      fluffEntries.push(...copyEntries(fluff._copy, true));
    }

    if (entity.entries) {
      entityEntries.push(...entity.entries);
    }

    if (entity._copy) {
      entityEntries.push(...copyEntries(entity._copy));
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
    return entriesToMarkdown(entries, state);
  }

  return {
    entityToMarkdown,
    entriesToMarkdown,
    entryToMarkdown
  };
};
