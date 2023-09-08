import shimPlugin from "./shim.js";
import rootPlugin from "./root.js";
import workPlugin from "./work.js";
import signPlugin from "./sign.js";
import verifyPlugin from "./verify.js";
import encryptPlugin from "./encrypt.js";
import decryptPlugin from "./decrypt.js";
import certifyPlugin from "./certify.js";
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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var shim = shimPlugin(__usable_environment);
	// Practical examples about usage found in tests.
	var SEA = rootPlugin(__usable_environment);
	SEA.work = workPlugin(__usable_environment);
	SEA.sign = signPlugin(__usable_environment);
	SEA.verify = verifyPlugin(__usable_environment);
	SEA.encrypt = encryptPlugin(__usable_environment);
	SEA.decrypt = decryptPlugin(__usable_environment);
	SEA.certify = certifyPlugin(__usable_environment);
	//SEA.opt.aeskey = require('./aeskey'); // not official! // this causes problems in latest WebCrypto.

	SEA.random = SEA.random || shim.random;

	// This is Buffer used in SEA and usable from Gun/SEA application also.
	// For documentation see https://nodejs.org/api/buffer.html
	SEA.Buffer = SEA.Buffer || bufferPlugin(__usable_environment);

	// These SEA functions support now ony Promises or
	// async/await (compatible) code, use those like Promises.
	//
	// Creates a wrapper library around Web Crypto API
	// for various AES, ECDSA, PBKDF2 functions we called above.
	// Calculate public key KeyID aka PGPv4 (result: 8 bytes as hex string)
	SEA.keyid =
		SEA.keyid ||
		(async (pub) => {
			try {
				// base64('base64(x):base64(y)') => shim.Buffer(xy)
				const pb = shim.Buffer.concat(
					pub
						.replace(/-/g, "+")
						.replace(/_/g, "/")
						.split(".")
						.map((t) => shim.Buffer.from(t, "base64")),
				);
				// id is PGPv4 compliant raw key
				const id = shim.Buffer.concat([
					shim.Buffer.from([0x99, pb.length / 0x100, pb.length % 0x100]),
					pb,
				]);
				const sha1 = await __usable_globalThis.sha1hash(id);
				const hash = shim.Buffer.from(sha1, "binary");
				return hash.toString("hex", hash.length - 8); // 16-bit ID as hex
			} catch (e) {
				__usable_globalThis.debug.log(e);
				throw e;
			}
		});
	// all done!
	// Obviously it is missing MANY necessary features. This is only an alpha release.
	// Please experiment with it, audit what I've done so far, and complain about what needs to be added.
	// SEA should be a full suite that is easy and seamless to use.
	// Again, scroll naer the top, where I provide an EXAMPLE of how to create a user and sign in.
	// Once logged in, the rest of the code you just read handled automatically signing/validating data.
	// But all other behavior needs to be equally easy, like opinionated ways of
	// Adding friends (trusted public keys), sending private messages, etc.
	// Cheers! Tell me what you think.
	((SEA.window || {}).GUN || {}).SEA = SEA;
	__usable_module.exports = SEA;
	// -------------- END SEA MODULES --------------------
	// -- BEGIN SEA+GUN MODULES: BUNDLED BY DEFAULT UNTIL OTHERS USE SEA ON OWN -------

	__usable_environment.exports.sea.sea = __usable_module.exports;
	return __usable_module.exports;
}
