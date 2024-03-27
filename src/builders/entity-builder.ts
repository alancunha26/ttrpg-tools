import fs from 'fs';
import path from 'path';
import moment from 'moment';
import Handlebars from 'handlebars';
import { Context, Entity } from '../types';
import { MarkdownBuilder } from './markdown-builder';
import { SOURCES } from '../models/sources';

export const EntityBuilder = (context: Context) => {
  const { type, config, helpers: _ } = context;
  const markdownBuilder = MarkdownBuilder(context);

  if (!type) {
    throw new Error('Type of build not defined');
  }

  if (type === 'sources') {
    throw new Error('EntityType.sources is not implemented');
  }

  return async (entity: Entity) => {
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
      body: markdownBuilder.entityToMarkdown(entity)
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
