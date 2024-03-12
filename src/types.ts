export interface Entities {
  monsters?: string;
  classes?: string;
  subclasses?: string;
  races?: string;
  subraces?: string;
  variants?: string;
  equipment?: string;
  items?: string;
  spells?: string;
  backgrounds?: string;
  transports?: string;
  rewards?: string;
  feats?: string;
  objects?: string;
  traps?: string;
  psionics?: string;
  'optional-features'?: string;
}

export interface Config {
  absolutePath: string;
  linkStyle: 'wikilink' | 'markdown';
  sources: string[];
  exclude?: string[];
  templates: Entities;
}
