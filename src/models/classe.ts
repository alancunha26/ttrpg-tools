import { SkillProficiency, ToolProficiency } from '../types';
import { AttributeCode } from './attribute';
import { Entry, TableRow } from './entry';
import { SourceCode } from './sources';

interface ClassEntityProficiencies {
  armor?: Array<string | { proficiency: string | string[]; full?: string; optional?: boolean }>;
  weapons?: Array<string | { proficiency: string | string[]; full?: string; optional?: boolean }>;
  skills?: SkillProficiency[];
  tools?: ToolProficiency[];
}

export interface ClassEntity {
  // General
  proficiency: SourceCode[];
  startingProficiencies: ClassEntityProficiencies;
  classFeatures: Array<string | { classFeature: string; gainSubclassFeature: boolean }>;
  hd: {
    number: number;
    faces: number;
  };
  classTableGroups: {
    title: string;
    colLabels?: string[];
    rows: TableRow[];
  };
  multiclassing: {
    requirements: { [key: string]: number } & { or: Array<{ [key: string]: number }> };
    proficienciesGained: ClassEntityProficiencies;
  };
  startingEquipment: {
    default: string[];
    additionalFromBackground: boolean;
    goldAlternative: string;
  };

  // Optionals
  fluff?: Entry[];
  casterProgression?: 'full' | '1/2' | '1/3' | 'pact';
  spellcastingAbility?: AttributeCode;
  classSpells?: Array<string | { className: string; classSource: string }>;
  cantripProgression?: number[];
  spellsKnownProgression?: number[];
  preparedSpells?: string;
}

export interface ClassFeatureEntity {
  className: string;
  classSource: SourceCode;
  level: number;
}

export interface SubclassEntity {
  // General
  shortName: string;
  className: string;
  classSource: string;
  subclassFeatures: Array<string | { subclassFeature: string; gainSubclassFeature: boolean }>;

  // Optionals
  casterProgression?: 'full' | '1/2' | '1/3' | 'pact';
  spellcastingAbility?: AttributeCode;
  cantripProgression?: number[];
  spellsKnownProgression?: number[];
  preparedSpells?: string;
  subclassSpells?: Array<string | { className: string; classSource: string }>;
  subSubclassSpells?: { [key: string]: Array<string | { className: string; classSource: string }> };
}

export interface SubclassFeatureEntity {
  className: string;
  classSource: SourceCode;
  subclassShortName: string;
  subclassSource: SourceCode;
  level: number;
}
