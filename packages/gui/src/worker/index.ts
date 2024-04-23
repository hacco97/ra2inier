import { useLogger } from './apis';
import { useObjectHandlers } from './services/object';
import { useProjectHandlers } from './services/project'

async function main() {
	useLogger().info('worker online')
	useObjectHandlers()
	useProjectHandlers()
}

main()