import indexPlugin from "./index.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
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
	var Gun = indexPlugin(__usable_environment);
	Gun.chain.set = function (item, cb, opt) {
		var gun = this;
		var root = gun.back(-1);
		var soul;
		var tmp;
		cb = cb || (() => {});
		opt = opt || {};
		opt.item = opt.item || item;
		if ((soul = ((item || "")._ || "")["#"])) {
			(item = {})["#"] = soul;
		} // check if node, make link.
		if ("string" == typeof (tmp = Gun.valid(item))) {
			return gun.get((soul = tmp)).put(item, cb, opt);
		} // check if link
		if (!Gun.is(item)) {
			if (__usable_globalThis.objectPlain(item)) {
				item = root.get((soul = gun.back("opt.uuid")())).put(item);
			}
			return gun.get(soul || root.back("opt.uuid")(7)).put(item, cb, opt);
		}
		gun.put((go) => {
			item.get((soul, o, msg) => {
				// TODO: BUG! We no longer have this option? & go error not handled?
				if (!soul) {
					return cb.call(gun, {
						err: Gun.log('Only a node can be linked! Not "' + msg.put + '"!'),
					});
				}
				(tmp = {})[soul] = {
					"#": soul,
				};
				go(tmp);
			}, true);
		});
		return item;
	};
}
