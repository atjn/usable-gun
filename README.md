# `usable-gun`: Gun with best practices
The Gun database architecture is very cool, you can read about it on [gun.eco](https://gun.eco/).

Unfortunately, the source code for Gun is written with a lot of bad practices that make it impractical to use in a project. `usable-gun` is a wrapper around Gun that fixes the following problems:

<table>
  <tr>
    <th>Bad practice</th>
    <th>Consequences</th>
    <th>Fixed by <code>usable-gun</code>?</th>
  </tr>
  <tr>
    <td>Only runs on main thread</td>
    <td><ul>
      <li>A website's interface can freeze while Gun is syncing</li>
      <li>You cannot run two instances of Gun simultaneously</li>
      <ul>
        <li>Cannot have two users logged in simultaneously</li>
        <li>Cannot sync with two servers independently</li>
      </ul>
      <li>No simple way to stop Gun and clean up after it</li>
    </ul></td>
    <td>✅ Yes. Code can run in Workers and multiple instances can run in the same context</td>
  </tr>
  <tr>
    <td>Mutates global objects</td>
    <td><ul>
      <li>Gun can interfere with how other code works</li>
      <li>Other code can interfere with how Gun works</li>
      <li>Interference can be hard to detect</li>
      <li>Code can be hard to read and debug</li>
    </ul></td>
    <td>✅ Yes. Code runs in isolated modules</td>
  </tr>
  <tr>
    <td>Makes heavy use of sideeffects</td>
    <td><ul>
      <li>Code can be hard to read and debug</li>
      <li>Standard code optimization strategies cannot be used</li>
    </ul></td>
    <td>🟡 Partial. Sideeffects cannot be eliminated, but code is transformed to make it clear when they are used</td>
  </tr>
  <tr>
    <td>Poor support for ES6 modules</td>
    <td><ul>
      <li>Can be hard to import</li>
      <li>Can behave incorrectly when imported</li>
      <li>Will crash some bundlers</li>
    </ul></td>
    <td>✅ Yes. Code is transformed to run in ES6 modules</td>
  </tr>
  <tr>
    <td>Uses a custom, undocumented bundler</td>
    <td><ul>
      <li>Standard code optimization strategies cannot be used</li>
      <li>Code is hard to read and debug</li>
    </ul></td>
    <td>✅ Yes. Code is "unbundled" into standard ES6 modules</td>
  </tr>
  <tr>
    <td>Uses <code>Math.random</code> for some cryptographic operations</td>
    <td><ul>
      <li>Namespace collisions can occur</li>
      <li>Can theoretically be exploited</li>
    </ul></td>
    <td>🟡 Almost. Code uses a much safer strategy, but cannot be perfectly fixed without changes to Gun's behavior</td>
  </tr>
  <tr>
    <td>Logs messages directly to <code>console</code></td>
    <td><ul>
      <li>No way to disable logs for end-users</li>
      <li>No way to collect logs from end-users</li>
      <li>No way to filter logs</li>
    </ul></td>
    <td>✅ Yes. Code logs to a debugger provided by the developer</td>
  </tr>
  <tr>
    <td>Uses unnecessary polyfills</td>
    <td><ul>
      <li>Bundle size is ~250% larger than necessary</li>
    </ul></td>
    <td>✅ Yes. Polyfills are replaced with native calls</td>
  </tr>
  <tr>
    <td>Does not use modern Javascript features (ES6+)</td>
    <td><ul>
      <li>Code runs slower</li>
      <li>Code is hard to read and debug</li>
    </ul></td>
    <td>🟡 Partial. Code is automatically transformed to use newer features where possible, but many new features require manual rewrites of the code</td>
  </tr>
  <tr>
    <td>Source code is heavily truncated</td>
    <td><ul>
      <li>Code is very hard to read and debug</li>
    </ul></td>
    <td>🟡 Partial. Code is transformed to follow a more readable syntax, and some variables are renamed to make their purpose clear</td>
  </tr>
</table>


# How to use

See the [API reference](./docs/api.md) for more details.

`usable-gun` follows `gun`'s structure to make it as easy as possible to port between the two libraries.

If you have a common setup like this:

```js
import Gun from "gun";
import SEA from "gun/sea";
import radix from "gun/lib/radix.js";

const gun = new Gun({
  peers: [],
});

gun // Your Gun instance
SEA // Your SEA library
```

You can port it like so:

```js
import { GunEnvironment } from "usable-gun";
import { defaultBrowserPlugin } from "usable-gun"; // Equivalent to importing "gun"
import seaPlugin from "usable-gun/sea";
import radixPlugin from "usable-gun/lib/radix.js";

const gunEnvironment = new GunEnvironment({
  environmentHint: "browser",
});
await gunEnvironment.usePlugins([
  defaultBrowserPlugin,
  seaPlugin,
  radixPlugin,
]);

const gun = new gunEnvironment.library.Gun({
  peers: [],
});
const SEA = gunEnvironment.library.SEA;

gun // Your Gun instance
SEA // Your SEA library
```

If you are using Gun on the server, you can replace `defaultBrowserPlugin` with `defaultServerPlugin` and set `environmentHint` to `server`. You can also load Gun in a few other ways, see the [API reference](./docs/api.md) for more details.

# How it works

If you import the original Gun code, it will immediately execute and attach itself to your `window` property. This is bad practice.

`usable-gun`'s `GunEnvironment` is a sandbox that emulates a browser context with the `window` property. All Gun code is wrapped into plugins that can be executed inside the sandbox. Anything that Gun used to set on the `window` property is now set on `GunEnvironment.library`. This technique also works for server-side code.

Original gun code also mutated common properties such as `String` and `setTimeout`. These mutations are also available as properties on `GunEnvironment.library`.

To read more about how the plugins work, refer to [plugins](./docs/plugins.md).

# Environment support

The primary focus of this package is to support the Gun library running in browsers. The secondary focus is to support the Gun library running on servers (Node, Deno, Bun). You can expect both of these use cases to work well.

Some of the more exotic plugins, such as plugins that render components directly in a webpage, are not a focus. It is however possible to get them to work, if you analyse which properties they are trying to access, and write a plugin that makes those properties available on `GunEnvironment.library`. To read more about how plugins work, refer to [plugins](./docs/plugins.md).

Supported environments:

<table>
  <tr>
    <th style="text-align: center;">
      <img alt="" src="https://github.com/alrra/browser-logos/raw/main/src/chromium/chromium_32x32.png">
      <br>
      Chromium
    </th>
    <th style="text-align: center;">
      <img alt="" src="https://github.com/alrra/browser-logos/raw/main/src/firefox/firefox_32x32.png">
      <br>
      Firefox
    </th>
    <th style="text-align: center;">
      <img alt="" src="https://github.com/alrra/browser-logos/raw/main/src/safari/safari_32x32.png">
      <br>
      Safari
    </th>
    <th style="text-align: center;">
      <img alt="" src="https://github.com/alrra/browser-logos/raw/main/src/node.js/node.js_32x32.png">
      <br>
      Node.js
    </th>
    <th style="text-align: center;">
      <img alt="" src="https://github.com/alrra/browser-logos/raw/main/src/deno/deno_32x32.png">
      <br>
      Deno
    </th>
  </tr>
  <tr>
    <td style="text-align: center;">
      ✅ 89
    </td>
    <td style="text-align: center;">
      ✅ 90
    </td>
    <td style="text-align: center;">
      ✅ 15.0
    </td>
    <td style="text-align: center;">
      ✅ 20.0
    </td>
    <td style="text-align: center;">
      ✅ 1.31
    </td>
  </tr>
</table>

Deno support is through NPM.

If you want to support older environments, you can transpile your project with [Babel](https://babeljs.io/).

# FAQ

## Can I use `usable-gun` with normal `gun` clients and servers?

Yes! `usable-gun` is designed to behave exactly like the original `gun` code does, so that it is fully interoperable.

## How do I make [insert name] work with `usable-gun`?

Any code or plugin that works with `Gun` is probably trying to access `usable-gun` in the global scope, where it doesn't exist. To make the code work again, you need to write a plugin for `usable-gun`'s `GunEnvironment`.

To know more about this, refer to [plugins](./docs/plugins.md).

## How do I know which version of `gun` and `usable-gun` I am using?

`usable-gun` combines the version from `gun` and `usable-gun` to make it clear what you are using.

The pattern is: `gun version`0`usable-gun version`.

So if you see the version `0.202003.123902`, that means:

`gun` version is: `0.2020.1239`.

`usable-gun` version is: `0.3.2`.

When `gun` goes out of beta, `usable-gun` will also go out of beta, or better yet, won't be necessary anymore. Finger's crossed.

## Is it a lot of work when a new version of `gun` is released?

The conversion from original `gun` code to `usable-gun` code is fully automated, so `usable-gun` should be able to update with fairly little work, depending on the scale of the update.

## Why not commit these improvements to `gun`?

It has been my experience that the Gun team does not place as much value in best practices as I do. It has also been my experience that comitting something to the core Gun code can be a complicated process.

I needed something that I could control to work exactly like I wanted it to, and therefore I decided that I had to have my own code base.

If anyone on the Gun team is interested in porting some of these improvements to Gun, I would be eager to help!

