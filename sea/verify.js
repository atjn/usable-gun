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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var SEA = rootPlugin(__usable_environment);
	var shim = shimPlugin(__usable_environment);
	var S = settingsPlugin(__usable_environment);
	var sha = sha256Plugin(__usable_environment);
	SEA.verify =
		SEA.verify ||
		(async (data, pair, cb, opt) => {
			try {
				var json = await S.parse(data);
				if (false === pair) {
					// don't verify!
					var raw = await S.parse(json.m);
					if (cb) {
						try {
							cb(raw);
						} catch (e) {
							__usable_globalThis.debug.log(e);
						}
					}
					return raw;
				}
				opt = opt || {};
				// SEA.I // verify is free! Requires no user permission.
				var pub = pair.pub || pair;
				var key = SEA.opt.slow_leak
					? await SEA.opt.slow_leak(pub)
					: await (shim.ossl || shim.subtle).importKey(
							"jwk",
							S.jwk(pub),
							{
								name: "ECDSA",
								namedCurve: "P-256",
							},
							false,
							["verify"],
					  );
				var hash = await sha(json.m);
				var buf;
				var sig;
				var check;
				try {
					buf = shim.Buffer.from(json.s, opt.encode || "base64"); // NEW DEFAULT!
					sig = new Uint8Array(buf);
					check = await (shim.ossl || shim.subtle).verify(
						{
							name: "ECDSA",
							hash: {
								name: "SHA-256",
							},
						},
						key,
						sig,
						new Uint8Array(hash),
					);
					if (!check) {
						throw "Signature did not match.";
					}
				} catch (e) {
					if (SEA.opt.fallback) {
						return await SEA.opt.fall_verify(data, pair, cb, opt);
					}
				}
				var r = check ? await S.parse(json.m) : undefined;
				if (cb) {
					try {
						cb(r);
					} catch (e) {
						__usable_globalThis.debug.log(e);
					}
				}
				return r;
			} catch (e) {
				__usable_globalThis.debug.log(e); // mismatched owner FOR MARTTI
				SEA.err = e;
				if (SEA.throw) {
					throw e;
				}
				if (cb) {
					cb();
				}
			}
		});
	__usable_module.exports = SEA.verify;
	// legacy & ossl memory leak mitigation:

	var knownKeys = {};
	SEA.opt.slow_leak = (pair) => {
		if (knownKeys[pair]) return knownKeys[pair];
		var jwk = S.jwk(pair);
		knownKeys[pair] = (shim.ossl || shim.subtle).importKey(
			"jwk",
			jwk,
			{
				name: "ECDSA",
				namedCurve: "P-256",
			},
			false,
			["verify"],
		);
		return knownKeys[pair];
	};
	var O = SEA.opt;
	SEA.opt.fall_verify = async (data, pair, cb, opt, f) => {
		if (f === SEA.opt.fallback) {
			throw "Signature did not match";
		}
		f = f || 1;
		var tmp = data || "";
		data = SEA.opt.unpack(data) || data;
		var json = await S.parse(data);
		var pub = pair.pub || pair;
		var key = await SEA.opt.slow_leak(pub);
		var hash =
			f <= SEA.opt.fallback
				? shim.Buffer.from(
						await shim.subtle.digest(
							{
								name: "SHA-256",
							},
							new shim.TextEncoder().encode(await S.parse(json.m)),
						),
				  )
				: await sha(json.m); // this line is old bad buggy code but necessary for old compatibility.
		var buf;
		var sig;
		var check;
		try {
			buf = shim.Buffer.from(json.s, opt.encode || "base64"); // NEW DEFAULT!
			sig = new Uint8Array(buf);
			check = await (shim.ossl || shim.subtle).verify(
				{
					name: "ECDSA",
					hash: {
						name: "SHA-256",
					},
				},
				key,
				sig,
				new Uint8Array(hash),
			);
			if (!check) {
				throw "Signature did not match.";
			}
		} catch (e) {
			try {
				buf = shim.Buffer.from(json.s, "utf8"); // AUTO BACKWARD OLD UTF8 DATA!
				sig = new Uint8Array(buf);
				check = await (shim.ossl || shim.subtle).verify(
					{
						name: "ECDSA",
						hash: {
							name: "SHA-256",
						},
					},
					key,
					sig,
					new Uint8Array(hash),
				);
			} catch (e) {
				if (!check) {
					throw "Signature did not match.";
				}
			}
		}
		var r = check ? await S.parse(json.m) : undefined;
		O.fall_soul = tmp["#"];
		O.fall_key = tmp["."];
		O.fall_val = data;
		O.fall_state = tmp[">"];
		if (cb) {
			try {
				cb(r);
			} catch (e) {
				__usable_globalThis.debug.log(e);
			}
		}
		return r;
	};
	SEA.opt.fallback = 2;
	__usable_environment.exports.sea.verify = __usable_module.exports;
	return __usable_module.exports;
}
