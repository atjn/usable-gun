let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;

	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	__usable_module.exports = (tag, hear) => {
		if (!tag) {
			return;
		}
		tag = tag.the; // grab the linked list root
		var tmp = tag.to; // grab first listener
		hear = tmp.on.on(tag.tag, hear); // add us to end
		hear.to = tmp || hear.to; // make our next be current first
		hear.back.to = hear.to; // make our back point to our next
		tag.last = hear.back; // make last be same as before
		hear.back = tag; // make our back be the start
		tag.to = hear; // make the start be us
		return hear;
	};
	// afore(gun._.on('in'), function(){ })

	__usable_environment.exports.lib.afore = __usable_module.exports;
	return __usable_module.exports;
}
