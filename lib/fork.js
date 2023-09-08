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

	/*
  describe('API Chain Features', function(){
      describe('Gun.chain.fork', function(){
         var gun = Gun();
         var fork;
         it('create fork', function(done){
             fork = gun.fork().wire();
             done();
         });			
         it('put data via fork', function(done){								
             fork.get("fork-test").get("fork").put("test123").once(()=>done());				
         });			
         it('get data via main', function(done){								
             gun.get("fork-test").get("fork").once((data)=>{
                 expect(data).to.be("test123");
                 done();
             });				
         });			
         it('put data via main', function(done){								
             gun.get("fork-test").get("main").put("test321").once(()=>done());				
         });			
         it('get data via fork', function(done){								
             fork.get("fork-test").get("main").once((data)=>{
                 expect(data).to.be("test321");
                 done();
             });				
         });
     })
  })
  */
	((Gun) => {
		/**
		 *
		 *  credits:
		 *      github:bmatusiak
		 *
		 */
		Gun.chain.fork = function (g) {
			var gun = this._;
			var w = {};

			var mesh = () => {
				var root = gun.root,
					opt = root.opt;
				return opt.mesh || Gun.Mesh(root);
			};

			w.link = function () {
				if (this._l) return this._l;
				this._l = {
					send: (msg) => {
						if (!this.l || !this.l.onmessage) throw "not attached";
						this.l.onmessage(msg);
					},
				};
				return this._l;
			};
			w.attach = function (l) {
				if (this.l) throw "already attached";
				var peer = {
					wire: l,
				};
				l.onmessage = (msg) => {
					mesh().hear(msg.data || msg, peer);
				};
				mesh().hi((this.l = l && peer));
			};
			w.wire = (opts) => {
				var f = new Gun(opts);
				f.fork(w);
				return f;
			};
			if (g) {
				w.attach(g.link());
				g.attach(w.link());
			}
			return w;
		};
	})(
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment),
	);
}
