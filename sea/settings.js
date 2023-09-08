import rootPlugin from "./root.js";
import shimPlugin from "./shim.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var SEA = rootPlugin(__usable_environment);
	var shim = shimPlugin(__usable_environment);
	var s = {};
	s.pbkdf2 = {
		hash: {
			name: "SHA-256",
		},
		iter: 100000,
		ks: 64,
	};
	s.ecdsa = {
		pair: {
			name: "ECDSA",
			namedCurve: "P-256",
		},
		sign: {
			name: "ECDSA",
			hash: {
				name: "SHA-256",
			},
		},
	};
	s.ecdh = {
		name: "ECDH",
		namedCurve: "P-256",
	};

	// This creates Web Cryptography API compliant JWK for sign/verify purposes
	s.jwk = (pub, d) => {
		// d === priv
		pub = pub.split(".");
		var x = pub[0];
		var y = pub[1];
		var jwk = {
			kty: "EC",
			crv: "P-256",
			x,
			y,
			ext: true,
		};
		jwk.key_ops = d ? ["sign"] : ["verify"];
		if (d) {
			jwk.d = d;
		}
		return jwk;
	};
	s.keyToJwk = (keyBytes) => {
		const keyB64 = keyBytes.toString("base64");
		const k = keyB64.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
		return {
			kty: "oct",
			k,
			ext: false,
			alg: "A256GCM",
		};
	};
	s.recall = {
		validity: 12 * 60 * 60,
		// internally in seconds : 12 hours
		hook(props) {
			return props;
		}, // { iat, exp, alias, remember } // or return new Promise((resolve, reject) => resolve(props)
	};

	s.check = (t) => typeof t == "string" && "SEA{" === t.slice(0, 4);
	s.parse = async (t) => {
		try {
			var yes = typeof t == "string";
			if (yes && "SEA{" === t.slice(0, 4)) {
				t = t.slice(3);
			}
			return yes ? await shim.parse(t) : t;
		} catch (e) {}
		return t;
	};
	SEA.opt = s;
	__usable_module.exports = s;
	__usable_environment.exports.sea.settings = __usable_module.exports;
	return __usable_module.exports;
}
