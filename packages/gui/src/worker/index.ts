import { log } from './boot';

import.meta.glob('./services/**/*', { eager: true })

log.info('worker online')

