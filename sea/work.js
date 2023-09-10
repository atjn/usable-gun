import rootPlugin from "./root.js";
import shimPlugin from "./shim.js";
import settingsPlugin from "./settings.js";
import sha256Plugin from "./sha256.js";
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

	var SEA = rootPlugin(__usable_environment);
	var shim = shimPlugin(__usable_environment);
	var S = settingsPlugin(__usable_environment);
	var sha = sha256Plugin(__usable_environment);
	SEA.work =
		SEA.work ||
		(async (data, pair, cb, opt) => {
			try {
				// used to be named `proof`
				var salt = (pair || {}).epub || pair; // epub not recommended, salt should be random!
				opt = opt || {};
				if (salt instanceof Function) {
					cb = salt;
					salt = undefined;
				}
				data = typeof data == "string" ? data : await shim.stringify(data);
				if ("sha" === (opt.name || "").toLowerCase().slice(0, 3)) {
					var rsha = shim.Buffer.from(
						await sha(data, opt.name),
						"binary",
					).toString(opt.encode || "base64");
					if (cb) {
						try {
							cb(rsha);
						} catch (e) {
							__usable_globalThis.debug.log(e);
						}
					}
					return rsha;
				}
				salt = salt || shim.random(9);
				var key = await (shim.ossl || shim.subtle).importKey(
					"raw",
					new shim.TextEncoder().encode(data),
					{
						name: opt.name || "PBKDF2",
					},
					false,
					["deriveBits"],
				);
				var work = await (shim.ossl || shim.subtle).deriveBits(
					{
						name: opt.name || "PBKDF2",
						iterations: opt.iterations || S.pbkdf2.iter,
						salt: new shim.TextEncoder().encode(opt.salt || salt),
						hash: opt.hash || S.pbkdf2.hash,
					},
					key,
					opt.length || S.pbkdf2.ks * 8,
				);
				data = shim.random(data.length); // Erase data in case of passphrase
				var r = shim.Buffer.from(work, "binary").toString(
					opt.encode || "base64",
				);
				if (cb) {
					try {
						cb(r);
					} catch (e) {
						__usable_globalThis.debug.log(e);
					}
				}
				return r;
			} catch (e) {
				__usable_globalThis.debug.log(e);
				SEA.err = e;
				if (SEA.throw) {
					throw e;
				}
				if (cb) {
					cb();
				}
			}
		});
	__usable_module.exports = SEA.work;
	__usable_environment.exports.sea.work = __usable_module.exports;
	return __usable_module.exports;
}
