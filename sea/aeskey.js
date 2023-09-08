import shimPlugin from "./shim.js";
import settingsPlugin from "./settings.js";
import sha256Plugin from "./sha256.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var shim = shimPlugin(__usable_environment);
	var S = settingsPlugin(__usable_environment);
	var sha256hash = sha256Plugin(__usable_environment);
	__usable_module.exports = async (key, salt, opt) => {
		//const combo = shim.Buffer.concat([shim.Buffer.from(key, 'utf8'), salt || shim.random(8)]).toString('utf8') // old
		opt = opt || {};
		const combo = key + (salt || shim.random(8)).toString("utf8"); // new
		const hash = shim.Buffer.from(await sha256hash(combo), "binary");
		const jwkKey = S.keyToJwk(hash);
		return await shim.subtle.importKey(
			"jwk",
			jwkKey,
			{
				name: "AES-GCM",
			},
			false,
			["encrypt", "decrypt"],
		);
	};
	__usable_environment.exports.sea.aeskey = __usable_module.exports;
	return __usable_module.exports;
}
