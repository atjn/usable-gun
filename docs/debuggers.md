# Usable plugins
[<- go back to to overview](../README.md)

A debugger is a class that is closely modelled after the standard `console`. It contains the following methods for logging:

- `log`
- `info`
- `debug`
- `warn`
- `error`
- `STAT`

The `STAT` method is non-standard and is used by some of the gun code for debugging information.

Each method should be synchronous and should be able to take any input arguments.

Here is an example of a very simple debugger that logs the values to `console`:
```js
class SimpleDebugger {
	log(...args){
		console.log(...args);
	}

	info(...args){
		console.info(...args);
	}

	debug(...args){
		console.debug(...args);
	}

	warn(...args){
		console.warn(...args);
	}

	error(...args){
		console.error(...args);
	}

	STAT(...args){
		console.debug(...args);
	}
}
```

Be aware that the Gun code sometimes uses other logging methods than the ones detailed here, and sometimes also adds strings as members to the debugger, for use as debug information. If you want to catch this information, you can put your debugger behind a [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) and thereby catch all activity on the debugger.
