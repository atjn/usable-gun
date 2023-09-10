import rootPlugin from "./root.js";
import bufferPlugin from "./buffer.js";
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

	const SEA = rootPlugin(__usable_environment);
	const api = {
		Buffer: bufferPlugin(__usable_environment),
	};
	var o = {};

	// ideally we can move away from JSON entirely? unlikely due to compatibility issues... oh well.
	__usable_globalThis.jsonParseAsync =
		__usable_globalThis.jsonParseAsync ||
		((t, cb, r) => {
			try {
				cb(undefined, JSON.parse(t, r));
			} catch (e) {
				cb(e);
			}
		});
	__usable_globalThis.jsonStringifyAsync =
		__usable_globalThis.jsonStringifyAsync ||
		((v, cb, r, s) => {
			try {
				cb(undefined, JSON.stringify(v, r, s));
			} catch (e) {
				cb(e);
			}
		});
	api.parse = (t, r) =>
		new Promise((res, rej) => {
			__usable_globalThis.jsonParseAsync(
				t,
				(err, raw) => {
					err ? rej(err) : res(raw);
				},
				r,
			);
		});
	api.stringify = (v, r, s) =>
		new Promise((res, rej) => {
			__usable_globalThis.jsonStringifyAsync(
				v,
				(err, raw) => {
					err ? rej(err) : res(raw);
				},
				r,
				s,
			);
		});
	if (SEA.window) {
		api.crypto = SEA.window.crypto || SEA.window.msCrypto;
		api.subtle = (api.crypto || o).subtle || (api.crypto || o).webkitSubtle;
		api.TextEncoder = SEA.window.TextEncoder;
		api.TextDecoder = SEA.window.TextDecoder;
		api.random = (len) =>
			api.Buffer.from(
				api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))),
			);
	}
	if (!api.TextDecoder) {
		const { TextEncoder, TextDecoder } = {
			TextEncoder,
			TextDecoder,
		};
		api.TextDecoder = TextDecoder;
		api.TextEncoder = TextEncoder;
	}
	if (!api.crypto) {
		try {
			var crypto = crypto;
			Object.assign(api, {
				crypto,
				random: (len) => api.Buffer.from(crypto.randomBytes(len)),
			});
			const { Crypto: WebCrypto } = undefined;
			api.ossl = api.subtle = new WebCrypto({
				directory: "ossl",
			}).subtle; // ECDH
		} catch (e) {
			__usable_globalThis.debug.error(
				"Please use an environment that supports the crypto API",
			);
		}
	}
	__usable_module.exports = api;
	__usable_environment.exports.sea.shim = __usable_module.exports;
	return __usable_module.exports;
}
