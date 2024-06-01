import { Entry } from './entry';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type AdditionalProperties = { [key: string | number | symbol]: unknown };

export type AbilityScoreUnion = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScoresBlock<T> {
  str?: T;
  dex?: T;
  con?: T;
  int?: T;
  wis?: T;
  cha?: T;
}

export type SkillUnionLower =
  | string
  | 'athletics'
  | 'acrobatics'
  | 'sleight of hand'
  | 'stealth'
  | 'arcana'
  | 'history'
  | 'investigation'
  | 'nature'
  | 'religion'
  | 'animal handling'
  | 'insight'
  | 'medicine'
  | 'perception'
  | 'survival'
  | 'deception'
  | 'intimidation'
  | 'performance'
  | 'persuasion';

export interface SkillsBlock<T> extends AdditionalProperties {
  athletics?: T;
  acrobatics?: T;
  'sleight of hand'?: T;
  stealth?: T;
  arcana?: T;
  history?: T;
  investigation?: T;
  nature?: T;
  religion?: T;
  'animal handling'?: T;
  insight?: T;
  medicine?: T;
  perception?: T;
  survival?: T;
  deception?: T;
  intimidation?: T;
  performance?: T;
  persuasion?: T;
}

export type ToolUnionLower =
  | string
  | "artisan's tools"
  | "alchemist's supplies"
  | "brewer's supplies"
  | "calligrapher's supplies"
  | "carpenter's tools"
  | "cartographer's tools"
  | "cobbler's tools"
  | "cook's utensils"
  | "glassblower's tools"
  | "jeweler's tools"
  | "leatherworker's tools"
  | "mason's tools"
  | "painter's supplies"
  | "potter's tools"
  | "smith's tools"
  | "tinker's tools"
  | "weaver's tools"
  | "woodcarver's tools"
  | 'disguise kit'
  | 'forgery kit'
  | 'gaming set'
  | 'dragonchess set'
  | 'dice set'
  | 'three-dragon ante set'
  | 'herbalism kit'
  | 'musical instrument'
  | 'bagpipes'
  | 'drum'
  | 'dulcimer'
  | 'flute'
  | 'horn'
  | 'lute'
  | 'lyre'
  | 'pan flute'
  | 'shawm'
  | 'viol'
  | "navigator's tools"
  | "thieves' tools"
  | "poisoner's kit"
  | 'vehicles'
  | 'vehicles (air)'
  | 'vehicles (land)'
  | 'vehicles (water)'
  | 'vehicles (space)';

export interface ToolsBlock<T> extends AdditionalProperties {
  "artisan's tools"?: T;

  "alchemist's supplies"?: T;
  "brewer's supplies"?: T;
  "calligrapher's supplies"?: T;
  "carpenter's tools"?: T;
  "cartographer's tools"?: T;
  "cobbler's tools"?: T;
  "cook's utensils"?: T;
  "glassblower's tools"?: T;
  "jeweler's tools"?: T;
  "leatherworker's tools"?: T;
  "mason's tools"?: T;
  "painter's supplies"?: T;
  "potter's tools"?: T;
  "smith's tools"?: T;
  "tinker's tools"?: T;
  "weaver's tools"?: T;
  "woodcarver's tools"?: T;

  'disguise kit'?: T;
  'forgery kit'?: T;

  'gaming set'?: T;
  'dragonchess set'?: T;
  'dice set'?: T;
  'three-dragon ante set'?: T;

  'herbalism kit'?: T;

  'musical instrument'?: T;
  bagpipes?: T;
  drum?: T;
  dulcimer?: T;
  flute?: T;
  horn?: T;
  lute?: T;
  lyre?: T;
  'pan flute'?: T;
  shawm?: T;
  viol?: T;

  "navigator's tools"?: T;
  "thieves' tools"?: T;
  "poisoner's kit"?: T;

  vehicles?: T;
  'vehicles (air)'?: T;
  'vehicles (land)'?: T;
  'vehicles (water)'?: T;
  'vehicles (space)'?: T;
}

export type LanguageUnion =
  | string
  | 'abyssal'
  | 'aquan'
  | 'auran'
  | 'celestial'
  | 'common'
  | 'common sign language'
  | 'deep speech'
  | 'draconic'
  | 'druidic'
  | 'dwarvish'
  | 'elvish'
  | 'giant'
  | 'gith'
  | 'gnomish'
  | 'goblin'
  | 'halfling'
  | 'ignan'
  | 'infernal'
  | 'orc'
  | 'other'
  | 'primordial'
  | 'sylvan'
  | 'terran'
  | "thieves' cant"
  | 'undercommon';

export interface LanguagesBlock<T> extends AdditionalProperties {
  abyssal: T;
  aquan: T;
  auran: T;
  celestial: T;
  common: T;
  'common sign language': T;
  'deep speech': T;
  draconic: T;
  druidic: T;
  dwarvish: T;
  elvish: T;
  giant: T;
  gith: T;
  gnomish: T;
  goblin: T;
  halfling: T;
  ignan: T;
  infernal: T;
  orc: T;
  other: T;
  primordial: T;
  sylvan: T;
  terran: T;
  "thieves' cant": T;
  undercommon: T;
}

export interface SpellsFrequencyBlock<T> {
  '1'?: T;
  '2'?: T;
  '3'?: T;
  '4'?: T;
  '5'?: T;
  '6'?: T;
  '7'?: T;
  '8'?: T;
  '9'?: T;
  '9e'?: T;
  '8e'?: T;
  '7e'?: T;
  '6e'?: T;
  '5e'?: T;
  '4e'?: T;
  '3e'?: T;
  '2e'?: T;
  '1e'?: T;
}

export interface SpellsLevel1To9Block<T> {
  '0'?: T;
  '1'?: T;
  '2'?: T;
  '3'?: T;
  '4'?: T;
  '5'?: T;
  '6'?: T;
  '7'?: T;
  '8'?: T;
  '9'?: T;
}

export interface SpellsRechargeBlock<T> {
  '1'?: T;
  '2'?: T;
  '3'?: T;
  '4'?: T;
  '5'?: T;
  '6'?: T;
}

export type SpellcastingSpells = SpellsLevel1To9Block<{
  spells: string[];
  lower?: number;
  slots?: number;
}>;

export interface MediaHrefInternal {
  type: 'internal';
  path: string;
}

export interface MediaHrefExternal {
  type: 'external';
  url: string;
}

export type MediaHref = MediaHrefInternal | MediaHrefExternal;

export interface ModReplaceTxt {
  mode: 'replaceTxt';
  replace: string;
  with: string;
  flags?: string;
  props?: Array<string | null>;
}

export interface ModReplaceName {
  mode: 'replaceName';
  replace: string;
  with: string;
  flags?: string;
}

export interface ModAppendStr {
  mode: 'appendStr';
  str: string;
  joiner?: string;
}

export interface ModPrependArr {
  mode: 'prependArr';
  items: Entry | Entry[];
}

export interface ModAppendArr {
  mode: 'appendArr';
  items: Entry | Entry[];
}

export interface ModAppendIfNotExistsArr {
  mode: 'appendIfNotExistsArr';
  items: Entry | Entry[];
}

export type ModReplace = string | { index: number } | { regex: string; flags?: string };

export interface ModReplaceArr {
  mode: 'replaceArr';
  items: Entry | Entry[];
  replace: ModReplace;
}

export interface ModReplaceOrAppendArr {
  mode: 'replaceOrAppendArr';
  items: Entry | Entry[];
  replace: ModReplace;
}

export interface ModInsertArr {
  mode: 'insertArr';
  items: Entry | Entry[];
  index: number;
}

export interface ModRemoveArr {
  mode: 'removeArr';
  items?: Entry | Entry[];
  names?: string | string[];
  force?: true;
}

export interface ModSetProp {
  mode: 'setProp';
  prop: string;
  // TODO: research and implement this, because 5etools-utils don't have this type
  value: any;
}

export interface ModCalculateProp {
  mode: 'calculateProp';
  prop: string;
  formula: string;
}

export interface ModReplaceSpells {
  mode: 'replaceSpells';
  spells?: SpellsLevel1To9Block<{ replace: string; with: string }>;
  daily?: SpellsFrequencyBlock<{ replace: string; with: string }>;
}

export interface ModRemoveSpells {
  mode: 'removeSpells';
  spells?: SpellsLevel1To9Block<string[]>;
  recharge?: SpellsRechargeBlock<string[]>;
  charges?: SpellsFrequencyBlock<string[]>;
  rest?: SpellsFrequencyBlock<string[]>;
  daily?: SpellsFrequencyBlock<string[]>;
  weekly?: SpellsFrequencyBlock<string[]>;
  monthly?: SpellsFrequencyBlock<string[]>;
  yearly?: SpellsFrequencyBlock<string[]>;
  constant?: string[];
  ritual?: string[];
  will?: string[];
}

export interface ModAddSpells {
  mode: 'addSpells';
  spells?: SpellcastingSpells;
  recharge?: SpellsRechargeBlock<string[]>;
  charges?: SpellsFrequencyBlock<string[]>;
  rest?: SpellsFrequencyBlock<string[]>;
  daily?: SpellsFrequencyBlock<string[]>;
  weekly?: SpellsFrequencyBlock<string[]>;
  monthly?: SpellsFrequencyBlock<string[]>;
  yearly?: SpellsFrequencyBlock<string[]>;
  constant?: string[];
  ritual?: string[];
  will?: string[];
}

export interface ModAddSkills {
  mode: 'addSkills';
  // 1 - proficiency | 2 - expertise
  skills: SkillsBlock<1 | 2>;
}

export interface ModAddAllSkills {
  mode: 'addAllSkills';
  // 1 - proficiency | 2 - expertise
  skills: 1 | 2;
}

export interface ModAddSaves {
  mode: 'addSaves';
  // 1 - proficiency | 2 - expertise
  saves: AbilityScoresBlock<1 | 2>;
}

export interface ModAddAllSaves {
  mode: 'addAllSaves';
  // 1 - proficiency | 2 - expertise
  skills: 1 | 2;
}

export interface AddSense {
  type: string;
  range: number;
}

export interface ModAddSenses {
  mode: 'addSenses';
  senses: AddSense | AddSense[];
}

export interface ModScalarAddProp {
  mode: 'scalarAddProp';
  prop: string;
  scalar: number;
}

export interface ModScalarMultProp {
  mode: 'scalarMultProp';
  prop: string;
  scalar: number;
  floor?: true;
}

export interface ModScalarAddHit {
  mode: 'scalarAddHit';
  scalar: number;
}

export interface ModScalarAddDc {
  mode: 'scalarAddDc';
  scalar: number;
}

export interface ModMaxSize {
  mode: 'maxSize';
  max: string;
}

export interface ModScalarMultXp {
  mode: 'scalarMultXp';
  scalar: number;
  floor?: true;
}

export type CopyMod =
  | ModReplaceTxt
  | ModReplaceName
  | ModAppendStr
  | ModPrependArr
  | ModAppendArr
  | ModAppendIfNotExistsArr
  | ModReplaceArr
  | ModReplaceOrAppendArr
  | ModInsertArr
  | ModRemoveArr
  | ModSetProp
  | ModCalculateProp
  | ModReplaceSpells
  | ModRemoveSpells
  | ModAddSpells
  | ModAddSkills
  | ModAddAllSkills
  | ModAddSaves
  | ModAddAllSaves
  | ModAddSenses
  | ModScalarAddProp
  | ModScalarMultProp
  | ModScalarAddHit
  | ModScalarAddDc
  | ModScalarMultXp
  | ModMaxSize;

export interface ModObject {
  [key: string]: string | CopyMod | CopyMod[];
}

export interface CopyBase {
  _mod?: ModObject;
  _templates?: { name: string; source: string }[];
  _preserve?: { [key: string]: true };
}

export interface CopyGeneric extends CopyBase {
  name: string;
  source: string;
  pantheon?: string;
  shortName?: string;
  className?: string;
  classSource?: string;
  raceName?: string;
  raceSource?: string;
}

export interface CopyBlockGeneric {
  _copy: CopyGeneric;
}

export type SkillProficiencies = SkillsBlock<true> & {
  any?: number;
  choose?: {
    from: SkillUnionLower[];
    count: number;
  };
};

export type ToolProficiency = ToolsBlock<true> & {
  any?: number;
  anyArtisansTool?: number;
  anyMusicalInstrument?: number;
  choose?: {
    from: Array<ToolUnionLower | 'anyArtisansTool' | 'anyMusicalInstrument'>;
    count: number;
  };
};

export type LanguageProficiencies = LanguagesBlock<true> & {
  any?: number;
  anyStandard?: number;
  anyExotic?: number;
  choose?: {
    from: LanguageUnion[];
    count: number;
  };
};
