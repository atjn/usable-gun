import __import_node_fs from "node:fs";
import __import_node_path from "node:path";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	const __usable_dirname =
		__usable_environment.environmentHint !== "server"
			? undefined
			: decodeURI(new URL(".", import.meta.url).pathname);

	/* BEGIN WRAPPED GUN CODE */

	var fs = __import_node_fs;
	__usable_module.exports = function rm(path, full) {
		path = full || __import_node_path.join(__usable_dirname + "/../", path);
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
