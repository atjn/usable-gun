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

	var m = __usable_globalThis.meta;

	var k = m.key;
	//$(window).on('focus', k.wipe.bind(null, false)); // .on('blur', k.wipe.bind(null, false))
	__usable_globalThis.$(document).on("mousedown mousemove mouseup", (eve) => {
		m.tap.eve = eve;
		m.tap.x = eve.pageX || 0;
		m.tap.y = eve.pageY || 0;
		m.tap.on = __usable_globalThis.$(eve.target);
	});
	var [start, end] =
		"ontouchstart" in __usable_window
			? ["touchstart", "touchend"]
			: ["mousedown", "mouseup"];
	__usable_globalThis
		.$(document)
		.on(start, "#meta .meta-menu li", function (eve) {
			var combo = __usable_globalThis.$(this).data().combo;
			eve.fake = eve.which =
				combo && combo.slice(-1)[0].toUpperCase().charCodeAt(0);
			eve.tap = true;
			k.down(eve);
			__usable_globalThis.$(document).one(end, () => k.up(eve));
		});
	__usable_globalThis.$(document).on("keydown", k.down).on("keyup", k.up);
	__usable_globalThis.$("#meta").on(start, (ev) => {
		if (ev.target.tagName == "LI" || ev.target.tagName == "UL") return;
		__usable_globalThis.meta.flip();
	});
}
