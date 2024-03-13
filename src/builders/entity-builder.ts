import fs from 'fs';
import path from 'path';
import moment from 'moment';
import Handlebars from 'handlebars';
import { Context, Entity } from '../types';
import { MarkdownBuilder } from './markdown-builder';
import { sources } from '../sources';

export const EntityBuilder = (context: Context) => {
  const { options, fluffs, type } = context;
  const { config, helpers: _ } = options;

  if (type === 'sources') {
    throw new Error('EntityType.sources is not implemented');
  }

  const entityToMarkdown = MarkdownBuilder(context);
  return async (entity: Entity) => {
    const fluff = _.findFluff(entity, fluffs);
    const entityName = entity.name.replace('Variant ', '');
    const filepath = _.getFilePath(entityName, type);

    const templatePath = path.resolve(process.cwd(), config.templates[type]!);
    const templateFile = fs.readFileSync(templatePath);
    const template = Handlebars.compile(templateFile.toString(), { noEscape: true });

    const data = {
      title: entityName,
      page: entity.page,
      source: sources.find(source => source.code === entity.source)!,
      created: moment().format('YYYY-DD-MM'),
      srd: entity.srd ? 'true' : 'false',
      body: entityToMarkdown(entity, fluff)
    };

    return {
      data,
      file: filepath,

      async import(extraData: { [key: string]: any } = {}): Promise<void> {
        const content = template({ ...data, ...extraData }, { helpers: _.handlebars });
        console.log(content);
      }
    };
  };
};