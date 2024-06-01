import { Entry } from './entry';
import { CopyBlockGeneric, LanguageProficiencies, SkillProficiencies, ToolProficiency } from './util';

export interface BackgroundFile {
  background: Background[];
}

export interface BackgroundData {
  name: string;
  source: string;
  page?: number;
  entries: Entry[];
  prerequisite?: string;
  skillProficiencies: SkillProficiencies;
  languageProficiencies?: LanguageProficiencies;
  toolProficiency?: ToolProficiency;
}

export type BackgroundCopy = Partial<BackgroundData> & CopyBlockGeneric;

export type Background = BackgroundData | BackgroundCopy;
