import { Entry } from './entry';
import { SourceCode } from './sources';

export interface ItemProperty {
  abbreviation: string;
  source: SourceCode;
  page: number;
  entries?: Entry[];
  template?: string;
  entriesTemplate?: Entry[];
  name?: string;
}

export interface ItemTypeEntity {
  abbreviation: string;
  entriesTemplate?: string[];
  entries?: Entry[];
  _copy?: {
    source: SourceCode;
    abbreviation: string;
  };
}

export interface ItemTypeAdditionalEntry {
  appliesTo: string;
}

export interface ItemEntryEntity {
  entriesTemplate: Entry[];
}

export interface BaseItemEntity {
  rarity: string;
  weight?: number;
  weaponCategory?: 'martial' | 'simple';
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

export interface ItemEntity {}

export interface MagicVariantEntity {}
