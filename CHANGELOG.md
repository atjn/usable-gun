# v0.202002.123901

Fixed a bug where SEA would break on initialization.

# v0.202002.123900

Made a lot of changes to the way the package imports dependencies. It should be much easier to use both for server and browser code now.

`breaking` The server plugin is no longer exported by default, it must be imported manually from `lib`. This helps standardized runtimes to work properly.

Also made a lot of bug fixes, mainly for server code. It was mostly impossible to run before, and now should be fine.

# v0.202001.123900

First release.
