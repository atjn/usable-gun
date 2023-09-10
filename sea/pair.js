import rootPlugin from "./root.js";
import shimPlugin from "./shim.js";
import settingsPlugin from "./settings.js";
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
	settingsPlugin(__usable_environment);
	SEA.name =
		SEA.name ||
		(async (cb) => {
			try {
				if (cb) {
					try {
						cb();
					} catch (e) {
						__usable_globalThis.debug.log(e);
					}
				}
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

	//SEA.pair = async (data, proof, cb) => { try {
	SEA.pair =
		SEA.pair ||
		(async (cb) => {
			try {
				var ecdhSubtle = shim.ossl || shim.subtle;
				// First: ECDSA keys for signing/verifying...
				var sa = await shim.subtle
					.generateKey(
						{
							name: "ECDSA",
							namedCurve: "P-256",
						},
						true,
						["sign", "verify"],
					)
					.then(async (keys) => {
						// privateKey scope doesn't leak out from here!
						//const { d: priv } = await shim.subtle.exportKey('jwk', keys.privateKey)
						var key = {};
						key.priv = (await shim.subtle.exportKey("jwk", keys.privateKey)).d;
						var pub = await shim.subtle.exportKey("jwk", keys.publicKey);
						//const pub = Buff.from([ x, y ].join(':')).toString('base64') // old
						key.pub = pub.x + "." + pub.y; // new
						// x and y are already base64
						// pub is UTF8 but filename/URL safe (https://www.ietf.org/rfc/rfc3986.txt)
						// but split on a non-base64 letter.
						return key;
					});

				// To include PGPv4 kind of keyId:
				// const pubId = await SEA.keyid(keys.pub)
				// Next: ECDH keys for encryption/decryption...

				try {
					var dh = await ecdhSubtle
						.generateKey(
							{
								name: "ECDH",
								namedCurve: "P-256",
							},
							true,
							["deriveKey"],
						)
						.then(async (keys) => {
							// privateKey scope doesn't leak out from here!
							var key = {};
							key.epriv = (
								await ecdhSubtle.exportKey("jwk", keys.privateKey)
							).d;
							var pub = await ecdhSubtle.exportKey("jwk", keys.publicKey);
							//const epub = Buff.from([ ex, ey ].join(':')).toString('base64') // old
							key.epub = pub.x + "." + pub.y; // new
							// ex and ey are already base64
							// epub is UTF8 but filename/URL safe (https://www.ietf.org/rfc/rfc3986.txt)
							// but split on a non-base64 letter.
							return key;
						});
				} catch (e) {
					if (SEA.window) {
						throw e;
					}
					if (e == "Error: ECDH is not a supported algorithm") {
						__usable_globalThis.debug.log("Ignoring ECDH...");
					} else {
						throw e;
					}
				}
				dh = dh || {};
				var r = {
					pub: sa.pub,
					priv: sa.priv,
					/* pubId, */ epub: dh.epub,
					epriv: dh.epriv,
				};
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
	__usable_module.exports = SEA.pair;
	__usable_environment.exports.sea.pair = __usable_module.exports;
	return __usable_module.exports;
}
