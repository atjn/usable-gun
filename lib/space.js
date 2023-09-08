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

	/* BEGIN WRAPPED GUN CODE */

	(() => {
		var Gun =
			typeof __usable_window !== "undefined"
				? __usable_window.Gun
				: gunPlugin(__usable_environment);
		var ify = Gun.node.ify;
		var empty = {};
		__usable_globalThis.debug.log("Index space is beta, API may change!");
		Gun.chain.space = function (key, data, opt) {
			if (data instanceof Function) {
				return travel(key, data, opt, this);
			}
			var gun = this;
			if (Gun.is(data)) {
				data.get((soul) => {
					if (!soul) {
						return (
							cb &&
							cb({
								err: "Indexspace cannot link `undefined`!",
							})
						);
					}
					gun.space(key, Gun.val.link.ify(soul), opt);
				}, true);
				return gun;
			}
			var cb = opt instanceof Function && opt;
			var rank = (opt || empty).rank || opt;
			var root = gun.back(-1);
			gun.get((soul) => {
				if (!soul) {
					soul = (gun.back("opt.uuid") || Gun.text.random)(9);
				}

				/*var space = ify({}, soul), sub = space, l = 0, tmp;
        var atom = Gun.text.ify({get: key, put: data});
        Gun.list.map(index(0, key.length), function(i){
            sub[(tmp = key.slice(l, i))+'"'] = atom;
            sub = sub[tmp] = ify({}, soul+'"'+key.slice(0,i));
            l = i;
        });
        tmp = {}; tmp[key] = atom.put; tmp = ify(tmp, soul+'"');
        sub[key.slice(l, key.length)] = tmp;
        console.log('????', space);*/
				var shell = {};

				var l = 0;
				var tmp;
				var atom = Gun.text.ify({
					get: key,
					put: data,
				});
				tmp = {};
				tmp[key] = data;
				shell.$ = ify(tmp, soul);
				tmp = {};
				tmp[key.slice(0, (l = 1))] = atom;
				shell[0] = ify(tmp, soul + '"');
				Gun.list.map(index(1, key.length), (i) => {
					tmp = {};
					tmp[key.slice(l, i)] = atom;
					shell[i] = ify(tmp, soul + '"' + key.slice(0, l));
					l = i;
				});
				tmp = {};
				tmp[key.slice(l, key.length)] = atom;
				shell[l + 1] = ify(tmp, soul + '"' + key.slice(0, l));
				//tmp = {}; tmp[key.slice(l, key.length)] = Gun.val.link.ify(soul); shell[l+1] = ify(tmp, soul+'"'+key.slice(0,l));
				//console.log('???', shell);
				gun.put(shell, cb, {
					soul,
					shell,
				});
			}, true);
			return gun;
		};
		function travel(key, cb, opt, ref) {
			var root = ref.back(-1);
			opt = opt || {};
			opt.ack = opt.ack || {};
			ref.get((soul) => {
				ref.get(key).get((msg, eve) => {
					eve.off();
					opt.exact = true;
					opt.ack.key = key;
					opt.ack.data = msg.put;
					if (opt.match) {
						cb(opt.ack, key, msg, eve);
					}
				});
				//if(u !== msg.put){
				//	cb(msg.put, msg.get, msg, eve);
				//	return;
				//}
				opt.soul = soul;
				opt.start = soul + '"';
				opt.key = key;
				opt.top = index(0, opt.find);
				opt.low = opt.top.reverse();
				find(opt, cb, root);
			}, true);
		}
		function find(o, cb, root) {
			var id = o.start + o.key.slice(0, o.low[0]);
			root.get(id).get((msg, eve) => {
				eve.off();
				o.ack.tree = {};
				if (undefined === msg.put) {
					if (!o.exact) {
						return (o.match = true);
					}
					cb(o.ack, id, msg, eve);
					return;
				}
				Gun.node.is(msg.put, (v, k) => {
					if (!(k = Gun.obj.ify(v) || empty).get) {
						return;
					}
					o.ack.tree[k.get] = k.put;
				});
				if (!o.exact) {
					return (o.match = true);
				}
				cb(o.ack, id, msg, eve);
			});
		}
		function index(n, m, l, k) {
			l = l || [];
			if (!m) {
				return l;
			}
			k = Math.ceil((n || 1) / 10);
			if (n + k >= m) {
				return l;
			}
			l.push(n + k);
			return index(n + k, m, l);
		}
	})();

	/*
  gun.user('google').space('martti', "testing 123!");
  gun.user('google').get('search').space('ma', function(){
  	// tree & index
  	// UNFINISHED API!
  });
  */
}
