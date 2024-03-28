import {
  Copy,
  LanguageProficiency,
  Prerequisite,
  SkillProficiency,
  SkillToolLanguageProficiency,
  StartingEquipment,
  ToolProficiency,
  WeaponProficiency
} from '../types';
import { Entry, ArrEntry, ImageEntry } from './entry';
import { Source, SourceCode } from './sources';

export interface BackgroundFluff {
  name: string;
  source: SourceCode;
  entries?: Entry[];
  images?: { item: ImageEntry } | ImageEntry[];
  _copy?: Copy;
}

export interface Background {
  name: string;
  source: SourceCode;
  page?: number;
  srd?: boolean;
  basicRules?: boolean;
  skillProficiencies?: SkillProficiency[];
  languageProficiencies?: LanguageProficiency[];
  startingEquipment?: StartingEquipment[];
  toolProficiencies?: ToolProficiency[];
  weaponProficiencies?: WeaponProficiency[];
  skillToolLanguageProficiencies?: SkillToolLanguageProficiency[];
  entries?: Entry[];
  hasFluff?: boolean;
  hasFluffImages?: boolean;
  feats?: Array<{ [key: string]: boolean } & { any: number }>;
  additionalSpells?: any[];
  additionalSources?: Source[];
  prerequisite?: Prerequisite[];
  otherSources?: Source[];
  fromFeature?: {
    feats: boolean;
    additionalSpells?: boolean;
  };
  _copy?: {
    name: string;
    source: string;
    _mod?: { entries?: ArrEntry | ArrEntry[] };
  };
}
