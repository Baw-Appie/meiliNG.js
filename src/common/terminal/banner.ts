import config from '../../resources/config';
import { info as packageJson } from '../../resources/package';

import Figlet from 'figlet';
import chalk from 'chalk';
import { NodeEnvironment } from '../../interface';
import { Utils } from '..';

export const showBanner = (): void => {
  console.log(Figlet.textSync('Meiling', 'Small Slant'));
  console.log();
  console.log(`${chalk.bold('Meiling Gatekeeper')} - ${chalk.italic(`ver. ${packageJson.version}`)}`);
  console.log(chalk.cyan(chalk.underline(packageJson.repository)));
  console.log();
  console.log(`Copyright © Meiling Gatekeeper Contributors`);
  console.log(
    `Built with ${chalk.redBright('<3')} by ${chalk.cyan('Stella')} ${chalk.blue('IT')} ${chalk.magenta(
      'Inc.',
    )} OpenSource Team`,
  );
  console.log();
  console.log('Distributed under ' + licenseOutput());
  console.log();
};

export const licenseOutput = (): string => {
  if (Utils.detectLicense() === 'HRPL') {
    return chalk.bold('Hakurei Reimu Public License');
  } else if (Utils.detectLicense() === 'MIT') {
    return chalk.bold('MIT License');
  } else {
    return chalk.bold('Stella IT Internal License');
  }
};

export const devModeCheck = (): void => {
  if (config.node.environment === NodeEnvironment.Development) {
    console.log(
      chalk.yellow('Launching in Development mode, ') +
        chalk.bgYellowBright(chalk.black(chalk.bold(' DO NOT USE THIS IN PRODUCTION. '))),
    );
    console.log();
  }
};
