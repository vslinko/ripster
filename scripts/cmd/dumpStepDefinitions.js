import { uniq } from 'ramda';
import { join } from 'path';
import { rootDir, main, glob } from '../utils';

main(async () => {
  const definitionFiles = await glob(
    join(rootDir, 'features', 'step-definitions', '**', '*.js')
  );

  const defs = [];
  const world = {
    registerHandler() {},
    Given(regex) {
      defs.push(
        regex.toString()
          .replace(/^\/\^?/, '')
          .replace(/\$?\/[a-z]*$/, '')
          .replace(/\(\[\^\"\]\*\)/g, '%VAR%')
      );
    },
  };

  definitionFiles
    .forEach((file) => {
      require(file).call(world);
    });

  uniq(defs)
    .sort()
    .forEach((key) => {
      console.log(key); // eslint-disable-line no-console
    });
});
