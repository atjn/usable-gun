import gunPlugin from "../gun.js";
import seaPlugin from "../sea.js";
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
		function resolve(chain) {
			/*
      	If we say "Spray paint all of Bob's friends' cat blue",
      	the embedded question we might need to ask is:
      	If one of Bob's friends winds up unfriending him,
      	AND has their cat die that they get a new cat,
      	do we want THAT cat painted blue?
      	I believe the answer is NO.
      */
			// soul.key=value
			// soul ???
			// stream -> soul.key ...
			// stream -> soul.key
			// if you have a dynamic map, and you want to "process it", you wind up waiting until at least 1 item exists, calling off, then calling each.
			// in this sense, resolve can only know it has processed each item once, but not whether it itself is done. and that is fair.
			// what about ops that read before writing like timegraph?
			//console.debug.i=1;console.log("----------------");
			/*
      gun.get('a').get('b').put({
      x: {
        x1: {c: {d: {'yay':1}}},
        x2: {c: {d: {'cake':1}}}
      },
      y: {
        y1: {c: {d: {'foo':1}}},
        y2: {c: {d: {'bar':1}}}
      }
      });
      /*
      map {10:{}, 5:{}} -> get link to load
      */
			// FOR THIS CHAIN: Each item gets called 3 times.
			Gun.debug = 1;
			//return;
			chain =
				chain ||
				__usable_globalThis.gun
					.get("a")
					.get("b")
					.map()
					.map()
					.get("c")
					.get("d")
					.get((a) => {
						// a.gun._.soul || a.gun._.link;
						a.ID = a.ID || Gun.text.random(2);
						__usable_globalThis.debug.log("********", a.put || a); //, Gun.node.soul(a.put), a.gun._);//, a.gun.back(function back(_){_.get && (tmp || (tmp = [])).push(_.get);return _.back? undefined : tmp;}));
						//b.rid(a);
					});

			__usable_globalThis.debug.log("~~~~~~~~~~~~~~");
			__usable_window.chain = chain;
		}
		/*
    	sync put: 5 node - 1 stop
    	sync reload: 1 link 2 node - X stop
    	sync resolve: 6 node - 0 stop : 3 node - 0 stop
    	async put: 5 node + 3 node - 1 stop
    	async reload: 2 link 1 node - X stop (2 links per each stop)
    	async resolve: 6 node - 0 stop : 3 node - 0 stop
    		sync put: 1 mum
    	sync reload: 1 mum
    	sync resolve: 1 mum
    	async put: 1 mum
    	async reload: 0 mum: 2 link 1 node
    	async resolve: 1 mum
    	*/

		/*
    gun.get('users').put({
    	alice: {age: 29},
    	bob: {age: 32}
    });
    */

		/*
    gun.get('x').get('y').get('z').put({xyz: 'zyx'});
    */

		__usable_window.resolve = resolve;
		__usable_window.off = (chain) => {
			//Gun.debug = 1;
			chain =
				chain ||
				__usable_globalThis.gun
					.get("users")
					.map()
					.get((a, b) => {
						__usable_globalThis.debug.log("***", a.put);
						b.rid(a);
					});
			__usable_globalThis.gun
				.get("users")
				.get("alice")
				.get((a) => {
					__usable_globalThis.debug.log(">>>", a.put);
				});
			__usable_globalThis.debug.log("vvvvvvvvvvvvv");
			__usable_window.chain = chain;
		};
		__usable_window.soul = (chain) => {
			Gun.debug = 1;
			__usable_globalThis.gun
				.get("x")
				.get("y")
				.get("z")
				.get("q")
				.get((a) => {
					__usable_globalThis.debug.log("***", a.put || a); //,b,c);
				});

			setTimeout(() => {
				__usable_globalThis.debug.debug.j = 1;
				__usable_globalThis.debug.debug.i = 1;
				__usable_globalThis.debug.log("------------");
				__usable_globalThis.gun
					.get("x")
					.get("y")
					.put({
						z: {
							q: {
								r: {
									hello: "world",
								},
							},
						},
					});
			}, 20);
			__usable_globalThis.debug.log("..............");
			__usable_window.chain = chain;
		};
		//localStorage.clear();sessionStorage.clear();
		setTimeout(() => {
			resolve();
		}, 1);

		/*
    	At the end of the day, you trust an entity, not data.
    	That entity might be a person, or a group of people,
    	it doesn't really matter - you do not trust a machine.
    		Trust gives write access (public).
    	Grant gives read access (private).
    	*/

		function Role() {}
		if (typeof __usable_window !== "undefined") {
			Role.window = __usable_window;
		}
		var Gun = (Role.window || {}).Gun || gunPlugin(__usable_environment);
		Gun.SEA || seaPlugin(__usable_environment);
		if (!Gun.User) {
			throw "No User System!";
		}
		var User = Gun.User;
		User.prototype.trust = () => {};
	})();
}
