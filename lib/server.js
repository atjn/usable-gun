import ysonPlugin from "./yson.js";
import gunPlugin from "../gun.js";
import servePlugin from "./serve.js";
import storePlugin from "./store.js";
import rfsPlugin from "./rfs.js";
import rs3Plugin from "./rs3.js";
import wirePlugin from "./wire.js";
import seaPlugin from "../sea.js";
import axePlugin from "../axe.js";
import multicastPlugin from "./multicast.js";
import statsPlugin from "./stats.js";
let __usable_isActivated = false;
const __usable_module = {};
export default async function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;

	/* BEGIN WRAPPED GUN CODE */

	await (async () => {
		ysonPlugin(__usable_environment);
		var Gun = gunPlugin(__usable_environment);
		Gun.serve = await servePlugin(__usable_environment);
		//process.env.GUN_ENV = process.env.GUN_ENV || 'debug';
		//console.LOG = {}; // only do this for dev.
		Gun.on("opt", function (root) {
			if (undefined === root.opt.super) {
				root.opt.super = true;
			}
			if (undefined === root.opt.faith) {
				root.opt.faith = true;
			} // HNPERF: This should probably be off, but we're testing performance improvements, please audit.
			root.opt.log = root.opt.log || Gun.log;
			this.to.next(root);
		});
		//require('../nts');
		storePlugin(__usable_environment);
		await rfsPlugin(__usable_environment);
		await rs3Plugin(__usable_environment);
		await wirePlugin(__usable_environment);
		try {
			seaPlugin(__usable_environment);
		} catch (e) {}
		try {
			axePlugin(__usable_environment);
		} catch (e) {}
		//require('./file');
		//require('./evict');
		await multicastPlugin(__usable_environment);
		await statsPlugin(__usable_environment);
		__usable_module.exports = Gun;
	})();
	__usable_environment.exports.lib.server = __usable_module.exports;
	return __usable_module.exports;
}
