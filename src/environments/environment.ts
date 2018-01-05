// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { MOCK_API } from '../config/api.config';
export const environment = {
  production: false,
  forexApi: 'https://forex.1forge.com/1.0.2/quotes?pairs=EURUSD,GBPUSD,AUDUSD,NOKUSD,JPYUSD,CHFUSD&api_key=9k06dL4KzHWa99GWiDgd9yx60r2wrgkh',
  host: 'http://localhost:'
};
