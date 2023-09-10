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
	SEA.sign =
		SEA.sign ||
		(async (data, pair, cb, opt) => {
			try {
				opt = opt || {};
				if (!(pair || opt).priv) {
					if (!SEA.I) {
						throw "No signing key.";
					}
					pair = await SEA.I(null, {
						what: data,
						how: "sign",
						why: opt.why,
					});
				}
				if (undefined === data) {
					throw "`undefined` not allowed.";
				}
				var json = await S.parse(data);
				var check = (opt.check = opt.check || json);
				if (
					SEA.verify &&
					(SEA.opt.check(check) || (check && check.s && check.m)) &&
					undefined !== (await SEA.verify(check, pair))
				) {
					// don't sign if we already signed it.
					var r = await S.parse(check);
					if (!opt.raw) {
						r = "SEA" + (await shim.stringify(r));
					}
					if (cb) {
						try {
							cb(r);
						} catch (e) {
							__usable_globalThis.debug.log(e);
						}
					}
					return r;
				}
				var pub = pair.pub;
				var priv = pair.priv;
				var jwk = S.jwk(pub, priv);
				var hash = await sha(json);
				var sig = await (shim.ossl || shim.subtle)
					.importKey(
						"jwk",
						jwk,
						{
							name: "ECDSA",
							namedCurve: "P-256",
						},
						false,
						["sign"],
					)
					.then((key) =>
						(shim.ossl || shim.subtle).sign(
							{
								name: "ECDSA",
								hash: {
									name: "SHA-256",
								},
							},
							key,
							new Uint8Array(hash),
						),
					); // privateKey scope doesn't leak out from here!
				var r = {
					m: json,
					s: shim.Buffer.from(sig, "binary").toString(opt.encode || "base64"),
				};
				if (!opt.raw) {
					r = "SEA" + (await shim.stringify(r));
				}
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
	__usable_module.exports = SEA.sign;
	__usable_environment.exports.sea.sign = __usable_module.exports;
	return __usable_module.exports;
}
