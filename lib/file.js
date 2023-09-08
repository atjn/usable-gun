import gunPlugin from "../gun.js";
import __import_node_fs from "node:fs";
import __import_node_path from "node:path";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;

	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	// This was written by the wonderful Forrest Tait
	// modified by Mark to be part of core for convenience
	// twas not designed for production use
	// only simple local development.
	var Gun = gunPlugin(__usable_environment);

	var fs = __import_node_fs;
	Gun.on("create", function (root) {
		this.to.next(root);
		var opt = root.opt;
		if (true !== opt.localStorage) {
			return;
		}
		if (false === opt.localStorage) {
			return;
		}
		//if(process.env.RAD_ENV){ return }
		//if(process.env.AWS_S3_BUCKET){ return }
		opt.file = String(opt.file || "data.json");
		var graph = root.graph;
		var acks = {};
		var count = 0;
		var to;
		var disk =
			Gun.obj.ify(
				(fs.existsSync || __import_node_path.existsSync)(opt.file)
					? fs.readFileSync(opt.file).toString()
					: null,
			) || {};
		Gun.log.once(
			"file-warning",
			"WARNING! This `file.js` module for gun is " +
				"intended for local development testing only!",
		);
		root.on("put", function (at) {
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
		root.on("get", function (at) {
			this.to.next(at);
			var lex = at.get;
			var soul;
			var data;
			//setTimeout(function(){
			if (!lex || !(soul = lex["#"])) {
				return;
			}
			//if(0 >= at.cap){ return }
			if (Gun.obj.is(soul)) {
				return match(at);
			}
			var field = lex["."];
			data = disk[soul] || undefined;
			if (data && field) {
				data = Gun.state.to(data, field);
			}
			root.on("in", {
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
			clearTimeout(to);
			to = false;
			var ack = acks;
			acks = {};
			fs.writeFile(opt.file, JSON.stringify(disk), (err) => {
				wait = false;
				var tmp = count;
				count = 0;
				Gun.obj.map(ack, (yes, id) => {
					root.on("in", {
						"@": id,
						err,
						ok: err ? undefined : 1,
					});
				});
				if (1 < tmp) {
					flush();
				}
			});
		};
		function match(at) {
			var rgx = at.get["#"];
			var has = at.get["."];
			Gun.obj.map(disk, (node, soul, put) => {
				if (!Gun.text.match(soul, rgx)) {
					return;
				}
				if (has) {
					node = Gun.state.to(node, has);
				}
				(put = {})[soul] = node;
				root.on("in", {
					put,
					"@": at["#"],
				});
			});
		}
	});
}
