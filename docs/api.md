# API reference
[<- go back to to overview](../README.md)

This is an overview of all the exports that are available from this package:

```js
import {
  // Base environment
	GunEnvironment,

  // Pre-made plugins to get started quickly
	basicGunPlugin,
	basicSeaPlugin,
	defaultGunPlugin,
	defaultSeaPlugin,
	defaultAxePlugin,
	defaultBrowserPlugin,
	// see `lib/server.js` for the default server plugin

  // Pre-made debuggers
	NoDebugger,
	ConsoleDebugger,
	StoreDebugger,
} from "usable-gun";
```

## `GunEnvironment`
The `GunEnvironment` class is the sandbox that Gun code runs inside. It takes a few options:

```js
new GunEnvironment({
  environmentHint: "browser",
  debug: new Debugger(),
  iContributeToGun: false,
});
```
### constructor: `{ environmentHint }`
Gun checks whether it is running in a browser or a node process, and can alter its behavior slightly depending on which environment it detects.

This can be set to either `browser` or `server`, and will trick Gun into thinking that it is running in the specified environment.

### constructor: `{ debug }`
This is the debugger that Gun will log to. By default, a `ConsoleDebugger` is used with only warnings and errors enabled. This means you will be notified of any major problems, but won't see debug information.

A common setup for development uses the `ConsoleDebugger` with all log levels enabled. Here is how to do that:
```js
import { GunEnvironment, ConsoleDebugger } from "usable-gun";

const gunEnvironment = new GunEnvironment({
  debugger: new ConsoleDebugger(),
});
```

The different debugger types and options are mentioned later in this reference.

If you want to write your own debugger, refer to [debuggers](.debuggers.md).

### constructor: `{ iContributeToGun }`
The original Gun code always logs a welcome message to the console. In the code, where the message is logged, there is a comment:

```js
// Please do not remove welcome log unless you are paying for a monthly sponsorship, thanks!
```

I choose to interpret this slightly more loosely. Please do not disable the welcome log unless you significantly contribute to gun, either monetarily, through development work, or by otherwise making it clear in your project that you are using Gun.

`iContributeToGun` is set to `false` by default, but if you think you do contribute significantly to gun, you can set it to `true`, and it will disable the welcome log.

### method: `usePlugins()`
Takes an array of `usable-gun` plugins and runs them in the sandbox. All existing Gun code has been transformed into plugins, so you can import any file and use its default export as a plugin. This package also exports a few common plugin setups that you can use.

```js
import { GunEnvironment } from "usable-gun";

// Use custom exports for common setups
import { defaultGunPlugin, basicSeaPlugin } from "usable-gun";

// Use default Gun paths
import gunPlugin from "usable-gun/gun";
import seaPlugin from "usable-gun/sea";

// Use direct file import
import radiskPlugin from "usable-gun/lib/radisk.js";

const gunEnvironment = new GunEnvironment();

await gunEnvironment.usePlugins([
  defaultGunPlugin,
  gunPlugin,
  basicSeaPlugin,
  seaPlugin,
  radiskPlugin,
]);
```

Plugins are activated synchronously from first to last, so any plugins that build upon other plugins should be last in the array. The method is async, so you need to await it to be sure the environment is ready.

You can call this method at any time and as many times as you want, but it is generally recommended to only call it once as part of the environment initialization.

If you want to write your own plugin, refer to [plugins](./plugins.md).

### members `environmentHint`, `debug`
These read-only members give you access to the values previously set when constructing the `GunEnvironment`.

Refer to the constructor to see more details about them.

### member: `library`
This is where you can access all primitives that gun and its plugins provide. The most commonly used are:

#### `Gun`
The constructor for Gun. Refer to Gun docs to read more about this.

#### `SEA`
If you activated the SEA plugin, you can access SEA methods here. Refer to Gun docs to read more about this.

## `basicGunPlugin`
This plugin activates basic functionality for the `Gun` constructor. It is useful if you want to customize your own setup, but still want a reasonably functional `Gun` base to work from.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- [root](../src/root.js) - The base for Gun
  - [shim](../src/shim.js)
    - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
  - [valid](../src/valid.js)
  - [state](../src/state.js)
  - [onto](../src/onto.js)
  - [dup](../src/dup.js)
  - [ask](../src/ask.js)
- [chain](../src/chain.js)
- [back](../src/back.js)
- [put](../src/put.js)
- [get](../src/get.js)

</details>

## `basicSeaPlugin`
This plugin activates basic functionality for the `Sea` library. It is useful if you want to customize your own setup, but still want a reasonably functional `Sea` base to work from.

It unfortunately also activates a lot of `Gun` plugins, so be aware of this.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- [index](../sea/index.js) - Connects Sea to Gun
  - [sea](../sea/sea.js)
    - [shim](../sea/shim.js)
      - [root](../sea/root.js) - The base for Sea
      - [buffer](../sea/buffer.js)
        - [array](../sea/array.js)
    - [work](../sea/work.js)
      - [settings](../sea/settings.js)
      - [sha256](../sea/sha256.js)
    - [sign](../sea/sign.js)
    - [verify](../sea/verify.js)
    - [encrypt](../sea/encrypt.js)
      - [aeskey](../sea/aeskey.js)
    - [decrypt](../sea/decrypt.js)
    - [certify](../sea/certify.js)
  - Gun core plugins:
    - [shim](../src/shim.js)
      - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
    - [onto](../src/onto.js)
    - [valid](../src/valid.js)
    - [state](../src/state.js)
    - [dup](../src/dup.js)
    - [ask](../src/ask.js)
    - [root](../src/root.js) - The base for Gun
    - [back](../src/back.js)
    - [chain](../src/chain.js)
    - [get](../src/get.js)
    - [put](../src/put.js)
    - [on](../src/on.js)
    - [map](../src/map.js)
    - [set](../src/set.js)
    - [mesh](../src/mesh.js)
    - [websocket](../src/websocket.js)
    - [localStorage](../src/localStorage.js)

</details>

## `defaultGunPlugin`
This plugin activates the plugins that the original Gun library would activate when `gun/gun` is imported.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- Gun core plugins:
  - [shim](../src/shim.js)
    - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
  - [onto](../src/onto.js)
  - [valid](../src/valid.js)
  - [state](../src/state.js)
  - [dup](../src/dup.js)
  - [ask](../src/ask.js)
  - [root](../src/root.js) - The base for Gun
  - [back](../src/back.js)
  - [chain](../src/chain.js)
  - [get](../src/get.js)
  - [put](../src/put.js)
  - [on](../src/on.js)
  - [map](../src/map.js)
  - [set](../src/set.js)
  - [mesh](../src/mesh.js)
  - [websocket](../src/websocket.js)
  - [localStorage](../src/localStorage.js)

</details>

## `defaultSeaPlugin`
This plugin activates the plugins that the original Gun library would activate when `gun/sea` is imported.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- [root](../sea/root.js) - The base for Sea
- [https](../sea/https.js)
- [array](../sea/array.js)
- [buffer](../sea/buffer.js)
- [shim](../sea/shim.js)
- [settings](../sea/settings.js)
- [sha256](../sea/sha256.js)
- [sha1](../sea/sha1.js)
- [work](../sea/work.js)
- [pair](../sea/pair.js)
- [sign](../sea/sign.js)
- [verify](../sea/verify.js)
- [aeskey](../sea/aeskey.js)
- [encrypt](../sea/encrypt.js)
- [decrypt](../sea/decrypt.js)
- [secret](../sea/secret.js)
- [certify](../sea/certify.js)
- [sea](../sea/sea.js)
- [user](../sea/user.js) - Connects user library to Gun
  - Gun core plugins:
    - [shim](../src/shim.js)
      - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
    - [onto](../src/onto.js)
    - [valid](../src/valid.js)
    - [state](../src/state.js)
    - [dup](../src/dup.js)
    - [ask](../src/ask.js)
    - [root](../src/root.js) - The base for Gun
    - [back](../src/back.js)
    - [chain](../src/chain.js)
    - [get](../src/get.js)
    - [put](../src/put.js)
    - [on](../src/on.js)
    - [map](../src/map.js)
    - [set](../src/set.js)
    - [mesh](../src/mesh.js)
    - [websocket](../src/websocket.js)
    - [localStorage](../src/localStorage.js)
- [then](../sea/then.js) - Connects `then` method to Gun
- [create](../sea/create.js)
- [auth](../sea/auth.js)
- [recall](../sea/recall.js)
- [share](../sea/share.js)
- [index](../sea/index.js) - Connects Sea to Gun

</details>

## `defaultAxePlugin`
This plugin activates the plugins that the original Gun library would activate when `gun/axe` is imported.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- [axe](../axe.js) - Connects Axe to Gun
  - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
  - Gun core plugins:
    - [shim](../src/shim.js)
    - [onto](../src/onto.js)
    - [valid](../src/valid.js)
    - [state](../src/state.js)
    - [dup](../src/dup.js)
    - [ask](../src/ask.js)
    - [root](../src/root.js) - The base for Gun
    - [back](../src/back.js)
    - [chain](../src/chain.js)
    - [get](../src/get.js)
    - [put](../src/put.js)
    - [on](../src/on.js)
    - [map](../src/map.js)
    - [set](../src/set.js)
    - [mesh](../src/mesh.js)
    - [websocket](../src/websocket.js)
    - [localStorage](../src/localStorage.js)
  - [axe](../lib/axe.js) - Also connects Axe to Gun

</details>

## `defaultBrowserPlugin`
This plugin activates the plugins that the original Gun library would activate when `gun` is imported in a browser.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- Gun core plugins:
  - [shim](../src/shim.js)
    - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
  - [onto](../src/onto.js)
  - [valid](../src/valid.js)
  - [state](../src/state.js)
  - [dup](../src/dup.js)
  - [ask](../src/ask.js)
  - [root](../src/root.js) - The base for Gun
  - [back](../src/back.js)
  - [chain](../src/chain.js)
  - [get](../src/get.js)
  - [put](../src/put.js)
  - [on](../src/on.js)
  - [map](../src/map.js)
  - [set](../src/set.js)
  - [mesh](../src/mesh.js)
  - [websocket](../src/websocket.js)
  - [localStorage](../src/localStorage.js)

</details>

## `lib/server.js` default export
This plugin activates the plugins that the original Gun library would activate when `gun` is imported in a Node process.

It is not exported as part of the standard package, as it imports a lot of node-specific code that can break many other runtimes. It can instead be imported with `import serverPlugin from "usable-gun/lib/server.js"`.

<details>
<summary>It activates the following plugins (click to expand)</summary>

- [yson](../lib/yson.js)
- Gun core plugins:
  - [shim](../src/shim.js)
    - [mathRandom](../usableLib/mathRandomPlugin.js) (injected by `usable-gun`)
  - [onto](../src/onto.js)
  - [valid](../src/valid.js)
  - [state](../src/state.js)
  - [dup](../src/dup.js)
  - [ask](../src/ask.js)
  - [root](../src/root.js) - The base for Gun
  - [back](../src/back.js)
  - [chain](../src/chain.js)
  - [get](../src/get.js)
  - [put](../src/put.js)
  - [on](../src/on.js)
  - [map](../src/map.js)
  - [set](../src/set.js)
  - [mesh](../src/mesh.js)
  - [websocket](../src/websocket.js)
  - [localStorage](../src/localStorage.js)
- [serve](../lib/serve.js)
  - [radisk](../lib/radisk.js)
    - [radmigtmp](../lib/radmigtmp.js)
    - [radix](../lib/radix.js)
- [store](../lib/store.js)
- [rfs](../lib/rfs.js)
- [rs3](../lib/rs3.js)
  - [rfsmix](../lib/rfsmix.js)
- [wire](../lib/wire.js)
- Sea core plugins:
  - [root](../sea/root.js) - The base for Sea
  - [https](../sea/https.js)
  - [array](../sea/array.js)
  - [buffer](../sea/buffer.js)
  - [shim](../sea/shim.js)
  - [settings](../sea/settings.js)
  - [sha256](../sea/sha256.js)
  - [sha1](../sea/sha1.js)
  - [work](../sea/work.js)
  - [pair](../sea/pair.js)
  - [sign](../sea/sign.js)
  - [verify](../sea/verify.js)
  - [aeskey](../sea/aeskey.js)
  - [encrypt](../sea/encrypt.js)
  - [decrypt](../sea/decrypt.js)
  - [secret](../sea/secret.js)
  - [certify](../sea/certify.js)
  - [sea](../sea/sea.js)
  - [user](../sea/user.js) - Connects user library to Gun
  - [then](../sea/then.js) - Connects `then` method to Gun
  - [create](../sea/create.js)
  - [auth](../sea/auth.js)
  - [recall](../sea/recall.js)
  - [share](../sea/share.js)
  - [index](../sea/index.js) - Connects Sea to Gun
- Axe core plugins:
  - [axe](../axe.js) - Connects Axe to Gun
    - [axe](../lib/axe.js) - Also connects Axe to Gun
- [multicast](../lib/multicast.js)
- [stats](../lib/stats.js)

</details>

### member: `debug`
This is a reference to the debugger that is being used. Refer to the `GunEnvironment` constructor for more information.

## `NoDebugger`

This debugger ignores all logs. It can be useful for production environments, but consider replacing it with something that can report warnings and errors back to you.

## `ConsoleDebugger`

This debugger logs all logs to the console. When constructing, it has two options:

### constructor: { enable }

Takes an array of strings that represent log levels. All logging to those levels will be enabled, but all logging to other levels will be disabled. Example:

```js
import { GunEnvironment, ConsoleDebugger } from "usable-gun";

const gunEnvironment = new GunEnvironment({
  debug: new ConsoleDebugger({
    enable: ["warn", "error"],
  }),
});
```

In this example, only warnings and errors are logged. Normal logs or debug logs are not logged.

The `enable` option cannot be used together with the `disable` option.

To see a complete list of possible log levels, refer to [debuggers](./debuggers.md).

### constructor: { disable }

Takes an array of strings that represent log levels. All logging to those levels will be disabled, while all logging to other levels will continue to be enabled. Example:

```js
import { GunEnvironment, ConsoleDebugger } from "usable-gun";

const gunEnvironment = new GunEnvironment({
  debug: new ConsoleDebugger({
    disable: ["STAT", "debug"],
  }),
});
```

In this example, "STAT" and debug messages are not logged. Normal, warning, and error logs are still logged.

The `disable` option cannot be used together with the `enable` option.

To see a complete list of possible log levels, refer to [debuggers](./debuggers.md).

## StoreDebugger

This debugger saves all log message and allows them to be retrieved by the developer. Retrieval can happen once, or a callback can be registered, which will be called every time a new log entry is created.

The callback system is modelled after the Svelte readable store contract.

```js
import { GunEnvironment, StoreDebugger } from "usable-gun";

const gunEnvironment = new GunEnvironment({
  debug: new StoreDebugger(),
});

console.log(gunEnvironment.debug.logs); // Logs all logs

gunEnvironment.debug.subscribe(logOnUpdate);
function logOnUpdate(logs){
  console.log(logs); // Logs all logs every time a new log is added
}
```

### constructor: { enable, disable }
The `StoreDebugger` has the same constructor as the `ConsoleDebugger`, allowing for disabling or enabling of specific log levels. Refer to the `ConsoleDebugger` documentation to read more about it.

### member: `logs`

An array of all logs, inserted in historical order.

Each log is an object with a `level` key describing the log level, and an `items` key that has saved the log items. Examples:

```js
storeDebugger.warn("Unused import");

storeDebugger.logs;
/* Would return: */
[
  {
    level: "warn",
    items: [
      "Unused import",
    ],
  },
]
```

```js
const object = {sync: 2};
storeDebugger.log("Got", object, 5);
storeDebugger.STAT(object);

storeDebugger.logs;
/* Would return: */
[
  {
    level: "log",
    items: [
      "Got",
      object, // Reference to the original object
      5,
    ],
  },
  {
    level: "STAT",
    items: [
      object,  // Reference to the original object
    ],
  },
]
```

### method: `subscribe()`

Allows you to register a function that will be called every time there is a new log entry. See the example above for how to register it.

The handler function will receive all logs every time, it will not receive only the new log.

When calling `subscribe()`, it will return an `unsubscribe` function, that if called, stops the registered function from being called on any future log updates.
