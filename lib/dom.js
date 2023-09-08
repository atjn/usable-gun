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
	(() => {
		// jQuery shim
		// u = undefined, n = null, b = boolean = true/false, n = number, t = text, l = list = array, o = object, cb = callback = function, q = query CSS, k = key, eve = event.
		if (__usable_window.$) {
			return;
		}
		((__usable_globalThis.$ = __usable_window.$ =
			function (q, tag, I, undefined) {
				if (q instanceof __usable_globalThis.$) {
					return q;
				}
				if (!((I = this) instanceof __usable_globalThis.$)) {
					return new __usable_globalThis.$(q, tag);
				}
				if ("string" != typeof q) {
					return (
						(I.tags = (q = q || []).tags || undefined === q.length ? [q] : q), I
					);
				}
				if ("<" === q[0]) {
					return I.add(q);
				}
				return (
					q.split(",").forEach((q) => {
						I.add((tag || __usable_window.document).querySelectorAll(q));
					}),
					I
				);
			}).fn = __usable_globalThis.$.prototype).each = function (cb) {
			return __usable_globalThis.$.each(this.tags, cb), this;
		};
		__usable_globalThis.$.each = (o, cb) => {
			Object.keys(o).forEach((k) => {
				cb(k, o[k]);
			});
		};
		__usable_globalThis.$.isPlainObject = (o) =>
			o
				? (o instanceof Object && o.constructor === Object) ||
				  "Object" ===
						Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1]
				: false;
		__usable_globalThis.$.fn.add = function (add, tmp, undefined) {
			if (!add) {
				return this;
			}
			if ("<" === (tmp = add)[0]) {
				(add = __usable_window.document.createElement("div")).innerHTML = tmp;
				add = add.children[0];
			}
			add =
				"string" == typeof add
					? __usable_globalThis.$(add).tags
					: undefined == add.length
					? add
					: [].slice.call(add);
			return (this.tags = [].slice.call(this.tags || []).concat(add)), this;
		};
		__usable_globalThis.$.fn.get = function (i, l, undefined) {
			return (l = this.tags), i === undefined ? l : l[i];
		};
		__usable_globalThis.$.fn.is = function (q, b) {
			return (
				this.each((i, tag) => {
					b = b || tag.matches(q);
				}),
				b
			);
		};
		__usable_globalThis.$.fn.css = function (o) {
			return this.each((i, tag) => {
				__usable_globalThis.$.each(o, (k, v) => {
					tag.style[k] = v;
				});
			});
		};
		__usable_globalThis.$.fn.on = function (t, cb) {
			return this.each((i, tag) => {
				t.split(" ").forEach((t) => {
					tag.addEventListener(t, cb);
				});
			});
		};
		__usable_globalThis.$.fn.val = function (t, k, f, undefined) {
			t = t === undefined ? "" : (f = 1) && t;
			k = k || "value";
			return (
				this.each((i, tag) => {
					if (f) {
						tag[k] = t;
					} else {
						t += tag[k] || "";
					}
				}),
				f ? this : t
			);
		};
		__usable_globalThis.$.fn.text = function (t) {
			return this.val(t, "textContent");
		};
		__usable_globalThis.$.fn.html = function (html) {
			return this.val(html, "innerHTML");
		};
		__usable_globalThis.$.fn.attr = function (attr, val) {
			return this.val(val, attr);
		};
		__usable_globalThis.$.fn.find = function (q, I, l) {
			(I = __usable_globalThis.$()), (l = I.tags);
			return (
				this.each((i, tag) => {
					__usable_globalThis.$(q, tag).each((i, tag) => {
						if (0 > l.indexOf(tag)) {
							l.push(tag);
						}
					});
				}),
				I
			);
		};
		__usable_globalThis.$.fn.place = function (where, on, f, op, I) {
			return (I = this).each((i, tag) => {
				__usable_globalThis.$(on).each((i, node) => {
					(f ? tag : node)[op || "insertAdjacentElement"](
						{
							"-1": "beforebegin",
							"-0.1": "afterbegin",
							0.1: "beforeend",
							1: "afterend",
						}[where],
						f ? node : tag,
					);
				});
			});
		};
		__usable_globalThis.$.fn.append = function (html) {
			return __usable_globalThis.$(html).place(0.1, this), this;
		};
		__usable_globalThis.$.fn.appendTo = function (html) {
			return this.place(0.1, __usable_globalThis.$(html));
		};
		function rev(o, I) {
			(I = __usable_globalThis.$()).tags = [].slice.call(o.tags).reverse();
			return I;
		}
		__usable_globalThis.$.fn.prependTo = function (html) {
			return rev(this).place(-0.1, __usable_globalThis.$(html)), this;
		};
		__usable_globalThis.$.fn.prepend = function (html) {
			return rev(__usable_globalThis.$(html)).place(-0.1, this), this;
		};
		__usable_globalThis.$.fn.parents = function (q, c, I, l, p) {
			(I = __usable_globalThis.$()), (l = I.tags), (p = "parentElement");
			this.each((i, tag) => {
				if (c) {
					(c = {})[p] = tag;
					tag = c;
				}
				while (tag) {
					if ((tag = tag[p]) && __usable_globalThis.$(tag).is(q)) {
						l.push(tag);
						if (c) {
							return;
						}
					}
				}
			});
			return I;
		};
		__usable_globalThis.$.fn.closest = function (q) {
			return this.parents(q, 1);
		};
		__usable_globalThis.$.fn.clone = function (b, I, l) {
			(I = __usable_globalThis.$()), (l = I.tags);
			this.each((i, tag) => {
				l.push(tag.cloneNode(true));
			});
			return I;
		};
	})();
}
