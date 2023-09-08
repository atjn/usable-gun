

export class NoDebugger{
	#noop(){}
	get noop(){
		return this.#noop;
	}
	get log(){
		return this.#noop;
	}
	get info(){
		return this.#noop;
	}
	get debug(){
		return this.#noop;
	}
	get warn(){
		return this.#noop;
	}
	get error(){
		return this.#noop;
	}
	// Custom gun method
	get STAT(){
		return this.#noop;
	}
	set STAT(stat){}
}

class FilterDebuggerBase{
	constructor(filter){
		const enable = filter?.enable;
		const disable = filter?.disable;
		if(enable && disable) throw new TypeError(`Debugger can only accept an enable list or a disable list, not both`);
		if(enable && !Array.isArray(enable)) throw new TypeError(`Debugger was expecting a list of log levels to enable, but got ${typeof enable}: ${enable}`);
		if(disable && !Array.isArray(disable)) throw new TypeError(`Debugger was expecting a list of log levels to disable, but got ${typeof disable}: ${disable}`);
		this.#enable = enable;
		this.#disable = disable;
	}

	#enable;
	#disable;

	#noop(){}
	get noop(){
		return this.#noop;
	}

	#levelIsEnabled(level){
		if(this.#enable){
			return this.#enable.includes(level);
		}
		if(this.#disable){
			return !this.#disable.includes(level);
		}
		return true;
	}
	get levelIsEnabled(){
		return this.#levelIsEnabled;
	}
}

export class ConsoleDebugger extends FilterDebuggerBase{
	constructor(filter){
		super(filter);
	}

	get log(){
		return this.levelIsEnabled("log") ? console.log : this.noop;
	}

	get info(){
		return this.levelIsEnabled("info") ? console.info : this.noop;
	}

	get debug(){
		return this.levelIsEnabled("debug") ? console.debug : this.noop;
	}

	get warn(){
		return this.levelIsEnabled("warn") ? console.warn : this.noop;
	}

	get error(){
		return this.levelIsEnabled("error") ? console.error : this.noop;
	}

	// Custom gun method
	#STAT = console.debug;
	get STAT(){
		return this.levelIsEnabled("STAT") ? this.#STAT : this.noop;
	}
	set STAT(stat){
		this.#STAT = stat;
	}

}

export class StoreDebugger extends FilterDebuggerBase{
	constructor(filter){
		super(filter);
	}

	#logs = [];
	get logs(){
		return this.#logs;
	}

	#subscribers = [];
	#updateSubscribers(){
		for(const subscriber of this.#subscribers){
			subscriber(this.#logs);
		}
	}
	#subscribe(subscriber){
		this.#subscribers.push(subscriber);
		subscriber(this.#logs);
        
		// Return a function that can unsubscribe the handler
		return () => (this.#subscribers = this.#subscribers.filter(candidate => candidate !== subscriber));
	}
	get subscribe(){
		return this.#subscribe;
	}

	#log(...items){
		this.#logs.push({level: "log", items});
		this.#updateSubscribers();
	}
	get log(){
		return this.levelIsEnabled("log") ? this.#log : this.noop;
	}

	#info(...items){
		this.#logs.push({level: "info", items});
		this.#updateSubscribers();
	}
	get info(){
		return this.levelIsEnabled("info") ? this.#info : this.noop;
	}

	#debug(...items){
		this.#logs.push({level: "debug", items});
		this.#updateSubscribers();
	}
	get debug(){
		return this.levelIsEnabled("debug") ? this.#debug : this.noop;
	}

	#warn(...items){
		this.#logs.push({level: "warn", items});
		this.#updateSubscribers();
	}
	get warn(){
		return this.levelIsEnabled("warn") ? this.#warn : this.noop;
	}

	#error(...items){
		this.#logs.push({level: "error", items});
		this.#updateSubscribers();
	}
	get error(){
		return this.levelIsEnabled("error") ? this.#error : this.noop;
	}

	// Custom gun method
	#STAT = (...items) => {
		this.#logs.push({level: "STAT", items});
		this.#updateSubscribers();
	}
	get STAT(){
		return this.levelIsEnabled("STAT") ? this.#STAT : this.noop;
	}
	set STAT(stat){
		this.#STAT = stat;
	}

}
