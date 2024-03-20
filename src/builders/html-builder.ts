import { Context, Entity, Entry, FluffEntity } from '../types';

// TODO: write the html builder just like the MarkdownBuilder
export const HtmlBuilder = (context: Context) => {
  const { options } = context;
  const { config } = options;

  function entryToHtml(entry: Entry): string {
    return '';
  }

  function entriesToHtml(entries: Entry[]): string {
    return '';
  }

  function entityToHtml(entity: Entity, fluff?: FluffEntity): string {
    return '';
  }

  return {
    entryToHtml,
    entriesToHtml,
    entityToHtml
  };
};
