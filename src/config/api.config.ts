import { environment } from '../environments/environment';
export const MOCK_API: string = (environment.production) ? environment.host : environment.host+4000;
