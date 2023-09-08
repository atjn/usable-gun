import __import_node_fs from "node:fs";
import indexPlugin from "../index.js";
import __import_chokidar from "chokidar";
import __import_node_os from "node:os";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	const __usable_globalThis = new Proxy(
		"window" in globalThis ? window : globalThis,
		{
			get(target, property, receiver) {
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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	const fs = __import_node_fs;
	const Gun = indexPlugin(__usable_environment);
	const gun = Gun();
	let chokidar;
	try {
		chokidar = __import_chokidar;
	} catch (error) {} // Must install chokidar to use this feature.

	/**
	 * Watches a directory and send all its content in the database
	 * @constructor
	 * @param {string} what - Which directory hub should watch.
	 * @param {Object} options - https://gun.eco/docs/hub.js#options
	 */
	__usable_module.exports = {
		watch: function watch(what, options) {
			options = options ?? {
				msg: true,
				hubignore: false,
				alias: __import_node_os.userInfo().username,
			};
			options.msg = options.msg ?? true;
			options.hubignore = options.hubignore ?? false;
			options.alias = options.alias ?? __import_node_os.userInfo().username;
			let modifiedPath = options.alias;
			let watcher;
			try {
				if (options.hubignore) {
					watcher = chokidar.watch(what, {
						persistent: true,
					});
				} else if (!options.hubignore) {
					watcher = chokidar.watch(what, {
						ignored: /(^|[\/\\])\../,
						// ignore dotfiles
						persistent: true,
					});
				}
				const log = __usable_globalThis.debug.log.bind(
					__usable_globalThis.debug,
				);
				let hubignore;

				// Handle events !
				watcher
					.on("add", async (path) => {
						if (options.hubignore && path.includes(".hubignore")) {
							hubignore = fs.readFileSync(what + "/.hubignore", "utf-8");
						} else if (
							!path.includes(".hubignore") &&
							!hubignore?.includes(path.substring(path.lastIndexOf("/") + 1))
						) {
							if (options.msg) log(`File ${path} has been added`);
							if (path[path.search(/^./gm)] === "/" || ".") {
								gun
									.get("hub")
									.get(
										modifiedPath +
											path.split(__import_node_os.userInfo().username)[1],
									)
									.put(fs.readFileSync(path, "utf-8"));
							} else {
								gun
									.get("hub")
									.get(
										modifiedPath +
											"/" +
											path.split(__import_node_os.userInfo().username)[1],
									)
									.put(fs.readFileSync(path, "utf-8"));
							}
						} else {
							if (options.msg)
								log(`The addition of ${path} has been ignored !`);
						}
					})
					.on("change", async (path) => {
						if (options.hubignore && path.includes(".hubignore")) {
							hubignore = fs.readFileSync(what + "/.hubignore", "utf-8");
						} else if (
							!path.includes(".hubignore") &&
							!hubignore?.includes(path.substring(path.lastIndexOf("/") + 1))
						) {
							if (options.msg) log(`File ${path} has been changed`);
							if (path[path.search(/^./gm)] === "/" || ".") {
								gun
									.get("hub")
									.get(
										modifiedPath +
											path.split(__import_node_os.userInfo().username)[1],
									)
									.put(fs.readFileSync(path, "utf-8"));
							} else {
								gun
									.get("hub")
									.get(
										modifiedPath +
											"/" +
											path.split(__import_node_os.userInfo().username)[1],
									)
									.put(fs.readFileSync(path, "utf-8"));
							}
						} else {
							if (options.msg) log(`The changes on ${path} has been ignored.`);
						}
					})
					.on("unlink", async (path) => {
						if (options.hubignore && path.includes(".hubignore")) {
							hubignore = fs.readFileSync(what + "/.hubignore", "utf-8");
						} else if (
							!path.includes(".hubignore") &&
							!hubignore?.includes(path.substring(path.lastIndexOf("/") + 1))
						) {
							if (options.msg) log(`File ${path} has been removed`);
							if (path[path.search(/^./gm)] === "/" || ".") {
								gun
									.get("hub")
									.get(
										modifiedPath +
											path.split(__import_node_os.userInfo().username)[1],
									)
									.put(null);
							} else {
								gun
									.get("hub")
									.get(
										modifiedPath +
											"/" +
											path.split(__import_node_os.userInfo().username)[1],
									)
									.put(null);
							}
						} else {
							if (options.msg) log(`The deletion of ${path} has been ignored!`);
						}
					});
				if (options.msg) {
					watcher
						.on("addDir", (path) => log(`Directory ${path} has been added`))
						.on("unlinkDir", (path) =>
							log(`Directory ${path} has been removed`),
						)
						.on("error", (error) => log(`Watcher error: ${error}`))
						.on("ready", () => log("Initial scan complete. Ready for changes"));
				}
			} catch (err) {
				__usable_globalThis.debug.log(
					"If you want to use the hub feature, you must install `chokidar` by typing `npm i chokidar` in your terminal.",
				);
			}
		},
	};
	__usable_environment.exports.lib.hub = __usable_module.exports;
	return __usable_module.exports;
}
