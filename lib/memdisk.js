import gunPlugin from "../gun.js";
let __usable_isActivated = false;
export default async function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;

	/* BEGIN WRAPPED GUN CODE */ // Take caution running this in production, it ONLY saves to disk what is in memory.
	var Gun = gunPlugin(__usable_environment);

	var fs = (await import("node:fs")).default;
	await Gun.on("opt", async function (ctx) {
		this.to.next(ctx);
		var opt = ctx.opt;
		if (ctx.once) {
			return;
		}
		opt.file = String(opt.file || "data.json");
		var graph = ctx.graph;
		var acks = {};
		var count = 0;
		var to;
		var disk =
			(await Gun.obj.ify(
				(await (
					fs.existsSync || (await import("node:path")).default.existsSync
				)(opt.file))
					? fs.readFileSync(opt.file).toString()
					: null,
			)) || {};
		ctx.on("put", function (at) {
			this.to.next(at);
			Gun.graph.is(at.put, null, map);
			if (!at["@"]) {
				acks[at["#"]] = true;
			} // only ack non-acks.
			count += 1;
			if (count >= (opt.batch || 10000)) {
				return flush();
			}
			if (to) {
				return;
			}
			to = setTimeout(flush, opt.wait || 1);
		});
		ctx.on("get", function (at) {
			this.to.next(at);
			var lex = at.get;
			var soul;
			var data;
			//setTimeout(function(){
			if (!lex || !(soul = lex["#"])) {
				return;
			}
			//if(0 >= at.cap){ return }
			var field = lex["."];
			data = disk[soul] || undefined;
			if (data && field) {
				data = Gun.state.to(data, field);
			}
			ctx.on("in", {
				"@": at["#"],
				put: Gun.graph.node(data),
			});
			//},11);
		});

		var map = (val, key, node, soul) => {
			disk[soul] = Gun.state.to(node, key, disk[soul]);
		};
		var wait;
		var flush = () => {
			if (wait) {
				return;
			}
			wait = true;
			clearTimeout(to);
			to = false;
			var ack = acks;
			acks = {};
			fs.writeFile(opt.file, JSON.stringify(disk, null, 2), (err) => {
				wait = false;
				var tmp = count;
				count = 0;
				Gun.obj.map(ack, (yes, id) => {
					ctx.on("in", {
						"@": id,
						err,
						ok: 0, // memdisk should not be relied upon as permanent storage.
					});
				});

				if (1 < tmp) {
					flush();
				}
			});
		};
	});
}
