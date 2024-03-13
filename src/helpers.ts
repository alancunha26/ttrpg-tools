import fs from 'fs';
import path, { format } from 'path';
import { Entry, Config, Entity, FluffEntity, EntityType } from './types';

export const helpers = (config: Config, output: string) => {
  const { sources, linkStyle, paths } = config;

  function findAllEntryTypes(entries?: Entry[], types: string[] = []) {
    let append: string[] = [];

    entries?.forEach(entry => {
      if (typeof entry === 'string') {
        if (!types.includes('string')) types.push('string');
        return;
      }

      if (entry.type === 'entries' && entry.entries) {
        if (!types.includes('entries')) types.push('entries');
        append = findAllEntryTypes(entry.entries);
        return;
      }

      if (!types.includes(entry.type)) {
        types.push(entry.type);
      }
    });

    append.forEach(type => {
      if (!types.includes(type)) {
        types.push(type);
      }
    });

    return types;
  }

  function findFluff(entity: Entity, fluffEntities: FluffEntity[]) {
    return fluffEntities.find(
      fluff => entity.name === fluff.name && entity.source === fluff.source
    );
  }

  function filterBySources(entities: Entity[]) {
    return entities.filter(entity => sources.includes(entity.source));
  }

  function readJsonFile(path: string) {
    const raw = fs.readFileSync(path);
    return JSON.parse(raw.toString());
  }

  function getVaultPath(name: string, type: EntityType): string {
    return path.join(paths[type], name);
  }

  function getFilePath(name: string, type: EntityType): string {
    return path.resolve(process.cwd(), output, paths[type], `${name}.md`);
  }

  function formatLink(name: string, type: EntityType): string {
    const vaultPath = getVaultPath(name, type);
    return linkStyle === 'wikilink' ? `[[${vaultPath}]]` : `[${name}](/${vaultPath}.md)`;
  }

  return {
    findAllEntryTypes,
    findFluff,
    filterBySources,
    readJsonFile,
    getVaultPath,
    getFilePath,
    formatLink,

    handlebars: {
      formatLink
    }
  };
};
