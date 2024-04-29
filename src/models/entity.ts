import { SourceCode } from './sources';
import { Entry } from './entry';

export type EntityType =
  | 'sources'
  | 'renderdemo'
  | 'monsters'
  | 'classes'
  | 'races'
  | 'items'
  | 'spells'
  | 'backgrounds'
  | 'rewards'
  | 'feats'
  | 'optional-features'
  | 'rules'
  | 'variant-rules';

export interface Entity {
  name: string;
  source: SourceCode;
  type: EntityType;
  srd: boolean;
  entries: Entry[];
  page?: number;
}
