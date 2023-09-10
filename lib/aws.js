import awsSdkImport from "aws-sdk";
import gunPlugin from "../gun.js";
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
	const __usable_process =
		__usable_environment.environmentHint !== "server"
			? undefined
			: "process" in globalThis
			? process
			: {
					env: {},
					uptime: () => {},
					cpuUsage: () => {},
					memoryUsage: () => {},
			  };

	/* BEGIN WRAPPED GUN CODE */

	__usable_module.exports = ((a) => {
		function s3(opt) {
			if (!(this instanceof s3)) {
				return new s3(opt);
			}
			var s = this;
			opt = opt || {};
			opt.bucket =
				opt.bucket || opt.Bucket || __usable_process.env.AWS_S3_BUCKET;
			opt.region = opt.region || __usable_process.env.AWS_REGION || "us-east-1";
			opt.accessKeyId = opt.key =
				opt.key || opt.accessKeyId || __usable_process.env.AWS_ACCESS_KEY_ID;
			opt.secretAccessKey = opt.secret =
				opt.secret ||
				opt.secretAccessKey ||
				__usable_process.env.AWS_SECRET_ACCESS_KEY;
			if (!opt.accessKeyId || !opt.secretAccessKey) {
				return 0;
			}
			s.config = opt;
			s.AWS = awsSdkImport;
			s.on = a.on;
			if (
				(s.config.fakes3 =
					s.config.fakes3 || opt.fakes3 || __usable_process.env.fakes3)
			) {
				s.AWS.config.endpoint = s.config.endpoint =
					opt.fakes3 || s.config.fakes3 || __usable_process.env.fakes3;
				s.AWS.config.sslEnabled = s.config.sslEnabled = false;
				s.AWS.config.bucket = s.config.bucket = s.config.bucket.replace(
					".",
					"p",
				);
			}
			s.AWS.config.update(s.config);
			s.S3 = function () {
				var s = new this.AWS.S3();
				if (this.config.fakes3) {
					s.endpoint = s.config.endpoint;
				}
				return s;
			};
			return s;
		}
		s3.id = (m) => m.Bucket + "/" + m.Key;
		s3.chain = s3.prototype;
		s3.chain.PUT = function (key, o, cb, m) {
			if (!key) {
				return;
			}
			m = m || {};
			m.Bucket = m.Bucket || this.config.bucket;
			m.Key = m.Key || key;
			if (a.obj.is(o) || a.list.is(o)) {
				m.Body = a.text.ify(o);
				m.ContentType = "application/json";
			} else {
				m.Body = a.text.is(o) ? o : a.text.ify(o);
			}
			this.S3().putObject(m, (e, r) => {
				//a.log('saved', e,r);
				if (!cb) {
					return;
				}
				cb(e, r);
			});
			return this;
		};
		s3.chain.GET = function (key, cb) {
			if (!key) {
				return;
			}
			var s = this;

			var m = {
				Bucket: s.config.bucket,
				Key: key,
			};

			var id = s3.id(m);
			s.on(id, function (arg) {
				var e = arg[0];
				var d = arg[1];
				var t = arg[2];
				var m = arg[3];
				var r = arg[4];
				this.off();
				delete s.batch[id];
				if (!a.fn.is(cb)) {
					return;
				}
				try {
					cb(e, d, t, m, r);
				} catch (e) {
					__usable_globalThis.debug.log(e);
				}
			});
			s.batch = s.batch || {};
			if (s.batch[id]) {
				return s;
			}
			s.batch[id] = (s.batch[id] || 0) + 1;
			s.S3().getObject(m, function (e, r) {
				var d;
				var t;
				var m;
				r = r || (this && this.httpResponse);
				if (e || !r) {
					return s.on(id, [e]);
				}
				r.Text = r.text = t = (r.Body || r.body || "").toString("utf8");
				r.Type = r.type = r.ContentType || (r.headers || {})["content-type"];
				if (r.type && "application/json" === r.type) {
					d = a.obj.ify(t);
				}
				m = r.Metadata;
				s.on(id, [e, d, t, m, r]); // Warning about the r parameter, is is the raw response and may result in stupid SAX errors.
			});

			return s;
		};
		s3.chain.del = function (key, cb) {
			if (!key) {
				return;
			}
			var m = {
				Bucket: this.config.bucket,
				Key: key,
			};
			this.S3().deleteObject(m, (e, r) => {
				if (!cb) {
					return;
				}
				cb(e, r);
			});
			return this;
		};
		s3.chain.dbs = function (o, cb) {
			cb = cb || o;
			this.S3().listBuckets({}, (e, r) => {
				//a.log('dbs',e);
				a.list.map((r || {}).Contents, (v) => {
					__usable_globalThis.debug.log(v);
				});
				//a.log('---end list---');
				if (!a.fn.is(cb)) return;
				cb(e, r);
			});
			return this;
		};
		s3.chain.keys = function (from, upto, cb) {
			cb = cb || upto || from;
			var m = {
				Bucket: this.config.bucket,
			};
			if (a.text.is(from)) {
				m.Prefix = from;
			}
			if (a.text.is(upto)) {
				m.Delimiter = upto;
			}
			this.S3().listObjects(m, (e, r) => {
				//a.log('list',e);
				a.list.map((r || {}).Contents, (v) => {
					__usable_globalThis.debug.log(v);
				});
				//a.log('---end list---');
				if (!a.fn.is(cb)) return;
				cb(e, r);
			});
			return this;
		};
		return s3;
	})(gunPlugin(__usable_environment), {});
	/**
  Knox S3 Config is:
  knox.createClient({
      key: ''
    , secret: ''
    , bucket: ''
    , endpoint: 'us-standard'
    , port: 0
    , secure: true
    , token: ''
    , style: ''
    , agent: ''
  });
  
  aws-sdk for s3 is:
  { "accessKeyId": "akid", "secretAccessKey": "secret", "region": "us-west-2" }
  AWS.config.loadFromPath('./config.json');
   {
  	accessKeyId: process.env.AWS_ACCESS_KEY_ID = ''
  	,secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY = ''
  	,Bucket: process.env.s3Bucket = ''
  	,region: process.env.AWS_REGION = "us-east-1"
  	,sslEnabled: ''
  }
  **/

	__usable_environment.exports.lib.aws = __usable_module.exports;
	return __usable_module.exports;
}
