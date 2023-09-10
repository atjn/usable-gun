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

	var noop = () => {};
	__usable_globalThis.$.fn.or = function (s) {
		return this.length ? this : __usable_globalThis.$(s || "body");
	};
	var m = (__usable_window.meta = {
		edit: [],
	});
	var k = (m.key = {});
	k.meta = {
		17: 17,
		91: 17,
		93: 17,
		224: 17,
		18: 17,
	}; // ALT added
	function withMeta(eve) {
		return eve.metaKey || eve.ctrlKey || eve.altKey;
	} // ALT added
	k.down = (eve) => {
		var key = ((k.eve = m.eve = eve).which =
			eve.which || eve.fake || eve.keyCode);
		if (eve.repeat) {
			return;
		}
		if (!k.meta[key] && withMeta(eve) && !k.at[key]) {
			return m.flip(false);
		} // cancel and close when no action and "meta key" held down (e.g. ctrl+c)
		if (!eve.fake && key === k.last) {
			return;
		}
		k.last = key; // jussi: polyfilling eve.repeat?
		if (
			!eve.fake &&
			__usable_globalThis
				.$(eve.target)
				.closest("input, textarea, [contenteditable=true]")
				.length /* && !$(eve.target).closest('#meta').get().length*/
		) {
			return;
			//if(meta.flip.is() && !withMeta(eve)) eve.preventDefault()
		}

		m.check("on", key, k.at || (k.at = m.edit));
		if (k.meta[key]) {
			m.flip();
		}
	};
	k.down.keys = {}; // currently pressed keys
	k.up = (eve) => {
		var key = ((k.eve = m.eve = eve).which =
			eve.which || eve.fake || eve.keyCode);
		k.last = null;
		m.check("up", key);
		if (k.meta[key] && m.check.fired) {
			m.close();
		}
	};
	m.flip = (tmp) => {
		m.flip.active = true;
		tmp === false || (!tmp && m.ui.board.is(":visible")) ? m.close() : m.open();
		m.flip.active = false;
	};
	m.open = () => {
		m.check.fired = null;
		m.ui.board.removeClass("meta-none");
	};
	m.close = () => {
		Object.keys(k.down.keys).forEach((keyDown) => {
			m.check("up", keyDown);
		});
		m.ui.board.addClass("meta-none");
	};
	m.flip.is = () => m.ui.board.is(":visible");
	m.flip.wait = 500;
	m.check = (how, key, at) => {
		if (!m.flip.is() && !k.meta[key]) {
			return;
		} // TEMP: cancel non-open events when closed TODO make optional
		at = k.at || m.edit;
		var next = at[key];
		if (!next) {
			return;
		}
		var tmp = k.eve || noop;
		if (tmp.preventDefault) {
			tmp.preventDefault();
		} // prevent typing (etc) when action found
		if (next[how]) {
			next[how](m.eve);
			__usable_globalThis.meta.ui.blink();
			m.check.fired = true;
			if (how == "up") delete k.down.keys[key];
			else k.down.keys[key] = 1;
		}
		if ("up" == how) {
			return;
		}
		if (at != next && !next.back) {
			next.back = at;
		}
		(k.combo || (k.combo = [])).push(key);
		m.list(next, true);
	};
	function defaultSort(a, b) {
		a = a.combo.slice(-1)[0] || 0;
		if (a.length) {
			a = a.toUpperCase().charCodeAt(0);
		}
		b = b.combo.slice(-1)[0] || 0;
		if (b.length) {
			b = b.toUpperCase().charCodeAt(0);
		}
		return a < b ? -1 : 1;
	}
	m.list = (at, opt) => {
		if (!at) {
			return m.flip(false);
		}
		var l = [];
		__usable_globalThis.$.each(at, (i, k) => {
			"back" != i && k && k.combo && k.name && l.push(k);
		});
		if (!l.length) {
			return;
		}
		k.at = at;
		if (at.sort !== null) {
			l = l.sort(at.sort || defaultSort);
		}
		var $ul = __usable_globalThis.$("#meta .meta-menu ul");
		$ul.children("li").addClass("meta-none").hide();
		setTimeout(() => {
			$ul.children(".meta-none").remove();
		}, 250); // necessary fix for weird bug glitch
		__usable_globalThis.$.each(l, (i, k) => {
			var $li = __usable_globalThis.$("<li>").text(k.name).data(k);
			$ul.append($li);
			if (k.styles) __usable_globalThis.meta.ui.iniline($li[0], k.styles);
		});
		if (opt) {
			m.flip(true);
		}
		$ul.append(__usable_globalThis.$("<li>").html("&larr;").on("click", back));
	};
	m.ask = (help, cb, opt) => {
		var $ul = __usable_globalThis.$("#meta .meta-menu ul").empty();
		var $put = __usable_globalThis
			.$("<input>")
			.attr("id", "meta-ask")
			.attr("placeholder", help);
		var $form = __usable_globalThis
			.$("<form>")
			.append($put)
			.on("submit", (eve) => {
				eve.preventDefault();
				cb($put.val());
				$li.remove();
				k.wipe();
			});
		if (opt) {
			$form.on("keyup", () => {
				cb($put.val());
			});
		}
		var $li = __usable_globalThis.$("<li>").append($form);
		$ul.append($li);
		m.flip(true);
		$put.focus();
	};
	k.wipe = (opt) => {
		k.combo = [];
		if (!opt) {
			m.flip(false);
		}
		m.list((k.at = m.edit));
	};
	m.tap = () => {
		var on = __usable_globalThis
			.$(".meta-on")
			.or(
				__usable_globalThis
					.$(
						__usable_globalThis
							.$(document.querySelectorAll(":hover"))
							.get()
							.reverse(),
					)
					.first(),
			)
			.or(
				__usable_globalThis.$(
					document.elementFromPoint(
						__usable_globalThis.meta.tap.x,
						__usable_globalThis.meta.tap.y,
					),
				),
			);
		return on;
	};
	__usable_globalThis.meta.edit = (e) => {
		var path = [];
		__usable_globalThis.$.each(e.combo || (e.combo = []), (i, k) => {
			if (!k || !k.length) {
				if ("number" == typeof k) {
					path.push(k);
				}
				return;
			}
			path.push(k.toUpperCase().charCodeAt(0));
		});
		var at = __usable_globalThis.meta.edit;
		var l = e.combo.length;
		__usable_globalThis.$.each(path, (i, k) => {
			at = at[k] = at[k] || Object.create(defaults);
		});
		__usable_globalThis.$.extend(at, e); // fixes overwriting when sub action is defined before parent
		e.combow = path.join(","); // deprecate?
		m.list(k.at || __usable_globalThis.meta.edit);
	};
	function back() {
		// close root or go back on submenu
		k.at == m.edit ? m.flip(false) : m.check("down", "back");
	}
	var defaults = {
		8: {
			on: back,
		},
		// backspace
		27: {
			up: k.wipe,
		}, // esc: close and reset menu
	};

	__usable_globalThis.$.extend(__usable_globalThis.meta.edit, defaults);
}
