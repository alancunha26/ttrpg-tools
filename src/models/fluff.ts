import { Copy } from '../types';
import { Entry, ImageEntry } from './entry';
import { SourceCode } from './sources';

export interface Fluff {
  name: string;
  source: SourceCode;
  entries?: Entry[];
  images?: { item: ImageEntry } | ImageEntry[];
  _copy?: Copy;
}
