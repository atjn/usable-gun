import shimPlugin from "./shim.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	/* BEGIN WRAPPED GUN CODE */ // This internal func returns SHA-1 hashed data for KeyID generation
	const __shim = shimPlugin(__usable_environment);
	const subtle = __shim.subtle;
	const ossl = __shim.ossl ? __shim.ossl : subtle;
	__usable_module.exports = (b) =>
		ossl.digest(
			{
				name: "SHA-1",
			},
			new ArrayBuffer(b),
		);
	__usable_environment.exports.sea.sha1 = __usable_module.exports;
	return __usable_module.exports;
}
