import mathRandomPlugin from "./../usableLib/mathRandomPlugin.js";
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

	/* BEGIN WRAPPED GUN CODE */
	mathRandomPlugin(__usable_environment);
	__usable_window.fun = (e) => {
		setTimeout(() => {
			e = e || {};
			var $img = __usable_globalThis
				.$('<div class="joy"></div>')
				.css({
					position: "fixed",
					width: 100,
					top:
						(e.y ||
							e.clientY ||
							__usable_globalThis.mathRandom() *
								__usable_globalThis.$(__usable_window.window).height()) - 50,
					left:
						(e.x ||
							e.clientX ||
							e.pageX ||
							__usable_globalThis.mathRandom() *
								__usable_globalThis.$(__usable_window.window).width()) - 50,
					transform:
						"rotate(" + __usable_globalThis.mathRandom() * 360 + "deg)",
				})
				.appendTo("body");
			setTimeout(() => {
				$img.remove();
			}, 800);
		}, 10);
	};
	__usable_globalThis
		.$(document)
		.on("keyup", __usable_globalThis.fun)
		.on("touchstart", __usable_globalThis.fun)
		.on("mousedown", __usable_globalThis.fun);
}
