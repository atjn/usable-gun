import gunPlugin from "../gun.js";
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
	const __usable_window =
		__usable_environment.environmentHint !== "browser"
			? undefined
			: new Proxy("window" in globalThis ? window : globalThis, {
					get(target, property) {
						if (["window", "globalThis", "global"].includes(property)) {
							return __usable_window;
						} else if (__usable_environment.library[property] !== undefined) {
							return __usable_environment.library[property];
						} else if ("window" in globalThis) {
							return window[property];
						} else {
							return undefined;
						}
					},
					set(object, property, value) {
						__usable_environment.library[property] = value;
						return true;
					},
			  });
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	var Gun =
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment);
	Gun.chain.open = function (cb, opt, at, depth) {
		// this is a recursive function, BEWARE!
		depth = depth || 1;
		opt = opt || {}; // init top level options.
		opt.doc = opt.doc || {};
		opt.ids = opt.ids || {};
		opt.any = opt.any || cb;
		opt.meta = opt.meta || false;
		opt.eve = opt.eve || {
			off() {
				// collect all recursive events to unsubscribe to if needed.
				Object.keys(opt.eve.s).forEach((i, e) => {
					// switch to CPU scheduled setTimeout.each?
					if ((e = opt.eve.s[i])) {
						e.off();
					}
				});
				opt.eve.s = {};
			},
			s: {},
		};
		return this.on(function (data, key, ctx, eve) {
			// subscribe to 1 deeper of data!
			clearTimeout(opt.to); // do not trigger callback if bunch of changes...
			opt.to = setTimeout(() => {
				// but schedule the callback to fire soon!
				if (!opt.any) {
					return;
				}
				opt.any.call(opt.at.$, opt.doc, opt.key, opt, opt.eve); // call it.
				if (opt.off) {
					// check for unsubscribing.
					opt.eve.off();
					opt.any = null;
				}
			}, opt.wait || 9);
			opt.at = opt.at || ctx; // opt.at will always be the first context it finds.
			opt.key = opt.key || key;
			opt.eve.s[this._.id] = eve; // collect all the events together.
			if (true === Gun.valid(data)) {
				// if primitive value...
				if (!at) {
					opt.doc = data;
				} else {
					at[key] = data;
				}
				return;
			}
			var tmp = this; // else if a sub-object, CPU schedule loop over properties to do recursion.
			__usable_globalThis.settimeoutEach(Object.keys(data), (key, val) => {
				if ("_" === key && !opt.meta) {
					return;
				}
				val = data[key];
				var doc = at || opt.doc; // first pass this becomes the root of open, then at is passed below, and will be the parent for each sub-document/object.
				var id;
				if (!doc) {
					return;
				} // if no "parent"
				if ("string" !== typeof (id = Gun.valid(val))) {
					// if primitive...
					doc[key] = val;
					return;
				}
				if (opt.ids[id]) {
					// if we've already seen this sub-object/document
					doc[key] = opt.ids[id]; // link to itself, our already in-memory one, not a new copy.
					return;
				}
				if (opt.depth <= depth) {
					// stop recursive open at max depth.
					doc[key] = doc[key] || val; // show link so app can load it if need.
					return;
				} // now open up the recursion of sub-documents!
				tmp
					.get(key)
					.open(opt.any, opt, (opt.ids[id] = doc[key] = {}), depth + 1); // 3rd param is now where we are "at".
			});
		});
	};
}
