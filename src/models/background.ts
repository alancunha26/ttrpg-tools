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
import { Entry } from './entry';
import { Source, SourceCode } from './sources';

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
  _copy?: Copy;
  fromFeature?: {
    feats: boolean;
    additionalSpells?: boolean;
  };
}
