import { useLogger } from './apis';
import { useObjectHandlers } from './services/object';
import { useProjectHandlers } from './services/project'

async function main() {
	useLogger().info('worker线程就绪')
	useObjectHandlers()
	useProjectHandlers()
}

main()