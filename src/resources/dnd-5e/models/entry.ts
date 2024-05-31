/**
 * START OF GENERICS SECTION
 */

import { Action } from './action';
import { Background } from './background';
import { Creature } from './beastiary';
import { CharCreationOption } from './char-creation-option';
import { Condition, Disease } from './condition-disease';
import { Boon, Cult } from './cult-boon';
import { Deity } from './deity';
import { Feat } from './feat';
import { Item } from './item';
import { Language } from './language';
import { LegendaryGroup } from './legendary-group';
import { OptionalFeature } from './optional-feature';
import { Psionic } from './psionic';
import { Race } from './race';
import { Recipe } from './recipe';
import { Reward } from './reward';
import { Sense } from './sense';
import { Skill } from './skill';
import { Spell } from './spell';
import { Table } from './table';
import { Hazard, Trap } from './trap-hazard';
import { MediaHref, MediaHrefExternal } from './util';
import { VariantRule } from './variant-rule';
import { Vehicle, VehicleUpgrade } from './vehicle';

interface _Data {
  [key: string]: string;
}

type _EntryDataStyle = 'inset';

interface BaseEntry {
  id?: string;
  name?: string;
  source?: string;
  page?: number;
  srd?: boolean;
  basicRules?: boolean;
  data?: _Data;
}

export type _TagNameStats =
  | 'spell'
  | 'item'
  | 'itemMastery'
  | 'creature'
  | 'condition'
  | 'disease'
  | 'status'
  | 'background'
  | 'race'
  | 'optfeature'
  | 'reward'
  | 'feat'
  | 'psionic'
  | 'object'
  | 'cult'
  | 'boon'
  | 'trap'
  | 'hazard'
  | 'deity'
  | 'variantrule'
  | 'charoption'
  | 'vehicle'
  | 'vehupgrade'
  | 'class'
  | 'action'
  | 'language'
  | 'classFeature'
  | 'subclassFeature'
  | 'table'
  | 'recipe'
  | 'skill'
  | 'sense'
  | 'legroup'
  | 'deck'
  | 'card';

/**
 * END OF GENERICS SECTION
 */

export interface EntryWrapper extends BaseEntry {
  type: 'wrapper';
}

export interface EntryIngredient extends BaseEntry {
  type: 'ingredient';
  entry: Entry;
}

export interface EntryFlowBlock extends BaseEntry {
  type: 'flowBlock';
  entries?: Entry[];
}

export interface EntryFlowChart extends BaseEntry {
  type: 'flowchart';
  blocks: Entry[];
}

/**
 * START SPELLCASTING SECTION
 */

type _Spell = string | { entry: string; hidden: boolean };

interface _SpellcastingFrequency {
  '1'?: _Spell[];
  '2'?: _Spell[];
  '3'?: _Spell[];
  '4'?: _Spell[];
  '5'?: _Spell[];
  '6'?: _Spell[];
  '7'?: _Spell[];
  '8'?: _Spell[];
  '9'?: _Spell[];
  '9e'?: _Spell[];
  '8e'?: _Spell[];
  '7e'?: _Spell[];
  '6e'?: _Spell[];
  '5e'?: _Spell[];
  '4e'?: _Spell[];
  '3e'?: _Spell[];
  '2e'?: _Spell[];
  '1e'?: _Spell[];
}

interface _SpellcastingRecharge {
  '1'?: _Spell[];
  '2'?: _Spell[];
  '3'?: _Spell[];
  '4'?: _Spell[];
  '5'?: _Spell[];
  '6'?: _Spell[];
}

interface _SpellcastingLevel1To9 {
  spells: string[];
  lower?: number;
  slots?: number;
}

interface _SpellcastingSpells {
  '0'?: { spells: string[] };
  '1'?: _SpellcastingLevel1To9;
  '2'?: _SpellcastingLevel1To9;
  '3'?: _SpellcastingLevel1To9;
  '4'?: _SpellcastingLevel1To9;
  '5'?: _SpellcastingLevel1To9;
  '6'?: _SpellcastingLevel1To9;
  '7'?: _SpellcastingLevel1To9;
  '8'?: _SpellcastingLevel1To9;
  '9'?: _SpellcastingLevel1To9;
}

export interface EntrySpellcasting extends BaseEntry {
  type: 'spellcasting';
  name: string;
  headerEntries?: Entry[];
  footerEntries?: Entry[];
  constant?: _Spell[];
  will?: _Spell[];
  ritual?: _Spell[];
  rest?: _SpellcastingFrequency;
  daily?: _SpellcastingFrequency;
  weekly?: _SpellcastingFrequency;
  monthly?: _SpellcastingFrequency;
  yearly?: _SpellcastingFrequency;
  charges?: _SpellcastingFrequency;
  recharge?: _SpellcastingRecharge;
  spells?: _SpellcastingSpells;
  hidden?: Array<
    | 'constant'
    | 'will'
    | 'rest'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'ritual'
    | 'spells'
    | 'charges'
    | 'recharge'
  >;
  ability?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  displayAs?: 'trait' | 'action' | 'bonus' | 'reaction';
  chargeItems?: string;
}

/**
 * END OF SPELLCASTING SECTION
 */

export interface EntryHr {
  type: 'hr';
}

export interface EntryRefOptionalFeature {
  type: 'refOptionalfeature';
  optionalfeature: string;
  name?: string;
}

export interface EntryRefSubclassFeature {
  type: 'refSubclassFeature';
  subclassFeature: string;
}

export interface EntryRefClassFeature {
  type: 'refSubclassFeature';
  classFeature: string;
}

export interface EntryTagStatblock extends BaseEntry {
  type: 'statblock';
  tag: _TagNameStats;
  name: string;
  displayName?: string;
  hash?: string;
  style?: _EntryDataStyle;
  collapsed?: true;
}

export interface EntrySubclassStatblock extends BaseEntry {
  type: 'statblock';
  prop: 'subclass';
  name: string;
  source: string;
  displayName?: string;
  hash?: string;
  style?: _EntryDataStyle;
  className?: string;
  classSource?: string;
  collapsed?: true;
}

export type EntryStatblock = EntryTagStatblock | EntrySubclassStatblock;

export interface EntryStatblockInlineMonster {
  type: 'statblockInline';
  dataType: 'monster';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Creature;
}

export interface EntryStatblockInlineLegendaryGroup {
  type: 'statblockInline';
  dataType: 'legendaryGroup';
  dependencies?: string[];
  style?: _EntryDataStyle;
  data?: LegendaryGroup;
  collapsed?: true;
}

export interface EntryStatblockInlineSpell {
  type: 'statblockInline';
  dataType: 'spell';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Spell;
}

export interface EntryStatblockInlineAction {
  type: 'statblockInline';
  dataType: 'action';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Action;
}

export interface EntryStatblockInlineItem {
  type: 'statblockInline';
  dataType: 'item';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Item;
}

export interface EntryStatblockInlineBackground {
  type: 'statblockInline';
  dataType: 'background';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Background;
}

export interface EntryStatblockInlineCharCreationOption {
  type: 'statblockInline';
  dataType: 'charoption';
  dependencies?: string[];
  style?: _EntryDataStyle;
  data?: CharCreationOption;
  collapsed?: true;
}

export interface EntryStatblockInlineCondition {
  type: 'statblockInline';
  dataType: 'condition';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Condition;
}

export interface EntryStatblockInlineDisease {
  type: 'statblockInline';
  dataType: 'disease';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Disease;
}

export interface EntryStatblockInlineCult {
  type: 'statblockInline';
  dataType: 'cult';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Cult;
}

export interface EntryStatblockInlineBoon {
  type: 'statblockInline';
  dataType: 'boon';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Boon;
}

export interface EntryStatblockInlineDeity {
  type: 'statblockInline';
  dataType: 'deity';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Deity;
}

export interface EntryStatblockInlineFeat {
  type: 'statblockInline';
  dataType: 'feat';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Feat;
}

export interface EntryStatblockInlineLanguage {
  type: 'statblockInline';
  dataType: 'language';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Language;
}

export interface EntryStatblockInlineObject {
  type: 'statblockInline';
  dataType: 'object';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Object;
}

export interface EntryStatblockInlineOptionalFeature {
  type: 'statblockInline';
  dataType: 'optionalfeature';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: OptionalFeature;
}

export interface EntryStatblockInlinePsionic {
  type: 'statblockInline';
  dataType: 'psionic';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Psionic;
}

export interface EntryStatblockInlineRace {
  type: 'statblockInline';
  dataType: 'race';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Race;
}

export interface EntryStatblockInlineRecipe {
  type: 'statblockInline';
  dataType: 'recipe';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Recipe;
}

export interface EntryStatblockInlineReward {
  type: 'statblockInline';
  dataType: 'reward';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Reward;
}

export interface EntryStatblockInlineTable {
  type: 'statblockInline';
  dataType: 'table';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Table;
}

export interface EntryStatblockInlineTrap {
  type: 'statblockInline';
  dataType: 'trap';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Trap;
}

export interface EntryStatblockInlineHazard {
  type: 'statblockInline';
  dataType: 'hazard';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Hazard;
}

export interface EntryStatblockInlineVariantRule {
  type: 'statblockInline';
  dataType: 'variantrule';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: VariantRule;
}

export interface EntryStatblockInlineVehicle {
  type: 'statblockInline';
  dataType: 'vehicle';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Vehicle;
}

export interface EntryStatblockInlineVehicleUpgrade {
  type: 'statblockInline';
  dataType: 'vehicleUpgrade';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: VehicleUpgrade;
}

export interface EntryStatblockInlineVehicleUpgrade {
  type: 'statblockInline';
  dataType: 'vehicleUpgrade';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: VehicleUpgrade;
}

export interface EntryStatblockInlineSkill {
  type: 'statblockInline';
  dataType: 'skill';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Skill;
}

export interface EntryStatblockInlineSense {
  type: 'statblockInline';
  dataType: 'sense';
  dependencies?: string[];
  style?: _EntryDataStyle;
  collapsed?: true;
  data?: Sense;
}

export type EntryStatblockInline =
  | EntryStatblockInlineMonster
  | EntryStatblockInlineLegendaryGroup
  | EntryStatblockInlineSpell
  | EntryStatblockInlineAction
  | EntryStatblockInlineItem
  | EntryStatblockInlineBackground
  | EntryStatblockInlineCharCreationOption
  | EntryStatblockInlineCondition
  | EntryStatblockInlineDisease
  | EntryStatblockInlineCult
  | EntryStatblockInlineBoon
  | EntryStatblockInlineDeity
  | EntryStatblockInlineFeat
  | EntryStatblockInlineLanguage
  | EntryStatblockInlineObject
  | EntryStatblockInlineOptionalFeature
  | EntryStatblockInlinePsionic
  | EntryStatblockInlineRace
  | EntryStatblockInlineRecipe
  | EntryStatblockInlineReward
  | EntryStatblockInlineTable
  | EntryStatblockInlineTrap
  | EntryStatblockInlineHazard
  | EntryStatblockInlineVariantRule
  | EntryStatblockInlineVehicle
  | EntryStatblockInlineVehicleUpgrade
  | EntryStatblockInlineSkill
  | EntryStatblockInlineSense;

export interface EntryAttack extends BaseEntry {
  type: 'attack';
  attackType: 'MW' | 'RW';
  attackEntries: Entry[];
  hitEntries: Entry[];
}

export interface EntryActions extends BaseEntry {
  type: 'actions';
  name: string;
  entries: Entry[];
}

export interface EntryGallery extends BaseEntry {
  type: 'gallery';
  images: EntryImage[];
}

export interface EntryImage extends BaseEntry {
  type: 'image';
  href: MediaHref;
  hrefThumbnail?: MediaHref;
  title?: string;
  credit?: string;
  altText?: string;
  imageType?: 'map' | 'mapPlayer';
  grid?: {
    type?: 'none' | 'square' | 'hexRowsOdd' | 'hexRowsEven' | 'hexColsOdd' | 'hexColsEven';
    units?: 'feet' | 'yards' | 'miles' | 'meters' | 'kilometers';
    size?: number;
    offsetX?: number;
    offsetY?: number;
    scale?: number;
    distance?: number;
  };
  mapRegions?: Array<{
    area?: string;
    points?: Array<[number, number]>;
  }>;
  mapParent?: {
    id?: string;
    offsetX?: number;
    offsetY?: number;
    scaleX?: number;
    scaleY?: number;
    autoScale?: boolean;
  };
  mapName?: string;
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  maxWidthUnits?: string;
  maxHeightUnits?: string;
  style?: 'comic-speaker-left' | 'comic-speaker-right' | 'deity-symbol';
}

export interface EntryItemSpell extends BaseEntry {
  type: 'itemSpell';
  name: string;
  entry: Entry;
}

export interface EntryItemSub extends BaseEntry {
  type: 'itemSub';
  name: string;
  entry: Entry;
  nameDot?: false;
}

export interface EntryItem extends BaseEntry {
  type: 'item';
  nameDot?: false;
  entry?: Entry;
  entries?: Entry[];
  style?: string;
}

export interface EntryVariantSub extends BaseEntry {
  type: 'variantSub';
  name: string;
  entries: Entry[];
}

export interface EntryVariantInner extends BaseEntry {
  type: 'variantInner';
  name: string;
  entries: Entry[];
}

export interface EntryVariant extends BaseEntry {
  type: 'variant';
  name: string;
  entries: Entry[];
}

export interface EntryInsetReadaloud extends BaseEntry {
  type: 'insetReadaloud';
  entries: Entry[];
  style?: string;
}

export interface EntryInset extends BaseEntry {
  type: 'inset';
  entries: Entry[];
  style?: string;
}

export interface EntryOptFeature extends BaseEntry {
  type: 'optfeature';
  name: string;
  entries?: Entry[];
  prerequisite?: string;
}

export interface SubhashWithValue {
  key: string;
  value: string;
  preEncoded?: boolean;
}

export interface SubhashWithValues {
  key: string;
  values: string[];
  preEncoded?: boolean;
}

export type Subhash = SubhashWithValue | SubhashWithValues;

export interface HrefInteral {
  type: 'internal';
  path: string;
  hash?: string;
  hashPreEncoded?: boolean;
  subhashes?: Subhash[];
  hover?: {
    source: string;
    page: string;
    hash?: string;
    hashPreEncoded?: boolean;
  };
}

export type Href = HrefInteral | MediaHrefExternal;

export interface EntryLink extends BaseEntry {
  type: 'link';
  text: string;
  href: Href;
}

export interface EntryAbilityGeneric extends BaseEntry {
  type: 'abilityGeneric';
  text: string;
  attributes?: Array<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'>;
}

export interface EntryAbilityAttackMod extends BaseEntry {
  type: 'abilityAttackMod';
  name: string;
  attributes: Array<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' | 'spellcasting'>;
}

export interface EntryAbilityDc extends BaseEntry {
  type: 'abilityDc';
  name: string;
  attributes: Array<'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' | 'spellcasting'>;
}

export interface EntryDice extends BaseEntry {
  type: 'string';
  rollable?: boolean;
  toRoll?: {
    number: number;
    faces: number;
    modifier?: number;
    hideModifier?: boolean;
  };
}

export interface EntryBonusSpeed extends BaseEntry {
  type: 'bonusSpeed';
  value: number;
}

export interface EntryBonus extends BaseEntry {
  type: 'bonus';
  value: string;
}

export interface EntryList extends BaseEntry {
  type: 'list';
  items?: Entry[];
  columns?: number;
  start?: number;
  style?:
    | 'list-decimal'
    | 'list-hang'
    | 'list-hang-notitle'
    | 'list-lower-roman'
    | 'list-upper-roman'
    | 'list-name'
    | 'list-no-bullets';
}

export interface RollMinMax {
  min: number;
  max: number;
  pad?: number;
}

export interface RollExact {
  exact: number;
  pad?: number;
}

export type Roll = RollMinMax | RollExact;

export interface EntryTableCell extends BaseEntry {
  type: 'cell';
  width?: number;
  roll?: Roll;
}

export interface EntryTableRow extends BaseEntry {
  type: 'row';
  row: Entry[];
  style?: string;
}

export interface EntryTableGroup extends BaseEntry {
  type: 'tableGroup';
  tables: EntryTable[];
}

export type TableRow = Entry[] | EntryTableRow;

export interface EntryTableBase extends BaseEntry {
  caption?: string;
  isStriped?: boolean;
  isNameGenerator?: boolean;
  style?: string;
  colLabels?: string[];
  colLabelGroups?: { colLabels?: string[] }[];
  colStyles?: string[];
  rowLabels?: string[];
  rowStyles?: string[];
  rows: TableRow[];
  footnotes?: Entry[];

  // homebrew specific
  intro?: Entry[];
  outro?: Entry[];
}

export interface EntryTable extends EntryTableBase {
  type: 'table';
}

export interface EntryOptions extends BaseEntry {
  type: 'options';
  entries: Entry[];
  count?: number;
  style?: string;
}

export interface EntryInlineBlock extends BaseEntry {
  type: 'inlineBlock';
  entries: Entry[];
}

export interface EntryInline extends BaseEntry {
  type: 'inline';
  entries: Entry[];
}

export interface EntryQuote extends BaseEntry {
  type: 'quote';
  entries: Entry[];
  by?: string | string[];
  from?: string;
  skipMarks?: boolean;
  skipItalics?: boolean;
  style?: 'quote-pull';
}

export interface EntryHomebrew extends BaseEntry {
  type: 'homebrew';
  entries?: Entry[];
  moveTo?: Entry;
  oldEntries?: Entry[];
}

export interface EntryEntries extends BaseEntry {
  type: 'entries';
  entries: Entry[];
  alias?: string[];
  style?: string;
}

export interface EntrySection extends BaseEntry {
  type: 'section';
  entries: Entry[];
  alias?: string[];
  style?: string;
}

export type Entry =
  | string
  | number
  | EntryWrapper
  | EntryIngredient
  | EntryFlowBlock
  | EntryFlowChart
  | EntrySpellcasting
  | EntryHr
  | EntryRefOptionalFeature
  | EntryRefSubclassFeature
  | EntryRefClassFeature
  | EntryStatblock
  | EntryStatblockInline
  | EntryAttack
  | EntryActions
  | EntryGallery
  | EntryImage
  | EntryItemSpell
  | EntryItemSub
  | EntryItem
  | EntryVariantSub
  | EntryVariantInner
  | EntryVariant
  | EntryInsetReadaloud
  | EntryInset
  | EntryOptFeature
  | EntryLink
  | EntryAbilityGeneric
  | EntryAbilityAttackMod
  | EntryAbilityDc
  | EntryDice
  | EntryBonusSpeed
  | EntryBonus
  | EntryList
  | EntryTableCell
  | EntryTableRow
  | EntryTableGroup
  | EntryTable
  | EntryOptions
  | EntryInlineBlock
  | EntryInline
  | EntryQuote
  | EntryHomebrew
  | EntryEntries
  | EntrySection;
