

let __usable_isActivated = false;

const __usable_module = {};

export default function (__usable_environment, __usable_MODULE){
	if(__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;

	const __usable_globalThis = new Proxy(
		("window" in globalThis) ? window : globalThis, 
		{
			get(target, property, receiver){
				if(["window", "globalThis", "global"].includes(property)){
					return __usable_globalThis;
				}else if(__usable_environment.library[property] !== undefined){
					return __usable_environment.library[property];
				}else if("window" in globalThis){
					return window[property];
				}else{
					return globalThis[property];
				}
			},
			set(object, property, value){
				__usable_environment.library[property] = value;
				return true;
			},
		},
	);
	const __usable_window = __usable_environment.environmentHint !== "browser" ? undefined : new Proxy(
		("window" in globalThis) ? window : globalThis, 
		{
			get(target, property, receiver){
				if(["window", "globalThis", "global"].includes(property)){
					return __usable_window;
				}else if(__usable_environment.library[property] !== undefined){
					return __usable_environment.library[property];
				}else if("window" in globalThis){
					return window[property];
				}else{
					return undefined;
				}
			},
			set(object, property, value){
				__usable_environment.library[property] = value;
				return true;
			},
		},
	);
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	/* usable_insert_code */

	__usable_environment.exports/* usable_insert_export_members */ = __usable_module.exports;
	return __usable_module.exports;
}
