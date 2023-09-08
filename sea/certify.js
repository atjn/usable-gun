import rootPlugin from "./root.js";
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
	// This is to certify that a group of "certificants" can "put" anything at a group of matched "paths" to the certificate authority's graph
	SEA.certify =
		SEA.certify ||
		(async (certificants, policy = {}, authority, cb, opt = {}) => {
			try {
				/*
      The Certify Protocol was made out of love by a Vietnamese code enthusiast. Vietnamese people around the world deserve respect!
      IMPORTANT: A Certificate is like a Signature. No one knows who (authority) created/signed a cert until you put it into their graph.
      "certificants": '*' or a String (Bob.pub) || an Object that contains "pub" as a key || an array of [object || string]. These people will have the rights.
      "policy": A string ('inbox'), or a RAD/LEX object {'*': 'inbox'}, or an Array of RAD/LEX objects or strings. RAD/LEX object can contain key "?" with indexOf("*") > -1 to force key equals certificant pub. This rule is used to check against soul+'/'+key using Gun.text.match or String.match.
      "authority": Key pair or priv of the certificate authority.
      "cb": A callback function after all things are done.
      "opt": If opt.expiry (a timestamp) is set, SEA won't sync data after opt.expiry. If opt.block is set, SEA will look for block before syncing.
      */
				__usable_globalThis.debug.log(
					"SEA.certify() is an early experimental community supported method that may change API behavior without warning in any future version.",
				);
				certificants = (() => {
					var data = [];
					if (certificants) {
						if (
							(typeof certificants === "string" ||
								Array.isArray(certificants)) &&
							certificants.indexOf("*") > -1
						)
							return "*";
						if (typeof certificants === "string") return certificants;
						if (Array.isArray(certificants)) {
							if (certificants.length === 1 && certificants[0])
								return typeof certificants[0] === "object" &&
									certificants[0].pub
									? certificants[0].pub
									: typeof certificants[0] === "string"
									? certificants[0]
									: null;
							certificants.map((certificant) => {
								if (typeof certificant === "string") data.push(certificant);
								else if (typeof certificant === "object" && certificant.pub)
									data.push(certificant.pub);
							});
						}
						if (typeof certificants === "object" && certificants.pub)
							return certificants.pub;
						return data.length > 0 ? data : null;
					}
				})();
				if (!certificants)
					return __usable_globalThis.debug.log("No certificant found.");
				const expiry =
					opt.expiry &&
					(typeof opt.expiry === "number" || typeof opt.expiry === "string")
						? parseFloat(opt.expiry)
						: null;
				const readPolicy = (policy || {}).read ? policy.read : null;
				const writePolicy = (policy || {}).write
					? policy.write
					: typeof policy === "string" ||
					  Array.isArray(policy) ||
					  policy["+"] ||
					  policy["#"] ||
					  policy["."] ||
					  policy["="] ||
					  policy["*"] ||
					  policy[">"] ||
					  policy["<"]
					? policy
					: null;
				// The "blacklist" feature is now renamed to "block". Why ? BECAUSE BLACK LIVES MATTER!
				// We can now use 3 keys: block, blacklist, ban
				const block =
					(opt || {}).block || (opt || {}).blacklist || (opt || {}).ban || {};
				const readBlock =
					block.read &&
					(typeof block.read === "string" || (block.read || {})["#"])
						? block.read
						: null;
				const writeBlock =
					typeof block === "string"
						? block
						: block.write &&
						  (typeof block.write === "string" || block.write["#"])
						? block.write
						: null;
				if (!readPolicy && !writePolicy)
					return __usable_globalThis.debug.log("No policy found.");

				// reserved keys: c, e, r, w, rb, wb
				const data = JSON.stringify({
					c: certificants,
					...(expiry
						? {
								e: expiry,
						  }
						: {}),
					// inject expiry if possible
					...(readPolicy
						? {
								r: readPolicy,
						  }
						: {}),
					// "r" stands for read, which means read permission.
					...(writePolicy
						? {
								w: writePolicy,
						  }
						: {}),
					// "w" stands for write, which means write permission.
					...(readBlock
						? {
								rb: readBlock,
						  }
						: {}),
					// inject READ block if possible
					...(writeBlock
						? {
								wb: writeBlock,
						  }
						: {}), // inject WRITE block if possible
				});

				const certificate = await SEA.sign(data, authority, null, {
					raw: 1,
				});
				var r = certificate;
				if (!opt.raw) {
					r = "SEA" + JSON.stringify(r);
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
				SEA.err = e;
				if (SEA.throw) {
					throw e;
				}
				if (cb) {
					cb();
				}
			}
		});
	__usable_module.exports = SEA.certify;
	__usable_environment.exports.sea.certify = __usable_module.exports;
	return __usable_module.exports;
}
