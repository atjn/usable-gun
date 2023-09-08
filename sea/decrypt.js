import rootPlugin from "./root.js";
import shimPlugin from "./shim.js";
import settingsPlugin from "./settings.js";
import aeskeyPlugin from "./aeskey.js";
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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var SEA = rootPlugin(__usable_environment);
	var shim = shimPlugin(__usable_environment);
	var S = settingsPlugin(__usable_environment);
	var aeskey = aeskeyPlugin(__usable_environment);
	SEA.decrypt =
		SEA.decrypt ||
		(async (data, pair, cb, opt) => {
			try {
				opt = opt || {};
				var key = (pair || opt).epriv || pair;
				if (!key) {
					if (!SEA.I) {
						throw "No decryption key.";
					}
					pair = await SEA.I(null, {
						what: data,
						how: "decrypt",
						why: opt.why,
					});
					key = pair.epriv || pair;
				}
				var json = await S.parse(data);
				var buf;
				var bufiv;
				var bufct;
				try {
					buf = shim.Buffer.from(json.s, opt.encode || "base64");
					bufiv = shim.Buffer.from(json.iv, opt.encode || "base64");
					bufct = shim.Buffer.from(json.ct, opt.encode || "base64");
					var ct = await aeskey(key, buf, opt).then((aes) =>
						/*shim.ossl ||*/ shim.subtle.decrypt(
							{
								// Keeping aesKey scope as private as possible...
								name: opt.name || "AES-GCM",
								iv: new Uint8Array(bufiv),
								tagLength: 128,
							},
							aes,
							new Uint8Array(bufct),
						),
					);
				} catch (e) {
					if ("utf8" === opt.encode) {
						throw "Could not decrypt";
					}
					if (SEA.opt.fallback) {
						opt.encode = "utf8";
						return await SEA.decrypt(data, pair, cb, opt);
					}
				}
				var r = await S.parse(new shim.TextDecoder("utf8").decode(ct));
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
	__usable_module.exports = SEA.decrypt;
	__usable_environment.exports.sea.decrypt = __usable_module.exports;
	return __usable_module.exports;
}
