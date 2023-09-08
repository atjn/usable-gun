import rootPlugin from "./root.js";
import chainPlugin from "./chain.js";
import backPlugin from "./back.js";
import putPlugin from "./put.js";
import getPlugin from "./get.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	/* BEGIN WRAPPED GUN CODE */

	var Gun = rootPlugin(__usable_environment);
	chainPlugin(__usable_environment);
	backPlugin(__usable_environment);
	putPlugin(__usable_environment);
	getPlugin(__usable_environment);
	__usable_module.exports = Gun;
	__usable_environment.exports.gun.index = __usable_module.exports;
	return __usable_module.exports;
}
