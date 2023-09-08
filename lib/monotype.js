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
	var monotype =
		monotype ||
		((monotype) => {
			monotype.range = function (n) {
				var R;
				var s;
				var n = n || 0;
				var win = monotype.win || __usable_window;
				var doc = win.document;
				if (!arguments.length) return doc.createRange();
				if (!(win.Range && R instanceof __usable_globalThis.Range)) {
					s = win.getSelection ? win.getSelection() : {};
					if (s.rangeCount) {
						R = s.getRangeAt(n);
					} else {
						if (doc.createRange) {
							R = doc.createRange();
							R.setStart(doc.body, 0);
						} else if (doc.selection) {
							// <IE9
							R = doc.selection.createRange();
							R = R.getBookmark();
						}
					}
					s.end = s.extentNode || s.focusNode || R.startContainer;
					if (s.anchorNode === s.end) {
						R.direction =
							s.anchorOffset <= (s.extentOffset || s.focusOffset || 0) ? 1 : -1;
					} else if (
						__usable_globalThis.$.contains(s.anchorNode || {}, s.end || {})
					) {
						s.end = __usable_globalThis.$(s.anchorNode).contents().filter(s.end)
							.length
							? s.end
							: __usable_globalThis
									.$(s.end)
									.parentsUntil(s.anchorNode)
									.last()[0];
						R.direction =
							s.anchorOffset <
							__usable_globalThis.$(s.anchorNode).contents().index(s.end)
								? 1
								: -1; // Compare immediate descendants to see which comes first.
					} else {
						R.direction = s.anchorNode === R.endContainer ? -1 : 1; // Checking against startContainer fails going backward.
					}
				}

				return R;
			};
			monotype.restore = (R) => {
				var win = monotype.win;
				var doc = win.document;
				if (R.R && R.restore) {
					R.restore();
					return;
				}
				if (win.getSelection) {
					var s = win.getSelection();
					s.removeAllRanges();
					if (s.extend && R.direction < 0) {
						R.esC = R.startContainer;
						R.esO = R.startOffset;
						R.setStart(R.endContainer, R.endOffset);
					}
					s.addRange(R);
					R.esC && s.extend(R.esC, R.esO);
				} else {
					if (doc.body.createTextRange) {
						// <IE9
						var ier = doc.body.createTextRange();
						ier.moveToBookmark(R);
						ier.select();
					}
				}
			};
			monotype.text = (n) =>
				!n
					? false
					: n.nodeType == 3 || n.nodeType == __usable_globalThis.Node.TEXT_NODE;
			monotype.prev = (n, c, d) =>
				!n
					? null
					: n === c
					? null
					: n[(d ? "next" : "previous") + "Sibling"]
					? monotype.deep(
							n[(d ? "next" : "previous") + "Sibling"],
							d ? -1 : Infinity,
					  ).container
					: monotype.prev(__usable_globalThis.$(n).parent()[0], c, d);
			monotype.next = (n, c) => monotype.prev(n, c, 1);
			monotype.deep = (n, o, c, i) => (
				(i =
					o === Infinity ? __usable_globalThis.$(n).contents().length - 1 : o),
				(i = i === -1 ? 0 : i),
				(c = __usable_globalThis.$(n).contents()).length
					? monotype.deep(
							(c = c[i < c.length ? i : c.length - 1]),
							monotype.text(c) ? 0 : o,
					  )
					: {
							container: n,
							offset:
								__usable_globalThis.$(n).text() && o !== -1
									? o === Infinity
										? __usable_globalThis.$(n).text().length
										: o
									: 0,
					  }
			);
			monotype.count = (n, o, c) => {
				var g = monotype.deep(n, o);
				var m = g.container;
				var i = g.offset || 0;
				while ((m = monotype.prev(m, c))) {
					i += __usable_globalThis.$(m).text().length;
				}
				return i;
			};
			monotype.hint = (n, o, c) => {
				var g = monotype.deep(n, o);
				var m = g.container;
				var i = g.offset || 0;
				var h = [];
				var t;
				while (m) {
					h.push({
						t: (t = __usable_globalThis.$(m).text()),
						n: t ? "TEXT" : m.nodeName,
					});
					m = t ? null : monotype.prev(m, c);
				}
				if (h.length == 1 && h[0].t) {
					return [];
				}
				if ((t = __usable_globalThis.$(n).contents()).length && o == t.length) {
					h.push(1); // Indicate that the selection is after the last element.
				}

				return h;
			};
			monotype.reach = (i, c, o) => {
				o = o || {};
				o.i = o.i || o.offset || 0;
				o.$ = o.$
					? o.$.jquery
						? o.$
						: __usable_globalThis.$(o.$)
					: o.container
					? __usable_globalThis.$(o.container)
					: __usable_globalThis.$(c);
				var n = monotype.deep(o.$[0], -1).container;
				var t;
				while (n) {
					t = __usable_globalThis.$(n).text().length;
					if (i <= o.i + t) {
						o.$ = __usable_globalThis.$(n);
						o.i = i - o.i;
						n = null;
					} else {
						o.i += t;
					}
					n = monotype.next(n, c);
				}
				return o;
			};
			return monotype;
		})((e, opt) => {
			var r = {};
			var t;
			var m = monotype;
			opt = opt || {};
			m.win = opt.win || __usable_window;
			r =
				(e || r).jquery || m.text(e)
					? {
							root: __usable_globalThis.$(e || m.win.document.body),
					  }
					: r;
			r.root = __usable_globalThis.$(r.root || m.win.document.body);
			//console.log('_______________________');
			r.R = m.range(0);
			r.H = {};
			r.H.R = __usable_globalThis.$.extend({}, r.R);
			r.d = r.R.direction || 1;
			r.t = r.R.toString();
			r.H.s = m.hint(r.R.startContainer, r.R.startOffset, r.root[0]);
			r.s = m.count(r.R.startContainer, r.R.startOffset, r.root[0]);
			t = m.deep(r.R.startContainer, r.R.startOffset);
			!t.offset && !r.H.s.length && (r.s += 0.1); // At the beginning of a text, not at the end of a text.
			r.H.e = m.hint(r.R.endContainer, r.R.endOffset, r.root[0]);
			r.e = ((n, o, c, t) => {
				if (
					r.R.collapsed ||
					(o === r.R.startOffset && n === r.R.startContainer)
				) {
					return r.s;
				}
				c = m.count(n, o, r.root[0]);
				t = m.deep(n, o);
				!t.offset && !r.H.e.length && (c += 0.1); // Same as above.
				return c;
			})(r.R.endContainer, r.R.endOffset);
			//console.log(r.s, r.R.startOffset, r.H.s, 'M',r.d,'E', r.H.e, r.R.endOffset, r.e);
			t = r.root.text();
			r.L = t.length;
			r.T = {
				s: t.slice(r.s - 9, r.s),
				e: t.slice(r.e, r.e + 9),
				t() {
					return r.T.s + r.T.e;
				},
			};
			r.range = () => {
				//console.log('----');
				r.H = r.H || {};
				var s = m.reach(r.s, r.root[0]);
				var st = s.$.text();
				var e = m.reach(r.e, r.root[0]);
				var et = e.$.text();
				var R = m.range();

				var p = (g, c) => {
					// TODO: BUG! Backtracking in non-Chrome and non-IE9+ browsers. IE9 doesn't like end selections.
					if (!c || !c.length) {
						return g;
					}
					var n = g.$[0],
						f = [],
						i = 0,
						t;
					while ((n = m.next(n, r.root[0])) && ++i < c.length) {
						t = __usable_globalThis.$(n).text();
						if (t) {
							n = null;
						} else {
							f.push(n);
						}
					}
					n = __usable_globalThis.$(f[f.length - 1] || g.$);
					t = n.parent();
					if (
						c[c.length - 1] === 1 ||
						(i && f.length === i && f.length < c.length - 1)
					) {
						// tests pass with this condition, yet failed without
						return {
							i: t.contents().length,
							$: t,
						};
					}
					if (f.length < c.length - 1) {
						// despite above's addition, this still gets activated.
						f = t.contents().slice((n = t.contents().index(n)));
						i =
							f.map(function (j) {
								return __usable_globalThis.$(this).text() ? n + j + 1 : null;
							})[0] || t.contents().length;
						f = f.slice(0, i - n);
						n = f.last()[0];
						if (g.$[0] === n) {
							return g;
						}
						return {
							$: t,
							i: t.contents().index(n),
						};
					}
					return {
						i: 0,
						$: n,
					};
				};

				s = p(s, r.H.s);
				e = p(e, r.H.e);
				//console.log("START", parseInt(s.i), 'in """',(s.$[0]),'""" with hint of', r.H.s, 'from original', r.s);
				//console.log("END", parseInt(e.i), 'in """',(e.$[0]),'""" hint clue of', r.H.e, 'from original', r.e);
				R.setStart(s.$[0], parseInt(s.i));
				R.setEnd(e.$[0], parseInt(e.i));
				return R;
			};
			r.restore = (R) => {
				if (
					r.R.startOffset !== r.H.R.startOffset ||
					r.R.endOffset !== r.H.R.endOffset ||
					r.R.startContainer !== r.H.R.startContainer ||
					r.R.endContainer !== r.H.R.endContainer
				) {
					r.R = R = r.range();
				} else {
					R = r.R;
				}
				R.direction = r.d;
				m.restore(R);
				return r;
			};
			return monotype.late(r, opt);
			//return r;
		});

	monotype.late = (r, opt) => {
		var //monotype(r,opt)
			m = r;

		var strhml = (t) => t[0] === "<" && __usable_globalThis.$(t).length;
		var jqtxt = (n) =>
			n.jquery
				? n
				: strhml(n)
				? __usable_globalThis.$("<div>" + n + "</div>").contents()
				: __usable_globalThis.$(document.createTextNode(n));
		m.get = (d) => {
			if (undefined === d) {
				return __usable_globalThis.$([m.R.startContainer, m.R.endContainer]);
			}
			return monotype.deep(
				(d = d && d > 0) ? m.R.endContainer : m.R.startContainer,
				d ? m.R.endOffset : m.R.startOffset,
			).container;
		};
		m.remove = (n, R) => {
			R = m.R || m.range();
			R.deleteContents();
			monotype.restore(R);
			m = monotype(m, opt);
			return m;
		};
		m.insert = (n, R) => {
			n = jqtxt(n);
			R = m.R || m.range();
			R.deleteContents();
			__usable_globalThis.$(n.get().reverse()).each(function () {
				R.insertNode(this);
			});
			R.selectNodeContents(n.last()[0]);
			monotype.restore(R);
			m = monotype(m, opt);
			return m;
		};
		m.wrap = (n, R) => {
			var jq;
			n = jqtxt(n);
			n = n[0];
			R = m.R || m.range();
			if (monotype.text(R.startContainer) || monotype.text(R.endContainer)) {
				var b = R.cloneContents();
				R.deleteContents();
				jq = __usable_globalThis.$(n);
				jq.html(b);
				jq = jq[0];
				R.insertNode(jq);
			} else {
				R.surroundContents(n);
			}
			R.selectNodeContents(jq || n);
			monotype.restore(R);
			m = monotype(m, opt);
			return m;
		};
		m.select = (n, i, e, j) => {
			var R = m.R || m.range();
			var t = e;
			n = __usable_globalThis.$(n);
			if (__usable_globalThis.$.isNumeric(e)) {
				e = j || n;
				j = t;
			} else {
				e = e || n;
			}
			j = __usable_globalThis.$.isNumeric(j)
				? j
				: __usable_globalThis.$.isNumeric(i)
				? i
				: Infinity;
			i = i || 0;
			if (i < 0) {
				t = n.contents().length || n.text().length;
				i = t + i;
			}
			if (j < 0) {
				t = n.contents().length || n.text().length;
				j = t + j;
			}
			if (j === Infinity) {
				R.selectNodeContents(n[0]);
			} else {
				R.setStart(n[0], i);
				R.setEnd(e[0], j);
			}
			monotype.restore(R);
			m = monotype(m, opt);
			return m;
		};
		return m;
	};
}
