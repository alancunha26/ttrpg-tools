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
  'optional-features': string;
}

export type EntityType = keyof EntityPaths;

export interface Config {
  sourcesPath: string;
  linkStyle: 'wikilink' | 'markdown';
  sources: SourceCode[];
  templates: Omit<EntityPaths, 'sources'>;
  paths: EntityPaths;
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

export type Entry = string | EntriesEntry | ListEntry | TableEntry | QuoteEntry | ImageEntry;

export interface ListEntry {
  type: 'list';
  style: 'list-hang-no-title' | 'list-no-bullets';
  items?: Entry[];
}

export interface TableEntry {
  type: 'table';
  colLabels: string[];
  colStyles: string[];
  rows: string[];
}

export interface SectionEntry {
  type: 'section';
  name: string;
  entries?: Entry[];
}

export interface ImageEntry {
  type: 'image';
  title?: string;
  credit?: string;
  href: {
    type: 'internal' | 'external';
    path: string;
  };
}

export interface EntriesEntry {
  type: 'entries';
  name?: string;
  entries: Array<Entry>;
}

export interface QuoteEntry {
  type: 'quote';
  entries: string[];
  by: string;
}

export interface PrependArrEntry {
  mode: 'prependArr';
  items: Entry;
}

export interface InsertArrEntry {
  mode: 'insertArr';
  index: number;
  items: Entry;
}

export interface ReplaceArrEntry {
  mode: 'replaceArr';
  replace: string | { index: number };
  items: Entry;
}

/**
 * ENTITIES
 */

export interface CopyEntity {
  name: string;
  source: string;
  _mod?: { entries?: PrependArrEntry | InsertArrEntry | ReplaceArrEntry };
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
  _copy?: CopyEntity[];
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
