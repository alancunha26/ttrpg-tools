import { CopyBlockGeneric } from './util';

export interface BackgroundFile {
  background: Background[];
}

export interface BackgroundData {}

export type BackgroundCopy = BackgroundData & CopyBlockGeneric;

export type Background = BackgroundData | BackgroundCopy;
