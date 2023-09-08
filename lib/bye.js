import gunPlugin from "../gun.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;
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
	Gun.on("create", function (root) {
		this.to.next(root);
		var mesh = root.opt.mesh;
		if (!mesh) {
			return;
		}
		mesh.hear["bye"] = (msg, peer) => {
			(peer.byes = peer.byes || []).push(msg.bye);
		};
		root.on("bye", function (peer) {
			this.to.next(peer);
			if (!peer.byes) {
				return;
			}
			var gun = root.$;
			Gun.obj.map(peer.byes, (data) => {
				Gun.obj.map(data, (put, soul) => {
					gun.get(soul).put(put);
				});
			});
			peer.byes = [];
		});
	});
	Gun.chain.bye = function () {
		var gun = this;
		var bye = gun.chain();
		var root = gun.back(-1);
		var put = bye.put;
		bye.put = (data) => {
			gun.back((at) => {
				if (!at.get) {
					return;
				}
				var tmp = data;
				(data = {})[at.get] = tmp;
			});
			root.on("out", {
				bye: data,
			});
			return gun;
		};
		return bye;
	};
}
