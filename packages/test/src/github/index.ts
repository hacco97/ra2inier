import { Octokit } from "octokit";
import axios from 'axios'
import { createWriteStream, writeFileSync } from 'node:fs'

async function main() {
	const oct = new Octokit({
		userAgent: 'ra2inier/0.0.1',
	})

	const repo = {
		owner: 'ra2inier',
		repo: "debug-project",
	}

	// const res = await oct.rest.repos.listReleases({
	// 	owner: 'ra2inier',
	// 	repo: "debug-project"
	// })

	const res = await oct.rest.repos.createRelease({
		...repo,
		tag_name: "v1.0.2",
		body: 'api test01'
	})

	console.log(res)

	const data = await res.data
	writeFileSync('s.zip', JSON.stringify(data))
}


main()


const asset = `https://api.github.com/repos/ra2inier/debug-project/releases/152128702/assets`

async function download() {
	const res = await axios.get(asset, {
		responseType: 'stream',
		onDownloadProgress(progressEvent) {
			// console.log(progressEvent)
		},
	})
	const ws = createWriteStream('t.x')
	res.data.pipe(ws)
	console.log(await res.data)
}

// download()