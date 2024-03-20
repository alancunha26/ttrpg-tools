import { helpers } from './helpers';
import { sources } from './sources';

/**
 * CONFIG
 */

export interface EntityPaths {
  sources: string;
  monsters: string;
  classes: string;
  subclasses: string;
  races: string;
  subraces: string;
  variants: string;
  equipment: string;
  items: string;
  spells: string;
  backgrounds: string;
  transports: string;
  rewards: string;
  feats: string;
  objects: string;
  traps: string;
  psionics: string;
  renderdemo: string;
  'optional-features': string;
}

export type EntityType = keyof EntityPaths;

export interface Config {
  sourcesPath: string;
  linkStyle: 'wikilink' | 'markdown';
  templates: EntityPaths;
  paths: EntityPaths;
  imageWidth: number;
  sources: SourceCode[];
  identation: number;
  useDiceRoler: boolean;
  alwaysIncreaseHeadingLevel: boolean;
}

export interface Options {
  config: Config;
  output: string;
  helpers: ReturnType<typeof helpers>;
}

export interface Context {
  options: Options;
  entities: Entity[];
  fluffs: FluffEntity[];
  type: EntityType;
}

/**
 * ATTRIBUTES
 */

export type ShortAttribute = 'str' | 'con' | 'dex' | 'int' | 'wis' | 'cha';

/**
 * PREREQUISITE
 */

export interface LevelPrerequisite {
  level: number;
  class: ClassPrerequisite;
}

export interface ClassPrerequisite {
  name: string;
  visible: boolean;
}

export interface Prerequisite {
  campaign?: string[];
  level?: LevelPrerequisite;
}

/**
 * SKILLS PROFICIENCIES
 */

export interface ChooseSkillProficiency {
  from: string[];
  count?: number;
  amount?: number;
}

export interface SkillProficiency {
  nature?: boolean;
  survival?: boolean;
  performance?: boolean;
  'sleight of hand'?: boolean;
  acrobatics?: boolean;
  athletics?: boolean;
  history?: boolean;
  persuasion?: boolean;
  deception?: boolean;
  stealth?: boolean;
  religion?: boolean;
  insight?: boolean;
  investigation?: boolean;
  'animal handling'?: boolean;
  perception?: boolean;
  intimidation?: boolean;
  arcana?: boolean;
  medicine?: boolean;
  choose?: ChooseSkillProficiency;
  any?: number;
}

/**
 * TOOLS PROFICIENCIES
 */

export interface ChooseToolProficiency {
  from: string[];
  count?: number;
}

export type ToolProficiency = { [key: string]: boolean } & {
  choose?: ChooseToolProficiency;
  anyArtisanTool?: number;
};

/**
 * SKILL TOOL LANGUAGE PROFICIENCIES
 */

export interface ChooseSkillToolLanguageProficiency {
  from: string[];
  count?: number;
}

export type SkillToolLanguageProficiency = { [key: string]: boolean } & {
  choose?: ChooseSkillToolLanguageProficiency;
  anySkill?: number;
  anyLanguage?: number;
  anyTool?: number;
};

/**
 * LANGUAGES PROFICIENCIES
 */

export interface ChooseLanguage {
  from: string[];
  count?: number;
}

export type LanguageProficiency = { [key: string]: boolean } & {
  any?: number;
  anyStandard?: number;
};

/**
 * WEAPON PROFICIENCIES
 */

export interface WeaponProficiency {
  [key: string]: boolean;
}

/**
 * STARTING EQUIPMENT
 */

export interface StartingEquipment {
  _?: any[];
  a?: any[];
  b?: any[];
  c?: any[];
  d?: any[];
}

/**
 * FEATS LEARN
 */

export type FeatsLearn = { [key: string]: boolean } & {
  any?: number;
};

/**
 * SOURCES
 */

export type Source = (typeof sources)[number];
export type SourceCode = Source['code'];
export type SourceName = Source['name'];

export interface AdditionalSource {
  source: SourceCode;
  page: number;
}

/**
 * ENTRIES
 */

// allTypes [
//   'string',           'quote',
//   'list',             'entries',
//   'inline',           'inlineBlock',
//   'options',          'table',
//   'bonus',            'bonusSpeed',
//   'dice',             'abilityDc',
//   'abilityAttackMod', 'abilityGeneric',
//   'link',             'optfeature',
//   'inset',            'insetReadaloud',
//   'variant',          'image',
//   'item',             'itemSub',
//   'variantSub',       'statblockInline',
//   'statblock'
// ]

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
  | StatblockEntry;

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
  attributes: ShortAttribute[];
  name: string;
}

/**
 * ABILITY ATTACK MOD ENTRY
 */

export interface AbilityAttackModEntry {
  type: 'abilityAttackMod';
  attributes: ShortAttribute[];
  name: string;
}

/**
 * ABILITY GENERIC MOD ENTRY
 */

export interface AbilityGenericEntry {
  type: 'abilityGeneric';
  attributes?: ShortAttribute[];
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

/**
 * ENTITIES
 */

export interface CopyEntity {
  name: string;
  source: string;
  _mod?: { entries?: ArrEntry | ArrEntry[] };
}

export interface Entity {
  name: string;
  source: SourceCode;
  page: string;
  additionalSources?: AdditionalSource[];
  otherSources?: AdditionalSource[];
  srd?: boolean;
  basicRules?: boolean;
  entries?: Entry[];
  _copy?: CopyEntity;
  hasFluff?: boolean;
  hasFluffImages?: boolean;
}

export interface FluffEntity {
  name: string;
  source: SourceCode;
  entries?: Entry[];
  images?: { item: ImageEntry } | ImageEntry[];
  _copy?: CopyEntity;
}

export interface BackgroundEntity extends Entity {
  prerequisite?: Prerequisite[];
  skillProficiencies?: SkillProficiency[];
  languageProficiencies?: LanguageProficiency[];
  toolProficiencies?: ToolProficiency[];
  startingEquipment?: StartingEquipment[];
  weaponProficiencies?: WeaponProficiency[];
  skillToolLanguageProficiencies?: SkillToolLanguageProficiency[];
  feats?: FeatsLearn[];
  additionalSpells?: any;
  fromFeature?: {
    additionalSpells?: boolean;
    feats: boolean;
  };
}
