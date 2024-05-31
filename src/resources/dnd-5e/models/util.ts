import { Entry } from './entry';

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface MediaHrefInternal {
  type: 'internal';
  path: string;
}

export interface MediaHrefExternal {
  type: 'external';
  url: string;
}

export type MediaHref = MediaHrefInternal | MediaHrefExternal;

export interface ModReplaceTxt {
  mode: 'replaceTxt';
  replace: string;
  with: string;
  flags?: string;
  props?: Array<string | null>;
}

export interface ModReplaceName {
  mode: 'replaceName';
  replace: string;
  with: string;
  flags?: string;
}

export interface ModAppendStr {
  mode: 'appendStr';
  str: string;
  joiner?: string;
}

export interface ModPrependArr {
  mode: 'prependArr';
  items: Entry | Entry[];
}

export interface ModAppendArr {
  mode: 'appendArr';
  items: Entry | Entry[];
}

export interface ModAppendIfNotExistsArr {
  mode: 'appendIfNotExistsArr';
  items: Entry | Entry[];
}

export type ModReplace = string | { index: number } | { regex: string; flags?: string };

export interface ModReplaceArr {
  mode: 'replaceArr';
  items: Entry | Entry[];
  replace: ModReplace;
}

export interface ModReplaceOrAppendArr {
  mode: 'replaceOrAppendArr';
  items: Entry | Entry[];
  replace: ModReplace;
}

export interface ModInsertArr {
  mode: 'insertArr';
  items: Entry | Entry[];
  index: number;
}

export interface ModRemoveArr {
  mode: 'removeArr';
  items?: Entry | Entry[];
  names?: string | string[];
  force?: true;
}

export interface ModSetProp {
  mode: 'setProp';
  prop: string;
  // TODO: research and implement this, because 5etools-utils don't have this type
  value: any;
}

export interface ModCalculateProp {
  mode: 'calculateProp';
  prop: string;
  formula: string;
}

export interface SpellsBlock<T> {
  '1'?: T;
  '2'?: T;
  '3'?: T;
  '4'?: T;
  '5'?: T;
  '6'?: T;
  '7'?: T;
  '8'?: T;
  '9'?: T;
  '9e'?: T;
  '8e'?: T;
  '7e'?: T;
  '6e'?: T;
  '5e'?: T;
  '4e'?: T;
  '3e'?: T;
  '2e'?: T;
  '1e'?: T;
}

export interface ModReplaceSpells {
  mode: 'replaceSpells';
  spells?: SpellsBlock<{ replace: string; with: string }>;
  daily?: SpellsBlock<{ replace: string; with: string }>;
}

export interface ModRemoveSpells {
  mode: 'removeSpells';
  spells?: SpellsBlock<string[]>;
  daily?: SpellsBlock<string[]>;
}

// export interface ModAddSpells {
//   mode: 'addSpells';
//   spells:
// }

export type CopyMod =
  | ModReplaceTxt
  | ModReplaceName
  | ModAppendStr
  | ModPrependArr
  | ModAppendArr
  | ModAppendIfNotExistsArr
  | ModReplaceArr
  | ModReplaceOrAppendArr
  | ModInsertArr
  | ModRemoveArr
  | ModSetProp
  | ModCalculateProp
  | ModReplaceSpells
  | ModRemoveSpells;

export interface ModObject {
  [key: string]: string | CopyMod | CopyMod[];
}

export interface CopyBase {
  _mod?: ModObject;
  _templates?: { name: string; source: string }[];
  _preserve?: { [key: string]: true };
}

export interface CopyGeneric extends CopyBase {
  name: string;
  source: string;
  pantheon?: string;
  shortName?: string;
  className?: string;
  classSource?: string;
  raceName?: string;
  raceSource?: string;
}

export interface CopyBlockGeneric {
  _copy: CopyGeneric;
}
