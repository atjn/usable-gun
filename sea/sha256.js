import shimPlugin from "./shim.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var shim = shimPlugin(__usable_environment);
	__usable_module.exports = async (d, o) => {
		var t = typeof d == "string" ? d : await shim.stringify(d);
		var hash = await shim.subtle.digest(
			{
				name: o || "SHA-256",
			},
			new shim.TextEncoder().encode(t),
		);
		return shim.Buffer.from(hash);
	};
	__usable_environment.exports.sea.sha256 = __usable_module.exports;
	return __usable_module.exports;
}
