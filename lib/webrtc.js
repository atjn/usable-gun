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
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */
	(() => {
		var Gun =
			typeof __usable_window !== "undefined"
				? __usable_window.Gun
				: gunPlugin(__usable_environment);
		Gun.on("opt", function (root) {
			this.to.next(root);
			var opt = root.opt;
			if (root.once) {
				return;
			}
			if (!Gun.Mesh) {
				return;
			}
			if (false === opt.RTCPeerConnection) {
				return;
			}
			var env;
			if (typeof __usable_window !== "undefined") {
				env = __usable_window;
			}
			if (typeof __usable_globalThis !== "undefined") {
				env = __usable_globalThis;
			}
			env = env || {};
			var rtcpc =
				opt.RTCPeerConnection ||
				env.RTCPeerConnection ||
				env.webkitRTCPeerConnection ||
				env.mozRTCPeerConnection;
			var rtcsd =
				opt.RTCSessionDescription ||
				env.RTCSessionDescription ||
				env.webkitRTCSessionDescription ||
				env.mozRTCSessionDescription;
			var rtcic =
				opt.RTCIceCandidate ||
				env.RTCIceCandidate ||
				env.webkitRTCIceCandidate ||
				env.mozRTCIceCandidate;
			if (!rtcpc || !rtcsd || !rtcic) {
				return;
			}
			opt.RTCPeerConnection = rtcpc;
			opt.RTCSessionDescription = rtcsd;
			opt.RTCIceCandidate = rtcic;
			opt.rtc = opt.rtc || {
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
					{
						urls: "stun:stun.sipgate.net:3478",
					} /*,
          {urls: "stun:stun.stunprotocol.org"},
          {urls: "stun:stun.sipgate.net:10000"},
          {urls: "stun:217.10.68.152:10000"},
          {urls: 'stun:stun.services.mozilla.com'}*/,
				],
			};
			// TODO: Select the most appropriate stuns.
			// FIXME: Find the wire throwing ICE Failed
			// The above change corrects at least firefox RTC Peer handler where it **throws** on over 6 ice servers, and updates url: to urls: removing deprecation warning
			opt.rtc.dataChannel = opt.rtc.dataChannel || {
				ordered: false,
				maxRetransmits: 2,
			};
			opt.rtc.sdp = opt.rtc.sdp || {
				mandatory: {
					OfferToReceiveAudio: false,
					OfferToReceiveVideo: false,
				},
			};
			opt.rtc.max = opt.rtc.max || 55; // is this a magic number? // For Future WebRTC notes: Chrome 500 max limit, however 256 likely - FF "none", webtorrent does 55 per torrent.
			opt.rtc.room =
				opt.rtc.room ||
				(Gun.window && (location.hash.slice(1) || location.pathname.slice(1)));
			opt.announce = () => {
				opt.rtc.start = +new Date(); // handle room logic:
				root.$.get("/RTC/" + opt.rtc.room + "<?99")
					.get("+")
					.put(
						opt.pid,
						(ack) => {
							if (!ack.ok || !ack.ok.rtc) {
								return;
							}
							open(ack);
						},
						{
							acks: opt.rtc.max,
						},
					)
					.on((last, key, msg) => {
						if (last === opt.pid || opt.rtc.start > msg.put[">"]) {
							return;
						}
						open({
							"#": "" + msg["#"],
							ok: {
								rtc: {
									id: last,
								},
							},
						});
					});
			};
			var mesh = (opt.mesh = opt.mesh || Gun.Mesh(root));
			root.on("create", function (at) {
				this.to.next(at);
				setTimeout(opt.announce, 1);
			});
			function open(msg) {
				if (this && this.off) {
					this.off();
				} // Ignore this, because of ask / ack.
				if (!msg.ok) {
					return;
				}
				var rtc = msg.ok.rtc;
				var peer;
				var tmp;
				if (!rtc || !rtc.id || rtc.id === opt.pid) {
					return;
				}
				//console.log("webrtc:", JSON.stringify(msg));
				if ((tmp = rtc.answer)) {
					if (!(peer = opt.peers[rtc.id] || open[rtc.id]) || peer.remoteSet) {
						return;
					}
					tmp.sdp = tmp.sdp.replace(/\\r\\n/g, "\r\n");
					return peer.setRemoteDescription(
						(peer.remoteSet = new opt.RTCSessionDescription(tmp)),
					);
				}
				if ((tmp = rtc.candidate)) {
					peer =
						opt.peers[rtc.id] ||
						open[rtc.id] ||
						open({
							ok: {
								rtc: {
									id: rtc.id,
								},
							},
						});
					return peer.addIceCandidate(new opt.RTCIceCandidate(tmp));
				}
				//if(opt.peers[rtc.id]){ return }
				if (open[rtc.id]) {
					return;
				}
				(peer = new opt.RTCPeerConnection(opt.rtc)).id = rtc.id;
				var wire = (peer.wire = peer.createDataChannel(
					"dc",
					opt.rtc.dataChannel,
				));
				open[rtc.id] = peer;
				wire.to = setTimeout(() => {
					delete open[rtc.id];
				}, 1000 * 60);
				wire.onclose = () => {
					mesh.bye(peer);
				};
				wire.onerror = () => {};
				wire.onopen = () => {
					delete open[rtc.id];
					mesh.hi(peer);
				};
				wire.onmessage = (msg) => {
					if (!msg) {
						return;
					}
					//console.log('via rtc');
					mesh.hear(msg.data || msg, peer);
				};
				peer.onicecandidate = (e) => {
					// source: EasyRTC!
					if (!e.candidate) {
						return;
					}
					root.on("out", {
						"@": msg["#"],
						ok: {
							rtc: {
								candidate: e.candidate,
								id: opt.pid,
							},
						},
					});
				};
				peer.ondatachannel = (e) => {
					var rc = e.channel;
					rc.onmessage = wire.onmessage;
					rc.onopen = wire.onopen;
					rc.onclose = wire.onclose;
				};
				if ((tmp = rtc.offer)) {
					rtc.offer.sdp = rtc.offer.sdp.replace(/\\r\\n/g, "\r\n");
					peer.setRemoteDescription(new opt.RTCSessionDescription(tmp));
					peer.createAnswer(
						(answer) => {
							peer.setLocalDescription(answer);
							root.on("out", {
								"@": msg["#"],
								ok: {
									rtc: {
										answer,
										id: opt.pid,
									},
								},
							});
						},
						() => {},
						opt.rtc.sdp,
					);
					return;
				}
				peer.createOffer(
					(offer) => {
						peer.setLocalDescription(offer);
						root.on("out", {
							"@": msg["#"],
							"#": root.ask(open),
							ok: {
								rtc: {
									offer,
									id: opt.pid,
								},
							},
						});
					},
					() => {},
					opt.rtc.sdp,
				);
				return peer;
			}
		});
	})();
}
