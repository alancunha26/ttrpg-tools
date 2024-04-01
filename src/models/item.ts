import { AbbreviationCopy } from '../types';
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

export interface ItemType {
  abbreviation: string;
  source: SourceCode;
  name?: string;
  entriesTemplate?: string[];
  _copy?: AbbreviationCopy;
  entries?: Entry[];
}

export interface ItemTypeAdditionalEntry {
  source: SourceCode;
  appliesTo: string;
  entries: Entry[];
}

export interface BaseItemEntry {
  name: string;
  source: SourceCode;
  entriesTemplate: Entry[];
}

export interface BaseItem {
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

export interface ItemsBaseFile {
  baseitem: BaseItem[];
  itemProperty: ItemProperty[];
  itemType: ItemType[];
  itemTypeAdditionalEntries: ItemTypeAdditionalEntry[];
  itemEntry: BaseItemEntry[];
}

// TODO: work on this
export interface ItemsFile {
  item: BaseItem[];
  itemGroup: BaseItem[];
}
