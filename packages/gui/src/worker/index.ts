import { log } from './apis';

import.meta.glob('./services/**/*', { eager: true })

log.info('worker online')
