import { Ability, Copy, LanguageProficiency, Size, SkillProficiency, Speed, WeaponProficiency } from '../types';
import { Entry, ExternalLink, InternalLink } from './entry';
import { SourceCode } from './sources';

export interface Race {
  name: string;
  source: SourceCode;
  page?: number;
  srd?: boolean;
  basicRules?: boolean;
  entries?: Entry[];

  speed: Speed;
  ability: Ability[];
  traitTags: string[];
  size: Size | Size[];
  skillProficiencies?: SkillProficiency[];
  languageProficiencies?: LanguageProficiency[];
  weaponProficiencies?: WeaponProficiency[];
  soundClip?: string | InternalLink['href'] | ExternalLink['href'];
  feats?: Array<{ [key: string]: boolean } & { any: number }>;
  age?: { mature?: number; max: number };
  darkvision?: number;
  alias?: string[];
}

export interface Subrace {
  name: string;
  source: SourceCode;
  page?: number;
  srd?: boolean;
  basicRules?: boolean;
  entries?: Entry[];

  // General
  raceName: string;
  raceSource: string;

  // Overwrites
  speed?: Speed;
  ability?: Ability[];
  traitTags?: string[];
  size?: Size | Size[];
  skillProficiencies?: SkillProficiency[];
  languageProficiencies?: LanguageProficiency[];
  weaponProficiencies?: WeaponProficiency[];
  soundClip?: string | InternalLink['href'] | ExternalLink['href'];
  feats?: Array<{ [key: string]: boolean } & { any: number }>;
  age?: { mature?: number; max: number };
  darkvision?: number;
  alias?: string[];
  hasFluff?: boolean;
  hasFluffImages?: boolean;
  _copy?: Copy;
}

export interface RacesFile {
  race: Race[];
  subrace: Subrace[];
}
