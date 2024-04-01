import { SourceCode } from './sources';
import { Entry } from './entry';

export type EntityType =
  | 'sources'
  | 'monsters'
  | 'classes'
  | 'subclasses'
  | 'races'
  | 'subraces'
  | 'items'
  | 'spells'
  | 'backgrounds'
  | 'rewards'
  | 'feats'
  | 'pisionics'
  | 'renderdemo'
  | 'optional-features'
  | 'actions'
  | 'diseases'
  | 'conditions'
  | 'senses'
  | 'skills'
  | 'variant-rules';

export interface Entity {
  name: string;
  source: SourceCode;
  type: EntityType;
  srd: boolean;
  entries: Entry[];
  page?: number;
}
