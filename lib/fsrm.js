import __import_node_fs from "node:fs";
import __import_node_path from "node:path";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	const __usable_globalThis = new Proxy(
		"window" in globalThis ? window : globalThis,
		{
			get(target, property) {
				if (["window", "globalThis", "global"].includes(property)) {
					return __usable_globalThis;
				} else if (__usable_environment.library[property] !== undefined) {
					return __usable_environment.library[property];
				} else if ("window" in globalThis) {
					return window[property];
				} else {
					return globalThis[property];
				}
			},
			set(object, property, value) {
				__usable_environment.library[property] = value;
				return true;
			},
		},
	);
	/* BEGIN WRAPPED GUN CODE */

	var fs = __import_node_fs;
	var dir = __usable_globalThis.__dirname + "/../";
	__usable_module.exports = function rm(path, full) {
		path = full || __import_node_path.join(dir, path);
		if (!fs.existsSync(path)) {
			return;
		}
		fs.readdirSync(path).forEach((file, index) => {
			var curPath = path + "/" + file;
			if (fs.lstatSync(curPath).isDirectory()) {
				// recurse
				rm(null, curPath);
			} else {
				// delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	};
	__usable_environment.exports.lib.fsrm = __usable_module.exports;
	return __usable_module.exports;
}
