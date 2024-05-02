import chalk from 'chalk';
import figlet from 'figlet';
import animation from 'chalk-animation';
import gradient from 'gradient-string';
import * as p from '@clack/prompts';
import * as u from './utils';
import { programs } from './programs';
import { System, systems } from './systems';

function intro(title: string) {
  return new Promise<string>(resolve => {
    figlet('TTRPG Tools', async (error, message) => {
      if (error) {
        console.error(error);
        return;
      }

      const rainbow = animation.rainbow(message!);

      await u.sleep();

      console.clear();

      rainbow.stop();
      resolve(title);
    });
  });
}

async function main() {
  console.clear();

  const title = await intro('TTRPG Tools');
  p.intro(gradient.pastel.multiline(title));

  const system = (await p.select({
    message: 'Pick the desired system',
    options: systems.map(o => ({ value: o.code, label: o.label }))
  })) as System;

  if (p.isCancel(system)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  const code = await p.select({
    message: 'Select the program you want to execute',
    options: programs[system]
      .filter(o => (o.dev ? process.env.NODE_ENV === 'development' : true))
      .map(o => ({ value: o.code, label: o.label }))
  });

  if (p.isCancel(system)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  const program = programs[system].find(o => o.code === code);
  program?.resolver();
}

main().catch(console.error);
