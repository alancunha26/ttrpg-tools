import {
  Ability,
  LanguageProficiency,
  Prerequisite,
  SkillProficiency,
  ToolProficiency,
  WeaponProficiency
} from '../types';

export interface Feat {
  ability?: Ability[];
  skillProficiencies?: SkillProficiency[];
  languageProficiencies?: LanguageProficiency[];
  weaponProficiencies?: WeaponProficiency[];
  toolProficiencies?: ToolProficiency[];
  prerequisite?: Prerequisite[];
  hasFluffImages?: boolean;
  hasFluff?: boolean;
}
