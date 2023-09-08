let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
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

	(() => {
		// JSON: JavaScript Object Notation
		// YSON: Yielding javaScript Object Notation
		var yson = {};

		var sI =
			__usable_globalThis.settimeoutTurn ||
			(typeof __usable_globalThis.setImmediate != "undefined" &&
				__usable_globalThis.setImmediate) ||
			setTimeout;
		yson.parseAsync = (text, done, revive, M) => {
			if ("string" != typeof text) {
				try {
					done(undefined, JSON.parse(text));
				} catch (e) {
					done(e);
				}
				return;
			}
			var ctx = {
				i: 0,
				text,
				done,
				l: text.length,
				up: [],
			};
			//M = 1024 * 1024 * 100;
			//M = M || 1024 * 64;
			M = M || 1024 * 32;
			parse();
			function parse() {
				//var S = +new Date;
				var s = ctx.text;
				var i = ctx.i;
				var l = ctx.l;
				var j = 0;
				var w = ctx.w;
				var b;
				var tmp;
				while (j++ < M) {
					var c = s[i++];
					if (i > l) {
						ctx.end = true;
						break;
					}
					if (w) {
						i = s.indexOf('"', i - 1);
						c = s[i];
						tmp = 0;
						while ("\\" == s[i - ++tmp]) {}
						tmp = !(tmp % 2); //tmp = ('\\' == s[i-1]); // json is stupid
						b = b || tmp;
						if ('"' == c && !tmp) {
							w = undefined;
							tmp = ctx.s;
							if (ctx.a) {
								tmp = s.slice(ctx.sl, i);
								if (b || 1 + tmp.indexOf("\\")) {
									tmp = JSON.parse('"' + tmp + '"');
								} // escape + unicode :( handling
								if (ctx.at instanceof Array) {
									ctx.at.push((ctx.s = tmp));
								} else {
									if (!ctx.at) {
										ctx.end = j = M;
										tmp = undefined;
									}
									(ctx.at || {})[ctx.s] = ctx.s = tmp;
								}
								ctx.s = undefined;
							} else {
								ctx.s = s.slice(ctx.sl, i);
								if (b || 1 + ctx.s.indexOf("\\")) {
									ctx.s = JSON.parse('"' + ctx.s + '"');
								} // escape + unicode :( handling
							}

							ctx.a = b = undefined;
						}
						++i;
					} else {
						switch (c) {
							case '"':
								ctx.sl = i;
								w = true;
								break;
							case ":":
								ctx.ai = i;
								ctx.a = true;
								break;
							case ",":
								if (ctx.a || ctx.at instanceof Array) {
									if ((tmp = s.slice(ctx.ai, i - 1))) {
										if (undefined !== (tmp = value(tmp))) {
											if (ctx.at instanceof Array) {
												ctx.at.push(tmp);
											} else {
												ctx.at[ctx.s] = tmp;
											}
										}
									}
								}
								ctx.a = undefined;
								if (ctx.at instanceof Array) {
									ctx.a = true;
									ctx.ai = i;
								}
								break;
							case "{":
								ctx.up.push(ctx.at || (ctx.at = {}));
								if (ctx.at instanceof Array) {
									ctx.at.push((ctx.at = {}));
								} else if (undefined !== (tmp = ctx.s)) {
									ctx.at[tmp] = ctx.at = {};
								}
								ctx.a = undefined;
								break;
							case "}":
								if (ctx.a) {
									if ((tmp = s.slice(ctx.ai, i - 1))) {
										if (undefined !== (tmp = value(tmp))) {
											if (ctx.at instanceof Array) {
												ctx.at.push(tmp);
											} else {
												if (!ctx.at) {
													ctx.end = j = M;
													tmp = undefined;
												}
												(ctx.at || {})[ctx.s] = tmp;
											}
										}
									}
								}
								ctx.a = undefined;
								ctx.at = ctx.up.pop();
								break;
							case "[":
								if (undefined !== (tmp = ctx.s)) {
									ctx.up.push(ctx.at);
									ctx.at[tmp] = ctx.at = [];
								} else if (!ctx.at) {
									ctx.up.push((ctx.at = []));
								}
								ctx.a = true;
								ctx.ai = i;
								break;
							case "]":
								if (ctx.a) {
									if ((tmp = s.slice(ctx.ai, i - 1))) {
										if (undefined !== (tmp = value(tmp))) {
											if (ctx.at instanceof Array) {
												ctx.at.push(tmp);
											} else {
												ctx.at[ctx.s] = tmp;
											}
										}
									}
								}
								ctx.a = undefined;
								ctx.at = ctx.up.pop();
								break;
						}
					}
				}
				ctx.s = undefined;
				ctx.i = i;
				ctx.w = w;
				if (ctx.end) {
					tmp = ctx.at;
					if (undefined === tmp) {
						try {
							tmp = JSON.parse(text);
						} catch (e) {
							return ctx.done(e);
						}
					}
					ctx.done(undefined, tmp);
				} else {
					sI(parse);
				}
			}
		};
		function value(s) {
			var n = parseFloat(s);
			if (!isNaN(n)) {
				return n;
			}
			s = s.trim();
			if ("true" == s) {
				return true;
			}
			if ("false" == s) {
				return false;
			}
			if ("null" == s) {
				return null;
			}
		}
		yson.stringifyAsync = (data, done, replacer, space, ctx) => {
			//try{done(u, JSON.stringify(data, replacer, space))}catch(e){done(e)}return;
			ctx = ctx || {};
			ctx.text = ctx.text || "";
			ctx.up = [
				(ctx.at = {
					d: data,
				}),
			];
			ctx.done = done;
			ctx.i = 0;
			var j = 0;
			ify();
			function ify() {
				var at = ctx.at;
				var data = at.d;
				var add = "";
				var tmp;
				if (at.i && at.i - at.j > 0) {
					add += ",";
				}
				if (undefined !== (tmp = at.k)) {
					add += JSON.stringify(tmp) + ":";
				} //'"'+tmp+'":' } // only if backslash
				switch (typeof data) {
					case "boolean":
						add += "" + data;
						break;
					case "string":
						add += JSON.stringify(data); //ctx.text += '"'+data+'"';//JSON.stringify(data); // only if backslash
						break;
					case "number":
						add += isNaN(data) ? "null" : data;
						break;
					case "object":
						if (!data) {
							add += "null";
							break;
						}
						if (data instanceof Array) {
							add += "[";
							at = {
								i: -1,
								as: data,
								up: at,
								j: 0,
							};
							at.l = data.length;
							ctx.up.push((ctx.at = at));
							break;
						}
						if ("function" != typeof (data || "").toJSON) {
							add += "{";
							at = {
								i: -1,
								ok: Object.keys(data).sort(),
								as: data,
								up: at,
								j: 0,
							};
							at.l = at.ok.length;
							ctx.up.push((ctx.at = at));
							break;
						}
						if ((tmp = data.toJSON())) {
							add += tmp;
							break;
						}
					// let this & below pass into default case...
					case "function":
						if (at.as instanceof Array) {
							add += "null";
							break;
						}
					default:
						// handle wrongly added leading `,` if previous item not JSON-able.
						add = "";
						at.j++;
				}
				ctx.text += add;
				while (1 + at.i >= at.l) {
					ctx.text += at.ok ? "}" : "]";
					at = ctx.at = at.up;
				}
				if (++at.i < at.l) {
					if ((tmp = at.ok)) {
						at.d = at.as[(at.k = tmp[at.i])];
					} else {
						at.d = at.as[at.i];
					}
					if (++j < 9) {
						return ify();
					} else {
						j = 0;
					}
					sI(ify);
					return;
				}
				ctx.done(undefined, ctx.text);
			}
		};
		if (typeof __usable_window != "undefined") {
			__usable_window.YSON = yson;
		}
		try {
			__usable_module.exports = yson;
		} catch (e) {}
		if (typeof JSON != "undefined") {
			__usable_globalThis.jsonParseAsync = yson.parseAsync;
			__usable_globalThis.jsonStringifyAsync = yson.stringifyAsync;
		}
	})();
	__usable_environment.exports.lib.yson = __usable_module.exports;
	return __usable_module.exports;
}
