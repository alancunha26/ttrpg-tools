import { AttributeCode } from './attribute';

export type Entry =
  | string
  | EntriesEntry
  | TableEntry
  | QuoteEntry
  | ImageEntry
  | InsetEntry
  | ListEntry
  | ItemEntry
  | InlineEntry
  | InlineBlockEntry
  | LinkEntry
  | OptionsEntry
  | BonusEntry
  | SectionEntry
  | DiceEntry
  | AbilityDcEntry
  | AbilityAttackModEntry
  | AbilityGenericEntry
  | OptFeatureEntry
  | VariantEntry
  | StatblockInlineEntry
  | StatblockEntry
  | ClassReferenceEntry
  | SubclassReferenceEntry;

/**
 * TODO: implement statblock entries
 * STATBLOCK ENTRY
 */

export interface StatblockInlineEntry {
  type: 'statblockInline';
}

export interface StatblockEntry {
  type: 'statblock';
}

/**
 * REFERENCES ENTRY
 */

export interface ClassReferenceEntry {
  type: 'refClassFeature';
  classFeature: string;
}

export interface SubclassReferenceEntry {
  type: 'refSubclassFeature';
  classFeature: string;
}

/*
 * VARIANT ENTRY
 */

export interface VariantEntry {
  type: 'variant' | 'variantSub';
  entries: Entry[];
  name?: string;
}

/**
 * OPTIONAL FEATURE ENTRY
 */

export interface OptFeatureEntry {
  type: 'optfeature';
  entries: Entry[];
  name?: string;
  prerequisite?: string;
}

/**
 * ABILITY DC ENTRY
 */

export interface AbilityDcEntry {
  type: 'abilityDc';
  attributes: AttributeCode[];
  name: string;
}

/**
 * ABILITY ATTACK MOD ENTRY
 */

export interface AbilityAttackModEntry {
  type: 'abilityAttackMod';
  attributes: AttributeCode[];
  name: string;
}

/**
 * ABILITY GENERIC MOD ENTRY
 */

export interface AbilityGenericEntry {
  type: 'abilityGeneric';
  attributes?: AttributeCode[];
  name?: string;
  text: string;
}

/**
 * OPTIONS ENTRY
 */

export interface OptionsEntry {
  type: 'options';
  entries: Entry[];
}

/**
 * BONUS ENTRY
 */
export interface BonusEntry {
  type: 'bonus' | 'bonusSpeed';
  value?: number;
}

/**
 * INLINE ENTRY
 */

export interface InlineEntry {
  type: 'inline';
  entries: Entry[];
}

export interface InlineBlockEntry {
  type: 'inlineBlock';
  entries: Entry[];
}

/**
 * LINK ENTRY
 */

export interface InternalLink {
  type: 'link';
  text: string;
  href: { type: 'internal'; path: string };
}

export interface ExternalLink {
  type: 'link';
  text: string;
  href: { type: 'external'; url: string };
}

export type LinkEntry = InternalLink | ExternalLink;

/**
 * LIST ENTRIES
 */

export interface BulletListEntry {
  type: 'list';
  items: Entry[];
  name?: string;
}

export interface NoBulletListEntry {
  type: 'list';
  style: 'list-no-bullets';
  items: Entry[];
  name?: string;
}

export interface HangListEntry {
  type: 'list';
  style: 'list-hang';
  items: Entry[];
  name?: string;
}

export interface HangNoTitleListEntry {
  type: 'list';
  style: 'list-hang-notitle';
  items: Entry[];
  name?: string;
}

export interface DecimalListEntry {
  type: 'list';
  style: 'list-decimal';
  items: Entry[];
  start?: number;
  name?: string;
}

export interface RomanListEntry {
  type: 'list';
  style: 'list-upper-roman' | 'list-lower-roman';
  items: Entry[];
  start?: number;
  name?: string;
}

export type ListEntry =
  | BulletListEntry
  | NoBulletListEntry
  | HangListEntry
  | HangNoTitleListEntry
  | DecimalListEntry
  | RomanListEntry;

/**
 * DICE ENTRY
 */

export interface DiceToRoll {
  number: number;
  faces: number;
  modifier?: number;
  hideModifier?: boolean;
}

export interface DiceEntry {
  type: 'dice';
  rollable: boolean;
  toRoll: DiceToRoll[];
}

/**
 * ITEM ENTRIES
 */

export interface BaseItemEntry {
  type: 'item';
  name?: string;
  entry?: Entry;
  entries?: Entry[];
}

export interface SubItemEntry {
  type: 'itemSub';
  name?: string;
  entry: Entry;
}

export interface SpellItemEntry {
  type: 'itemSpell';
  name?: string;
  entry: Entry;
}

export type ItemEntry = BaseItemEntry | SubItemEntry | SpellItemEntry;

/**
 * TABLE ENTRY
 */

export interface TableRollEntry {
  type: 'cell';
  roll: {
    exact?: number;
    min?: number;
    max?: number;
    pad?: boolean;
  };
}

export type TableCell = Entry | TableRollEntry;

export interface TableIdentFirstRow {
  type: 'row';
  style: 'row-ident-first';
  row: TableCell | TableCell[];
}

export type TableRow = TableCell[] | TableIdentFirstRow;

export interface TableEntry {
  type: 'table';
  caption?: string;
  colLabelGroups?: { colLabels?: string[] }[];
  colLabels?: string[];
  rows: TableRow[];
}

/**
 * SECTION ENTRY
 */

export interface SectionEntry {
  type: 'section';
  name?: string;
  entries: Entry[];
}

/**
 * IMAGE ENTRY
 */

export interface ImageEntry {
  type: 'image';
  name?: string;
  title?: string;
  credit?: string;
  href: {
    type: 'internal' | 'external';
    path: string;
  };
}

/**
 * ENTRIES ENTRY
 */

export interface EntriesEntry {
  type: 'entries';
  entries: Entry[];
  name?: string;
}

/**
 * INSET ENTRY
 */

export interface InsetEntry {
  type: 'inset' | 'insetReadaloud';
  entries: Entry[];
  name?: string;
}

/**
 * QUOTE ENTRY
 */

export interface QuoteEntry {
  type: 'quote';
  entries: string[];
  by: string;
  from?: string;
  name?: string;
}

/**
 * ARR ENTRIES
 */

export interface PrependArrEntry {
  mode: 'prependArr';
  items: Entry | Entry[];
}

export interface InsertArrEntry {
  mode: 'insertArr';
  index: number;
  items: Entry | Entry[];
}

export interface ReplaceArrEntry {
  mode: 'replaceArr';
  replace: string | { index: number };
  items: Entry | Entry[];
}

export type ArrEntry = PrependArrEntry | InsertArrEntry | ReplaceArrEntry;
