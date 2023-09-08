import arrayPlugin from "./array.js";
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
	// This is Buffer implementation used in SEA. Functionality is mostly
	// compatible with NodeJS 'safe-buffer' and is used for encoding conversions
	// between binary and 'hex' | 'utf8' | 'base64'
	// See documentation and validation for safe implementation in:
	// https://github.com/feross/safe-buffer#update
	var SeaArray = arrayPlugin(__usable_environment);
	function SafeBuffer(...props) {
		__usable_globalThis.debug.warn(
			"new SafeBuffer() is depreciated, please use SafeBuffer.from()",
		);
		return SafeBuffer.from(...props);
	}
	SafeBuffer.prototype = Object.create(Array.prototype);
	Object.assign(SafeBuffer, {
		// (data, enc) where typeof data === 'string' then enc === 'utf8'|'hex'|'base64'
		from(...args) {
			if (!Object.keys(args).length || args[0] == null) {
				throw new TypeError(
					"First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.",
				);
			}
			const input = args[0];
			let buf;
			if (typeof input === "string") {
				const enc = args[1] || "utf8";
				if (enc === "hex") {
					const bytes = input
						.match(/([\da-fA-F]{2})/g)
						.map((byte) => parseInt(byte, 16));
					if (!bytes || !bytes.length) {
						throw new TypeError("Invalid first argument for type 'hex'.");
					}
					buf = SeaArray.from(bytes);
				} else if (enc === "utf8" || "binary" === enc) {
					// EDIT BY MARK: I think this is safe, tested it against a couple "binary" strings. This lets SafeBuffer match NodeJS Buffer behavior more where it safely btoas regular strings.
					const length = input.length;
					const words = new Uint16Array(length);
					Array.from(
						{
							length,
						},
						(_, i) => (words[i] = input.charCodeAt(i)),
					);
					buf = SeaArray.from(words);
				} else if (enc === "base64") {
					const dec = atob(input);
					const length = dec.length;
					const bytes = new Uint8Array(length);
					Array.from(
						{
							length,
						},
						(_, i) => (bytes[i] = dec.charCodeAt(i)),
					);
					buf = SeaArray.from(bytes);
				} else if (enc === "binary") {
					// deprecated by above comment
					buf = SeaArray.from(input); // some btoas were mishandled.
				} else {
					__usable_globalThis.debug.info(
						"SafeBuffer.from unknown encoding: " + enc,
					);
				}
				return buf;
			}
			input.byteLength; // what is going on here? FOR MARTTI
			const length = input.byteLength ? input.byteLength : input.length;
			if (length) {
				let buf;
				if (input instanceof ArrayBuffer) {
					buf = new Uint8Array(input);
				}
				return SeaArray.from(buf || input);
			}
		},
		// This is 'safe-buffer.alloc' sans encoding support
		alloc(length, fill = 0 /*, enc*/) {
			return SeaArray.from(
				new Uint8Array(
					Array.from(
						{
							length,
						},
						() => fill,
					),
				),
			);
		},
		// This is normal UNSAFE 'buffer.alloc' or 'new Buffer(length)' - don't use!
		allocUnsafe(length) {
			return SeaArray.from(
				new Uint8Array(
					Array.from({
						length,
					}),
				),
			);
		},
		// This puts together array of array like members
		concat(arr) {
			// octet array
			if (!Array.isArray(arr)) {
				throw new TypeError(
					"First argument must be Array containing ArrayBuffer or Uint8Array instances.",
				);
			}
			return SeaArray.from(
				arr.reduce((ret, item) => ret.concat(Array.from(item)), []),
			);
		},
	});
	SafeBuffer.prototype.from = SafeBuffer.from;
	SafeBuffer.prototype.toString = SeaArray.prototype.toString;
	__usable_module.exports = SafeBuffer;
	__usable_environment.exports.sea.buffer = __usable_module.exports;
	return __usable_module.exports;
}
