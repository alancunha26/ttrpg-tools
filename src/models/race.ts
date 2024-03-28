import { Ability, LanguageProficiency, Size, SkillProficiency, Speed, WeaponProficiency } from '../types';
import { ExternalLink, InternalLink } from './entry';

export interface RaceEntity {
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

export interface SubraceEntity {
  // General
  raceName: string;
  raceSource: string;

  // Overwrites
  speed?: Speed;
  ability?: RaceAbility[];
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
}
