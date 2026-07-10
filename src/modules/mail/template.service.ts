import { Injectable } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

@Injectable()
export class TemplateService {
  compile(templateName: string, data: Record<string, any>) {
    const filePath = path.join(
      process.cwd(),
      'src',
      'modules',
      'mail',
      'templates',
      `${templateName}.hbs`,
    );

    const source = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(source);

    return template(data);
  }
}
