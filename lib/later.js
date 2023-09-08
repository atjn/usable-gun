import gunPlugin from "../gun.js";
import openPlugin from "./open.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;
	/* BEGIN WRAPPED GUN CODE */

	var Gun = Gun || gunPlugin(__usable_environment);
	Gun.chain.open || openPlugin(__usable_environment);
	Gun.chain.later = function (cb, age) {
		var gun = this;
		age = age * 1000; // convert to milliseconds.
		setTimeout(() => {
			gun.open(cb, {
				off: true,
			});
		}, age);
		return gun;
	};
}
