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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var SEA = rootPlugin(__usable_environment);
	var shim = shimPlugin(__usable_environment);
	settingsPlugin(__usable_environment); // Derive shared secret from other's pub and my epub/epriv
	SEA.secret =
		SEA.secret ||
		(async (key, pair, cb, opt) => {
			try {
				opt = opt || {};
				if (!pair || !pair.epriv || !pair.epub) {
					if (!SEA.I) {
						throw "No secret mix.";
					}
					pair = await SEA.I(null, {
						what: key,
						how: "secret",
						why: opt.why,
					});
				}
				var pub = key.epub || key;
				var epub = pair.epub;
				var epriv = pair.epriv;
				var ecdhSubtle = shim.ossl || shim.subtle;
				var pubKeyData = keysToEcdhJwk(pub);
				var props = Object.assign(
					{
						public: await ecdhSubtle.importKey(...pubKeyData, true, []),
					},
					{
						name: "ECDH",
						namedCurve: "P-256",
					},
				); // Thanks to @sirpy !
				var privKeyData = keysToEcdhJwk(epub, epriv);
				var derived = await ecdhSubtle
					.importKey(...privKeyData, false, ["deriveBits"])
					.then(async (privKey) => {
						// privateKey scope doesn't leak out from here!
						var derivedBits = await ecdhSubtle.deriveBits(props, privKey, 256);
						var rawBits = new Uint8Array(derivedBits);
						var derivedKey = await ecdhSubtle.importKey(
							"raw",
							rawBits,
							{
								name: "AES-GCM",
								length: 256,
							},
							true,
							["encrypt", "decrypt"],
						);
						return ecdhSubtle.exportKey("jwk", derivedKey).then(({ k }) => k);
					});
				var r = derived;
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

	// can this be replaced with settings.jwk?
	var keysToEcdhJwk = (pub, d) => {
		// d === priv
		//var [ x, y ] = shim.Buffer.from(pub, 'base64').toString('utf8').split(':') // old
		var [x, y] = pub.split("."); // new
		var jwk = d
			? {
					d,
			  }
			: {};
		return [
			// Use with spread returned value...
			"jwk",
			Object.assign(jwk, {
				x,
				y,
				kty: "EC",
				crv: "P-256",
				ext: true,
			}),
			// ??? refactor
			{
				name: "ECDH",
				namedCurve: "P-256",
			},
		];
	};
	__usable_module.exports = SEA.secret;
	__usable_environment.exports.sea.secret = __usable_module.exports;
	return __usable_module.exports;
}
