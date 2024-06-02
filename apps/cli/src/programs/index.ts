import * as dnd5ePrograms from './dnd-5e';
import * as pf2ePrograms from './pf-2e';

export interface Program {
  code: string;
  label: string;
  resolver: () => void;
  dev?: boolean;
}

export const programs: { [key: string]: Program[] } = {
  dnd5e: [
    {
      code: 'converter',
      label: 'Markdown Converter',
      resolver: dnd5ePrograms.markdownConverter
    },
    {
      code: 'builder',
      label: 'Character Builder (TODO)',
      resolver: dnd5ePrograms.characterBuilder
    }
  ],
  pf2e: [
    {
      code: 'converter',
      label: 'Markdown Converter (TODO)',
      resolver: pf2ePrograms.markdownConverter
    },
    {
      code: 'builder',
      label: 'Character Builder (TODO)',
      resolver: pf2ePrograms.characterBuilder
    }
  ]
};
