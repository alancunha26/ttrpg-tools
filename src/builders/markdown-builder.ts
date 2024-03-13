import { Context, CopyEntity, Entity, Entry, FluffEntity, ImageEntry } from '../types';

export const MarkdownBuilder = (context: Context) => {
  const { options } = context;
  const { config } = options;
  const {} = config;

  function textToMarkdown(text: string): string {
    return `\n\n${text}`;
  }

  function entriesToMarkdown(entries?: Entry[], level = 2): string {
    let output = '';
    const heading = Array(level).fill('#').join('');

    entries?.forEach(entry => {
      if (typeof entry === 'string') {
        output += textToMarkdown(entry);
        return;
      }

      if (entry.type === 'entries') {
        if (entry.name) output += `\n\n${heading} ${entry.name}`;
        output += entriesToMarkdown(entry.entries, level + 1);
        return;
      }
    });

    return output;
  }

  function copyToMarkdown(entity: CopyEntity): string {
    let output = '';
    return output;
  }

  function imagesToMarkdown(images: FluffEntity['images']): string {
    const baseUrl = 'https://5e.tools/img';
    let output = '';

    if (images instanceof Array) {
      images.forEach(img => {
        const url = `${baseUrl}/${img.href}`;
        output += `\n\n![${img.title}](${url})`;
      });
    } else if (images?.item) {
      const url = `${baseUrl}/${images.item.href}`;
      output += `\n\n![${images.item.title}](${url})`;
    }

    return output;
  }

  function fluffToMarkdown(fluff: FluffEntity): string {
    let output = '';

    if (fluff.images) {
      output += imagesToMarkdown(fluff.images);
    }

    if (fluff.entries) {
      output += entriesToMarkdown(fluff.entries);
    }

    if (fluff._copy) {
      output += copyToMarkdown(fluff._copy);
    }

    return output;
  }

  return function entityToMarkdown(entity: Entity, fluff?: FluffEntity): string {
    let output = '';

    if (fluff) {
      output += fluffToMarkdown(fluff);
    }

    if (entity._copy) {
      output += copyToMarkdown(entity);
    }

    if (entity.entries) {
      output += entriesToMarkdown(entity.entries);
    }

    return output;
  };
};
