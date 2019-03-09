import { getURL } from "../modules/module_www"
import { log, info, debug, error } from "../modules/module_log"
import { Time } from "../modules/module_utils"

export const checkUpdate = async function() {
	try {
		const registry = `https://registry.npmjs.org/younow-tools/latest`

		const local: Package = require("../../package.json")
		let current: Package = await getURL(registry)

		if (local.version < current.version) {

			error("#\n#\n#\n#\n#\n#\n#\n#")
			error(`A new version of ${current.name} is available ${current.version}`)

			if (current.version in current.changelog) {
				log((current.changelog[current.version] as any).join("\n"))
			}
			error(`Update with npm -g install ${current.name}`)
			error("#\n#\n#\n#\n#\n#\n#\n#")
		}
	}
	catch (err) {
		error("update fail", err)
	}
}
