# Usable plugins
[<- go back to to overview](../README.md)

This document details how you can build your own usable plugin, and how the original Gun code has been transformed to run as plugins.

## A basic plugin

A `usable-gun` plugin is just a function that accepts the environment as a variable, and does something with the environment. Example:

```js
export function welcomePlugin({ library }){

  library.welcome = "Hello world!";

}
```

Any other plugin that is activated after this will now have access to the welcome message on `library.welcome`.

## Depending on plugins

If your plugin depends on other plugins, you can import those plugins and make sure they run first. Example:

```js
import { welcomePlugin } from "";

export function improveWelcomePlugin(environment){
  const library = environment.library;

  welcomePlugin(environment);

  library.welcome = library.welcome.replace("world", "wonderful world");

}
```

In this example, we first run the welcomePlugin to ensure that there is something on `library.welcome`, and then we change the message from `Hello world!` to `Hello wonderful world!`.

If the first plugin had not run, we would get an error because you cannot call `.replace()` on an undefined value.

Be conscious about which plugins you import like this. Maybe the user did not want to use whatever plugin you are depending on, and would rather include their own which starts with a slightly different welcome message. You can easily rewrite your plugin to allow for this:

```js
export function improveWelcomePlugin({ library, debug }){

  if(typeof library.welcome !== "string"){
    debug.error("`improveWelcomePlugin` requires an existing welcome message on `library.welcome`, we recommend using the `welcomePlugin` for this.");
    return;
  }

  library.welcome = library.welcome.replace("world", "wonderful world");

}
```

## Dealing with multiple activations

It is common for a plugin to be activated multiple times because several other plugins activate it to make sure they can depend on it. 

Sometimes it is okay for the plugin to activate and do the same work multiple times, but it is usually a problem. In the example with the welcome message, you might have three plugins that all improve the message in some way. If they all activate the original `welcomePlugin`, then you will only see the result from the last activated plugin, as it will overwrite the other improvements when it activates the `welcomePlugin`.

A common solution to this problem, is to remember if the plugin has been activated before, and refuse to run it again. Example:

```js
const isActivated = false;

export function welcomePlugin({ library }){
  if(isActivated) return;
  isActivated = true;

  library.welcome = "Hello world!";

}
```

The `isActivated` boolean will only be `false` on first activation, and after that, it will ensure that the plugin immediately returns.

Another solution is to add your work only if it seems to be missing.

```js
export function welcomePlugin({ library }){

  if(typeof library.welcome !== "string") library.welcome = "Hello world!";

}
```

## Building async plugins

You can make your plugins async, and they will be awaited before the next plugins runs.

## Integrating with Gun

Integration with Gun is the same as any other Gun plugin, you just need to access Gun on `library.Gun`. Example:

```js
const isActivated = false;

export function welcomePlugin({ library, debug }){
  if(isActivated) return;
  isActivated = true;

  library.Gun.on('create', () => {
    debug.log("Gun instance created");
  }

}
```

Gun uses a custom event system that can be accessed with `Gun.on()`. Here are a few common events you might use:

### event: `create`

This event fires once when the Gun instance is initialized.

You can access it with:
```js
library.Gun.on("create", context => {
  // Insert your handler here
});
```

The `context` object is a reference to the initialised Gun object.

### event: `opt`

This event fires every time Gun receives new options. This also fires when Gun is first initialised and receives its first options.

You can access it with: 
```js
library.Gun.on("opt", context => {
  // Insert your handler here
});
```

The `context` object is a reference to the active Gun object.


### event: `in`

This event fires every time Gun receives new information about a Gun node.

You can access it with:
```js
library.Gun.on("opt", context => {
  context.on("in", node => {
    // Insert your handler here
  });
});
```

The `node` object is a reference to the node in its current state.

### event: `out`

This event fires every time Gun sends out new information about a Gun node.

You can access it with:
```js
library.Gun.on("opt", context => {
  context.on("out", node => {
    // Insert your handler here
  });
});
```

The `node` object is a reference to the node in its current state.


### Other events

Other events that you might use in your development:

- `get`
- `put`
- `auth`
- `secure`
- `hi`
- `bye`
- `ack`
- `off`

## Using the debugger

`usable-gun` includes a debugger that you can use. We recommend that you use this for all logging, as it allows the user of your plugin to determine how logs are handled.

You can use it exactly like a `console` debugger. Example:

```js
export function consolePlugin({ debug }){

  debug.log("Just logging general information");

  debug.warn("Loggin warnings");

  debug.error("Logging errors");

  debug.info("Logging general information in a different way");

  debug.debug("Logging the debugger to the debug channel on the debugger:", debug);

}
```

For more information about debuggers, refer to [debuggers](./debuggers.md).
