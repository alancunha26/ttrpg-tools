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

export interface CopyModifier {
  // TODO: finish this
}

export interface ModObject {
  [key: string]: string | CopyModifier | CopyModifier[];
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
