import fs from 'fs';
import path from 'path';
import moment from 'moment';
import Handlebars from 'handlebars';
import { Context, Entity } from '../types';
import { MarkdownBuilder } from './markdown-builder';
import { SOURCES } from '../models/sources';

export const EntityBuilder = (context: Context) => {
  const { options, fluffs, type } = context;
  const { config, helpers: _ } = options;

  if (type === 'sources') {
    throw new Error('EntityType.sources is not implemented');
  }

  const markdownBuilder = MarkdownBuilder(context);
  return async (entity: Entity) => {
    const fluff = _.findFluff(entity, fluffs);
    const entityName = entity.name.replace('Variant ', '');
    const filepath = _.getFilePath(entityName, type);
    const dirpath = _.getDirPath(type);

    const templatePath = path.resolve(process.cwd(), config.templates[type]!);
    const templateFile = fs.readFileSync(templatePath);
    const template = Handlebars.compile(templateFile.toString(), { noEscape: true });

    const data = {
      title: entityName,
      page: entity.page,
      source: SOURCES.find(source => source.code === entity.source)!,
      created: moment().format('YYYY-DD-MM'),
      srd: entity.srd ? 'true' : 'false',
      body: markdownBuilder.entityToMarkdown(entity, fluff)
    };

    return {
      data,
      file: filepath,

      async import(extraData: { [key: string]: any } = {}): Promise<void> {
        const content = template({ ...data, ...extraData }, { helpers: _.handlebars });

        if (!fs.existsSync(dirpath)) {
          fs.mkdirSync(dirpath, { recursive: true });
        }

        if (fs.existsSync(filepath)) {
          fs.rmSync(filepath);
        }

        fs.writeFileSync(filepath, content);
      }
    };
  };
};
