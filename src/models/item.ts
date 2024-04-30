import { AbbreviationCopy } from '../types';
import { SourceCode } from './sources';
import { Entry } from './entry';

/**
 * ITEM TYPES
 */

export const ITEM_TYPES = [
  {
    code: 'A',
    name: 'ammunition'
  },
  {
    code: 'AF',
    name: 'ammunition'
  },
  {
    code: 'AT',
    name: "artisan's tools"
  },
  {
    code: 'EM',
    name: 'eldritch machine'
  },
  {
    code: 'EX',
    name: 'explosive'
  },
  {
    code: 'FD',
    name: 'food and drink'
  },
  {
    code: 'G',
    name: 'adventuring gear'
  },
  {
    code: 'GS',
    name: 'gaming set'
  },
  {
    code: 'IDG',
    name: 'illegal drug'
  },
  {
    code: 'INS',
    name: 'musical instrument'
  },
  {
    code: 'M',
    name: 'melee weapon'
  },
  {
    code: 'R',
    name: 'ranged weapon'
  },
  {
    code: 'LA',
    name: 'light armor'
  },
  {
    code: 'MA',
    name: 'medium armor'
  },
  {
    code: 'HA',
    name: 'heavy armor'
  },
  {
    code: 'SCF',
    name: 'sppellcasting focus'
  },
  {
    code: 'S',
    name: 'shield'
  },
  {
    code: 'MNT',
    name: 'mount'
  },
  {
    code: 'MR',
    name: 'master rune'
  },
  {
    code: 'GV',
    name: 'generic variant'
  },
  {
    code: 'P',
    name: 'potion'
  },
  {
    code: 'RD',
    name: 'rod'
  },
  {
    code: 'RG',
    name: 'ring'
  },
  {
    code: 'SC',
    name: 'scroll'
  },
  {
    code: 'OTH',
    name: 'other'
  },
  {
    code: 'T',
    name: 'tools'
  },
  {
    code: 'TAH',
    name: 'track and harness'
  },
  {
    code: 'TG',
    name: 'trade good'
  },
  {
    code: '$',
    name: 'treasure'
  },
  {
    code: '$A',
    name: 'treasure (art object)'
  },
  {
    code: '$C',
    name: 'treasure (coinage)'
  },
  {
    code: '$G',
    name: 'treasure (gemstone)'
  },
  {
    code: 'VEH',
    name: 'Vehicle (land)'
  },
  {
    code: 'SHP',
    name: 'Vehicle (water)'
  },
  {
    code: 'AIR',
    name: 'Vehicle (AIR)'
  },
  {
    code: 'SPC',
    name: 'Vehicle (space)'
  },
  {
    code: 'WD',
    name: 'wand'
  }
] as const;

export type ItemType = (typeof ITEM_TYPES)[number];
export type ItemTypeCode = ItemType['code'];
export type ItemTypeName = ItemType['name'];

/**
 * ITEM RARITIES
 */

export const ITEM_RARITIES = [
  'none',
  'common',
  'uncommon',
  'rare',
  'very rare',
  'legendary',
  'artifact',
  'varies',
  'unknown',
  'unknown (magic)'
] as const;

export type ItemRarity = (typeof ITEM_RARITIES)[number];

/**
 * WEAPON CATEGORIES
 */

export const WEAPON_CATEGORIES = ['simple', 'martial'];
export type WeaponCategory = (typeof WEAPON_CATEGORIES)[number];

/**
 * FILES INTERFACES
 */

export interface FileItemProperty {
  abbreviation: string;
  source: SourceCode;
  page: number;
  entries?: Entry[];
  template?: string;
  entriesTemplate?: Entry[];
  name?: string;
}

export interface FileItemType {
  abbreviation: string;
  source: SourceCode;
  name?: string;
  entriesTemplate?: string[];
  _copy?: AbbreviationCopy;
  entries?: Entry[];
}

export interface FileItemTypeAdditionalEntry {
  source: SourceCode;
  appliesTo: string;
  entries: Entry[];
}

export interface FileBaseItemEntry {
  name: string;
  source: SourceCode;
  entriesTemplate: Entry[];
}

export interface FileBaseItem {
  name: string;
  source: SourceCode;
  page: number;
  type: ItemTypeCode;
  rarity: ItemRarity;
  weaponCategory?: WeaponCategory;
  weight?: number;
  age?: string;
  property?: string[];
  range?: string;
  reload?: number;
  dmg1?: string;
  dmgType?: string;
  firearm?: boolean;
  weapon?: boolean;
  ammoType?: string;
  value?: number;
  arrow?: boolean;
  packContents?: {
    item: string;
    quantity: number;
  };
  dmg2?: string;
  axe?: boolean;
  needleBlowgun?: boolean;
  ac?: number;
  armor?: boolean;
  strength?: string;
  stealth?: boolean;
  club?: boolean;
  bolt?: boolean;
  scfType?: string;
  dagger?: boolean;
  sword?: boolean;
  polearm?: boolean;
  crossbow?: boolean;
  hasFluffImages?: boolean;
  hasFluff?: boolean;
  spear?: boolean;
  hammer?: boolean;
  bow?: boolean;
  mace?: boolean;
  net?: boolean;
  bulletSling?: boolean;
  staff?: boolean;
}

/**
 * FILES INTERFACES
 */

export interface ItemsBaseFile {
  baseitem: FileBaseItem[];
  itemProperty: FileItemProperty[];
  itemType: FileItemType[];
  itemTypeAdditionalEntries: FileItemTypeAdditionalEntry[];
  itemEntry: FileBaseItemEntry[];
}

export interface ItemsFile {
  item: FileBaseItem[];
  itemGroup: FileBaseItem[];
}

export interface MagicVariantsFile {}
