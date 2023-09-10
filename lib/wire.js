import gunPlugin from "../gun.js";
import __import_node_url from "node:url";
import __import_ws from "../usableLib/wsWrapper.js";
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
	/* BEGIN WRAPPED GUN CODE */

	var Gun = gunPlugin(__usable_environment);

	/*
  	An Ad-Hoc Mesh-Network Daisy-Chain
  	should work even if humans are
  	communicating with each other blind.
  
  	To prevent infinite broadcast loops,
  	we use a deduplication process
  	based on the message's identifier.
  	This is currently implemented in core.
  
  	However, because this still creates a
  	N*2 (where N is the number of connections)
  	flood, it is not scalable for traditional
  	services that have a hub network topology.
  
  	Does this mean we have to abandon mesh
  	algorithms? No, we can simply layer more
  	efficient optimizations in based on constraints.
  	If these constraints exist, it automatically
  	upgrades, but if not, it falls back to the
  	brute-force mesh based robust algorithm.
  	A simple example is to limit peer connections
  	and rely upon daisy chaining to relay messages.
  
  	Another example, is if peers are willing to
  	identify themselves, then we can improve the
  	efficiency of the network by having each peer
  	include the names of peers it is connected in
  	each message. Then each subsequent peer will
  	not relay it to them, since it is unnecessary.
  	This should create N (where N is the number of
  	peers) messages (or possibly N+ if there is a
  	common peer of uncommon peers that receives it
  	and relays at exact latency timings), which is
  	optimal.
  
  	Since computer networks aren't actually blind,
  	we will implement the above method to improve
  	the performance of the ad-hoc mesh network.
  
  	But why not have every message contain the
  	whole history of peers that it relayed through?
  	Because in sufficiently large enough networks,
  	with extensive daisy chaining, this will cause
  	the message to become prohibitively slow and
  	increase indefinitely in size.
  
  */

	Gun.on("opt", function (root) {
		var opt = root.opt;
		if (false === opt.ws || opt.once) {
			this.to.next(root);
			return;
		}
		opt.mesh = opt.mesh || Gun.Mesh(root);
		opt.WebSocket = opt.WebSocket || __import_ws;
		var ws = (opt.ws = opt.ws || {});
		ws.path = ws.path || "/gun";
		// if we DO need an HTTP server, then choose ws specific one or GUN default one.
		if (!ws.noServer) {
			ws.server = ws.server || opt.web;
			if (!ws.server) {
				this.to.next(root);
				return;
			} // ugh, bug fix for @jamierez & unstoppable ryan.
		}

		ws.web = ws.web || new opt.WebSocket.Server(ws); // we still need a WS server.
		ws.web.on("connection", (wire, req) => {
			var peer;
			wire.headers = wire.headers || (req || "").headers || "";
			__usable_globalThis.debug.STAT &&
				((__usable_globalThis.debug.STAT.sites ||
					(__usable_globalThis.debug.STAT.sites = {}))[
					wire.headers.origin
				] = 1);
			opt.mesh.hi(
				(peer = {
					wire,
				}),
			);
			wire.on("message", (msg) => {
				opt.mesh.hear(msg.data || msg, peer);
			});
			wire.on("close", () => {
				opt.mesh.bye(peer);
			});
			wire.on("error", () => {});
			setTimeout(function heart() {
				if (!opt.peers[peer.id]) {
					return;
				}
				try {
					wire.send("[]");
				} catch (e) {}
				setTimeout(heart, 1000 * 20);
			}, 1000 * 20); // Some systems, like Heroku, require heartbeats to not time out. // TODO: Make this configurable? // TODO: PERF: Find better approach than try/timeouts?
		});

		this.to.next(root);
	});
	return;
}
