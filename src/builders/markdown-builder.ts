import { markdownTable } from 'markdown-table';
import {
  AbilityAttackModEntry,
  AbilityDcEntry,
  AbilityGenericEntry,
  BonusEntry,
  DiceEntry,
  Entry,
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
} from '../models/entry';
import { Entity } from '../models/entity';
import { Context } from '../types';

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
  const { config, helpers: h } = context;
  const { imageWidth, identation, alwaysIncreaseHeadingLevel, useHtmlTags, useDiceRoller: useDiceRoler } = config;
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

    if (entry.type === 'refClassFeature') {
      console.log('refClassFeature', entry);
    }

    if (entry.type === 'refSubclassFeature') {
      console.log('refSubclassFeature', entry);
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

  function colorTagToMarkdown(text: string): string {
    const color = /\{\@color\s(.*?)\}/g;
    return text.replace(color, match => {
      const base = /{\@color\s(.*?)\|(.*?)}/g;
      const variable = /{\@color\s(.*?)\|(--.*?)}/g;

      if (variable.test(match)) {
        return match.replace(variable, useHtmlTags ? '<span style="color: var($2)">$1</span>' : '$1');
      } else {
        return match.replace(base, useHtmlTags ? '<span style="color: #$2">$1</span>' : '$1');
      }
    });
  }

  // Since there's no prompt feature in obsidian dice roller,
  // I'm using the "default" value of the prompt as a replacement
  // when there's no "default" value, I use the "(n)" annotation
  function promptTagToMarkdown(text: string): string {
    return text.replace(/#\$(.*?)\$#/g, (match: string, content: string) => {
      const attributes = content.split(',');
      let defaultValue: string | undefined;

      for (const attribute of attributes) {
        const [key, value] = attribute.split('=');
        if (key.trim() === 'default') {
          defaultValue = value.trim();
          break;
        }
      }

      return defaultValue ? defaultValue : '(n)';
    });
  }

  function rollTagToMarkdown(roll: string, title?: string): string {
    let output = String(roll);
    const enabled = useDiceRoler && !roll.includes('(n)');

    if (enabled) {
      const titleText = `|text(${title || roll})`;
      output = `\`dice: ${output}${titleText}\``;
    } else {
      output = String(title || roll);
    }

    // Replaces math operations
    output = output.replace(/ceil\((.*?)\)/g, enabled ? '$1|ceil' : '$1');
    output = output.replace(/floor\((.*?)\)/g, enabled ? '$1|floor' : '$1');
    output = output.replace(/round\((.*?)\)/g, enabled ? '$1|round' : '$1');

    return output;
  }

  function diceTagToMarkdown(text: string): string {
    return text.replace(/{\@dice\s(.*?)}/g, (_: string, content: string) => {
      let formula = String(content);
      let rolls: string[] = [content];
      let title: string | undefined;

      if (formula.includes('|')) {
        [formula, title] = formula.split('|');
        rolls = [formula];
      }

      if (formula.includes(';')) {
        rolls = formula.split(';');
      }

      rolls = rolls.map(roll => rollTagToMarkdown(roll, title));
      return rolls.join('/');
    });
  }

  function hitTagToMarkdown(text: string): string {
    return text.replace(/{\@hit\s(.*?)}/g, (_, content: string) => {
      let formula = String(content);
      let rolls: string[] = [content];
      let title: string | undefined;

      if (formula.includes('|')) {
        [formula, title] = formula.split('|');
        rolls = [formula];
      }

      if (formula.includes(';')) {
        rolls = formula.split(';');
      }

      rolls = rolls.map(roll => rollTagToMarkdown(`1d20${roll}`, title));
      return rolls.join('/');
    });
  }

  function damageTagToMarkdown(text: string): string {
    return text.replace(/{\@damage\s(.*?)}/g, (_: string, content: string) => {
      let formula = String(content);
      let rolls: string[] = [content];
      let title: string | undefined;

      if (formula.includes('|')) {
        [formula, title] = formula.split('|');
        rolls = [formula];
      }

      if (formula.includes(';')) {
        rolls = formula.split(';');
      }

      rolls = rolls.map(roll => rollTagToMarkdown(roll, title));
      return rolls.join('/');
    });
  }

  function d20TagToMarkdown(text: string): string {
    return text.replace(/{\@d20\s(.*?)}/g, (_, content: string) => {
      let formula = String(content);
      let rolls: string[] = [content];
      let title: string | undefined;

      if (formula.includes('|')) {
        [formula, title] = formula.split('|');
        rolls = [formula];
      }

      if (formula.includes(';')) {
        rolls = formula.split(';');
      }

      rolls = rolls.map(roll => rollTagToMarkdown(`1d20${roll}`, title));
      return rolls.join('/');
    });
  }

  function scaleDamageTagToMarkdown(text: string): string {
    return text.replace(/{\@scaledamage\s(.*?)}/g, (_, content: string) => {
      let extra: string | undefined;

      if (content.includes('|')) {
        // formula, scale, extra
        [_, _, extra] = content.split('|');
      }

      if (extra) {
        return rollTagToMarkdown(extra);
      }

      return content;
    });
  }

  function scaleDiceTagToMarkdown(text: string): string {
    return text.replace(/{\@scaledice\s(.*?)}/g, (_, content: string) => {
      let title: string | undefined;
      let extra: string | undefined;

      if (content.includes('|')) {
        // formula, scale, extra, type, title
        [_, _, extra, _, title] = content.split('|');
      }

      if (extra) {
        return rollTagToMarkdown(extra, title);
      }

      return content;
    });
  }

  function abilityTagToMarkdown(text: string): string {
    return text.replace(/{\@ability\s(.*?)}/g, (_, content: string) => {
      const [formula, title] = content.split('|');
      const [attr, value] = formula.split(' ');

      const modifier = Math.floor((parseInt(value) - 10) / 2);
      const extra = modifier < 0 ? `-${Math.abs(modifier)}` : `+${modifier}`;
      const rollTitle = title || `${value} (${extra})`;

      return rollTagToMarkdown(`1d20${extra}`, rollTitle);
    });
  }

  function savingThrowTagToMarkdown(text: string): string {
    return text.replace(/{\@savingThrow\s(.*?)}/g, (_, content: string) => {
      const [formula, title] = content.split('|');
      const [attr, value] = formula.split(' ');

      const modifier = Math.floor((parseInt(value) - 10) / 2);
      const extra = modifier < 0 ? `-${Math.abs(modifier)}` : `+${modifier}`;
      const rollTitle = title || extra;

      return rollTagToMarkdown(`1d20${extra}`, rollTitle);
    });
  }

  function skillCheckTagToMarkdown(text: string): string {
    return text.replace(/{\@skillCheck\s(.*?)}/g, (_, content: string) => {
      const [formula, title] = content.split('|');
      const [skill, value] = formula.split(' ');

      const modifier = Math.floor((parseInt(value) - 10) / 2);
      const extra = modifier < 0 ? `-${Math.abs(modifier)}` : `+${modifier}`;
      const rollTitle = title || extra;

      return rollTagToMarkdown(`1d20${extra}`, rollTitle);
    });
  }

  function autoDiceTagToMarkdown(text: string): string {
    return text.replace(/{\@autodice\s(.*?)}/g, (_: string, content: string) => {
      let formula = String(content);
      let rolls: string[] = [content];
      let title: string | undefined;

      if (formula.includes('|')) {
        [formula, title] = formula.split('|');
        rolls = [formula];
      }

      if (formula.includes(';')) {
        rolls = formula.split(';');
      }

      rolls = rolls.map(roll => rollTagToMarkdown(roll, title));
      return rolls.join('/');
    });
  }

  function chanceTagToMarkdown(text: string): string {
    return text.replace(/{\@chance\s(.*?)}/g, (_: string, content: string) => {
      const [chance, title] = content.split('|');
      return rollTagToMarkdown('1d%', title || `${chance}%`);
    });
  }

  function hitYourSpellAttackTagToMarkdown(text: string): string {
    return text.replace(/{\@hitYourSpellAttack(.*?)}/g, (_: string, content: string) => {
      return content.trim() || 'your spell attack modifier';
    });
  }

  function dcYourSpellSaveTagToMarkdown(text: string): string {
    return text.replace(/{\@dcYourSpellSave(.*?)}/g, (_: string, content: string) => {
      return content.trim() || 'your spell save DC';
    });
  }

  function rechargeTagToMarkdown(text: string): string {
    return text.replace(/{\@recharge(.*?)}/g, (_: string, content: string) => {
      const recharge = parseInt(content.trim());
      const title = isNaN(recharge) ? '(Recharge 6)' : `(Recharge ${recharge}-6)`;
      return rollTagToMarkdown('1d6', title);
    });
  }

  function conflipTagToMarkdown(text: string): string {
    return text.replace(/{\@coinflip(.*?)}/g, (_: string, content: string) => {
      const [title] = content.trim().split('|');
      return rollTagToMarkdown('1d2', title || 'coinflip');
    });
  }

  // NOTE: There's no much use in 5eTools of this tag, so I didn't implemented fully.
  // When needed I can store the foot note texts and print at the end of the file using
  // markdown footnotes formatting
  function footnoteTagToMarkdown(text: string): string {
    return text.replace(/{\@footnote(.*?)}/g, (_: string, content: string) => {
      const [text] = content.trim().split('|');
      return text;
    });
  }

  function skillTagToMarkdown(text: string): string {
    return text.replace(/{\@skill(.*?)}/g, (_: string, content: string) => {
      const skill = content.trim();
      return h.getVaultLink(skill, 'skills');
    });
  }

  function senseTagToMarkdown(text: string): string {
    return text.replace(/{\@sense(.*?)}/g, (_: string, content: string) => {
      const [sense] = content.trim().split('|');
      return h.getVaultLink(sense, 'senses');
    });
  }

  function actionTagToMarkdown(text: string): string {
    return text.replace(/{\@action(.*?)}/g, (_: string, content: string) => {
      const [action, source, alias] = content.trim().split('|');
      return h.getVaultLink(action, 'actions', alias);
    });
  }

  function spellTagToMarkdown(text: string): string {
    return text.replace(/{\@spell(.*?)}/g, (_: string, content: string) => {
      const [spell, source, alias] = content.trim().split('|');
      return h.getVaultLink(spell, 'spells', alias);
    });
  }

  function itemTagToMarkdown(text: string): string {
    return text.replace(/{\@item(.*?)}/g, (_: string, content: string) => {
      const [item, source, alias] = content.trim().split('|');
      return h.getVaultLink(item, 'items', alias);
    });
  }

  function creatureTagToMarkdown(text: string): string {
    return text.replace(/{\@creature(.*?)}/g, (_: string, content: string) => {
      const [monster, source, alias] = content.trim().split('|');
      return h.getVaultLink(monster, 'monsters', alias);
    });
  }

  function backgroundTagToMarkdown(text: string): string {
    return text.replace(/{\@background(.*?)}/g, (_: string, content: string) => {
      const [background, source, alias] = content.trim().split('|');
      return h.getVaultLink(background, 'backgrounds', alias);
    });
  }

  function raceTagToMarkdown(text: string): string {
    return text.replace(/{\@race(.*?)}/g, (_: string, content: string) => {
      const [race, source, alias] = content.trim().split('|');
      return h.getVaultLink(race, 'races', alias);
    });
  }

  function optFeatureTagToMarkdown(text: string): string {
    return text.replace(/{\@optfeature(.*?)}/g, (_: string, content: string) => {
      const [opt, source, alias] = content.trim().split('|');
      return h.getVaultLink(opt, 'optional-features', alias);
    });
  }

  function classTagToMarkdown(text: string): string {
    return text.replace(/{\@class\s(.*?)}/g, (_: string, content: string) => {
      const [classe, source, alias, subclass] = content.trim().split('|');
      return h.getVaultLink(subclass || classe, subclass ? 'subclasses' : 'classes', alias);
    });
  }

  function classFeatureTagToMarkdown(text: string): string {
    return text.replace(/{\@classFeature\s(.*?)}/g, (_: string, content: string) => {
      const [feature, classe, source, level, featureSource, alias] = content.trim().split('|');
      return h.getVaultLink(classe, 'classes', alias, feature);
    });
  }

  function subclassFeatureTagToMarkdown(text: string): string {
    // EXAMPLE: {@subclassFeature Eldritch Cannon|Artificer|TCE|Artillerist|TCE|3}
    return text.replace(/{\@subclassFeature\s(.*?)}/g, (_: string, content: string) => {
      const [feature, classe, source, subclass, subclassSource, level, alias] = content.trim().split('|');
      return h.getVaultLink(subclass, 'subclasses', alias, feature);
    });
  }

  // NOTE: Unsupported markdown elements like kbd and colors tags are
  // converted to html elements instead, you can disable this by
  // settings the `useHtmlTags = false` in the config file, this will
  // make these tags be converted to plain text
  function textToMarkdown(text: string, state: State): string {
    let output = String(text);

    // Simple tags, these can be solved with a simple regex replace
    output = output.replace(/{\@(bold|b)\s(.*?)}/g, '**$2**');
    output = output.replace(/{\@(italic|i)\s(.*?)}/g, '*$2*');
    output = output.replace(/{\@(underline|u)\s(.*?)}/g, useHtmlTags ? '<u>$2</u>' : '$2');
    output = output.replace(/{\@(strike|s)\s(.*?)}/g, '~~$2~~');
    output = output.replace(/{\@highlight\s(.*?)}/g, '==$1==');
    output = output.replace(/{\@sup\s(.*?)}/g, useHtmlTags ? '<sup>$1</sup>' : '$1');
    output = output.replace(/{\@sub\s(.*?)}/g, useHtmlTags ? '<sub>$1</sub>' : '$1');
    output = output.replace(/{\@kbd\s(.*?)}/g, useHtmlTags ? '<kbd>$1</kbd>' : '$1');
    output = output.replace(/{\@code\s(.*?)}/g, '`$1`');
    output = output.replace(/{\@note\s(.*?)}/g, '*$1*');
    output = output.replace(/{\@tip\s(.*?)\|(.*?)}/g, '$1 ($2)');

    // Unsupported tag, because it behaves specifically for 5eTools website
    output = output.replace(/{\@style\s(.*?)\|(.*?)}/g, '$1');
    output = output.replace(/{\@font\s(.*?)\|(.*?)}/g, '$1');

    // More complex tags, these need specific methods
    output = colorTagToMarkdown(output);
    output = promptTagToMarkdown(output);
    output = diceTagToMarkdown(output);
    output = hitTagToMarkdown(output);
    output = damageTagToMarkdown(output);
    output = d20TagToMarkdown(output);
    output = scaleDamageTagToMarkdown(output);
    output = scaleDiceTagToMarkdown(output);
    output = abilityTagToMarkdown(output);
    output = savingThrowTagToMarkdown(output);
    output = skillCheckTagToMarkdown(output);
    output = autoDiceTagToMarkdown(output);
    output = chanceTagToMarkdown(output);
    output = hitYourSpellAttackTagToMarkdown(output);
    output = dcYourSpellSaveTagToMarkdown(output);
    output = rechargeTagToMarkdown(output);
    output = conflipTagToMarkdown(output);
    output = footnoteTagToMarkdown(output);
    output = skillTagToMarkdown(output);
    output = senseTagToMarkdown(output);
    output = spellTagToMarkdown(output);
    output = actionTagToMarkdown(output);
    output = itemTagToMarkdown(output);
    output = creatureTagToMarkdown(output);
    output = backgroundTagToMarkdown(output);
    output = raceTagToMarkdown(output);
    output = optFeatureTagToMarkdown(output);
    output = classTagToMarkdown(output);
    output = classFeatureTagToMarkdown(output);
    output = subclassFeatureTagToMarkdown(output);

    return output;
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
    const entries = h.sortEntries(options.entries);
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
          prefix = `${h.numberToRoman(number)}.`;
        }

        if (list.style === 'list-upper-roman') {
          prefix = `${h.numberToRoman(number, true)}.`;
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
      output += `${prefix}${h.getAttrName(attr)}`;
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
      output += `${prefix}${h.getAttrName(attr)}`;
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
        output += `${prefix}${h.getAttrName(attr)}`;
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

    // TODO: create a inline way to draw entries
    if (cell.type === 'entries') {
    }

    // TODO: create a inline way to draw lists
    if (cell.type === 'list') {
    }

    // TODO: create a inline way to draw sections
    if (cell.type === 'section') {
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
    const baseUrl = 'https://5e.tools/img';
    const url = new URL(`${baseUrl}/${image.href.path}`);
    const title = image.title || state.entity?.name;
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

  function optFeatureToMarkdown(opt: OptFeatureEntry, state: State): string {
    let output = '';
    if (opt.prerequisite) output += `***${opt.prerequisite}***\n\n`;
    output += entriesToMarkdown(opt.entries, state);
    return output;
  }

  function entityToMarkdown(entity: Entity): string {
    const state: State = { ...defaultState, entity };
    return entriesToMarkdown(entity.entries || [], state);
  }

  return {
    entityToMarkdown,
    entriesToMarkdown,
    entryToMarkdown
  };
};
