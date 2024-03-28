import { DataBuilder } from './builders/data-builder';
import { SourceCode } from './models/sources';
import { helpers } from './helpers';
import { EntityType } from './models/entity';
import { ArrEntry } from './models/entry';

export type Paths = {
  [key in EntityType]: string;
};

export interface Config {
  sourcesPath: string;
  linkStyle: 'wikilink' | 'markdown';
  templates: Paths;
  paths: Paths;
  imageWidth: number;
  sources: SourceCode[];
  identation: number;
  useHtmlTags: boolean;
  useDiceRoller: boolean;
  alwaysIncreaseHeadingLevel: boolean;
}

export interface Context {
  output: string;
  data: ReturnType<typeof DataBuilder>;
  helpers: ReturnType<typeof helpers>;
  config: Config;
  type?: EntityType;
}

export type SkillProficiency = { [key: string]: boolean } & {
  choose?: { from: string[]; count: number };
  any?: number;
};

export type WeaponProficiency = { [key: string]: boolean } & {
  choose?: { from?: string[]; fromFilter?: string; count: number };
};

export type ToolProficiency = { [key: string]: boolean } & {
  choose?: { from: string[]; count: number };
  anyMusicalInstrument?: number;
  anyArtisansTool?: number;
  any?: number;
};

export type LanguageProficiency = { [key: string]: boolean } & {
  choose?: { from: string[]; count: number };
  anyStandard?: number;
  anyExotic?: number;
  any?: number;
};

export type SkillToolLanguageProficiency = { anyTool?: boolean; anyLanguage?: boolean; anySkill?: boolean } & {
  choose?: {
    from: Array<'anyTool' | 'anyLanguage' | 'anySkill'>;
    count?: number;
  };
};

export type StartingEquipment = {
  [key: string]:
    | string
    | {
        item?: string;
        displayName?: string;
        special?: string;
        quantity?: number;
        containsValue?: number;
        equipmentType?: string;
        worthValue?: number;
        value?: number;
      };
};

export type Speed =
  | number
  | {
      walk: number;
      climb?: number | boolean;
      fly?: number | boolean;
      swim?: number | boolean;
      burrow?: number | boolean;
    };

export type Size = 'T' | 'S' | 'M' | 'L' | 'H' | 'G' | 'V';

export interface Prerequisite {
  ability?: { [key: string]: string }[];
  pact?: 'Chain' | 'Tome' | 'Blade' | 'Talisman';
  patron?: string;
  spell?: string[];
  feature?: string[];
  feat?: string[];
  spellcasting?: boolean;
  spellcastingFeature?: boolean;
  psionics?: boolean;
  other?: string;
  otherSummary?: {
    entry: string;
    entrySummary: string;
  };
  proficiency: {
    weapon?: 'simpe' | 'martial';
    armor?: 'light' | 'medium' | 'heavy';
  };
  item?: string[];
  level?:
    | number
    | {
        level: number;
        class: { name: string; source?: SourceCode; visible: boolean };
        subclass: { name: string; source?: SourceCode; visible: boolean };
      };
  race?: {
    name: string;
    subrace?: string;
    displayEntry?: string;
  }[];
}

export type Ability = { [key: string]: boolean } & {
  choose?: {
    from: string[];
    count?: number;
    amount?: number;
    weights?: number[];
  };
};

export interface Copy {
  name: string;
  source: string;
  _mod?: { entries?: ArrEntry | ArrEntry[] };
}

export interface AbbreviationCopy {
  source: string;
  abbreviation: string;
  _mod?: { entries?: ArrEntry | ArrEntry[] };
}
