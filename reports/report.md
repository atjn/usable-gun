

## lib/afore.js

  Wrapped globals          : module x2

  Is async                 : No



## lib/aws.js

  Wrapped globals          : module

  Wrapped global accessors : debug x3, process x6

  Wrapped plugin imports   : gun

  Upgraded npm imports     : aws-sdk

  Is async                 : Yes



## lib/axe.js

  Expanded names           : undefined x3

  Wrapped globals          : window x2

  Wrapped global accessors : process x2

  Ignored global accessors : clearTimeout x2, setTimeout x10

  Wrapped plugin imports   : gun

  Wrapped builtin overrides: Object.Map x2, Object.maps

  Wrapped builtin accessors: Object.Map x12, Object.maps x2, setTimeout.each x4, String.random

  Is async                 : No

  Is imported by           : axe.js



## lib/book.js

  Expanded names           : setTimeout x3

  Wrapped globals          : module

  Wrapped global accessors : debug

  Ignored global accessors : setTimeout

  Wrapped builtin overrides: setTimeout.Book

  Wrapped builtin accessors: setTimeout.Book

  Is async                 : No



## lib/bye.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No

  Is imported by           : lib/shim.js



## lib/crashed.js

  Wrapped global accessors : __dirname, process x3

  Wrapped plugin imports   : email

  Upgraded node imports    : fs

  Is async                 : Yes



## lib/cryptomodules.js

  Wrapped global accessors : debug

  Is async                 : No



## lib/debug.js

  Wrapped globals          : global

  Wrapped global accessors : debug x3, process x2

  Ignored global accessors : setInterval

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/dom.js

  Expanded names           : undefined x8

  Wrapped globals          : window x2

  Wrapped global overrides : $ x21

  Wrapped global accessors : $ x18, document x2

  Is async                 : No



## lib/email.js

  Wrapped globals          : module x3

  Wrapped global accessors : process x5

  Upgraded npm imports     : emailjs

  Is async                 : Yes

  Is imported by           : lib/crashed.js



## lib/erase.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/evict.js

  Expanded names           : undefined

  Wrapped globals          : window x2

  Wrapped global accessors : debug x5, process x3

  Ignored global accessors : setInterval, setTimeout

  Wrapped plugin imports   : gun

  Upgraded node imports    : v8

  Wrapped builtin accessors: setTimeout.each

  Is async                 : Yes



## lib/file.js

  Expanded names           : undefined x4

  Ignored global accessors : clearTimeout, setTimeout

  Wrapped plugin imports   : gun

  Upgraded node imports    : fs, path

  Is async                 : Yes



## lib/forget.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/fork.js

  Expanded names           : undefined

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/fsrm.js

  Wrapped globals          : module

  Wrapped global accessors : __dirname

  Upgraded node imports    : fs, path

  Is async                 : Yes



## lib/fun.js

  Wrapped globals          : window

  Wrapped global accessors : $ x4, document, fun x3, window x2

  Ignored global accessors : setTimeout x2

  Wrapped builtin accessors: Math.random x3

  Is async                 : No



## lib/hot.js

  Wrapped global accessors : $ x7, document x5, meta

  Is async                 : No



## lib/http.js

  Expanded names           : undefined x2

  Wrapped globals          : module

  Wrapped plugin imports   : gun

  Upgraded node imports    : url

  Upgraded npm imports     : formidable

  Is async                 : Yes

  Is imported by           : lib/wsp.js



## lib/hub.js

  Wrapped globals          : module

  Wrapped global accessors : debug x3

  Wrapped plugin imports   : index

  Upgraded node imports    : fs, os x8

  Upgraded npm imports     : chokidar

  Is async                 : Yes



## lib/ipfs.js

  Expanded names           : undefined x2

  Wrapped global accessors : Buffer, debug x7, gun

  Is async                 : No



## lib/ison.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : undefined

  Wrapped globals          : module x2, window x2

  Wrapped global accessors : Buffer

  Ignored global accessors : setTimeout x2

  Wrapped builtin overrides: JSON.parseAsync, JSON.stringifyAsync

  Is async                 : No



## lib/jsonp.js

  Wrapped globals          : module

  Wrapped plugin imports   : gun

  Is async                 : No

  Is imported by           : lib/wsp.js



## lib/later.js

  Ignored global accessors : setTimeout

  Wrapped plugin imports   : gun, open

  Is async                 : No



## lib/les.js

  Wrapped globals          : window x3

  Wrapped global accessors : debug x7, process x3

  Ignored global accessors : setInterval, setTimeout

  Wrapped plugin imports   : gun

  Upgraded npm imports     : gun

  Is async                 : Yes



## lib/level.js

  Wrapped globals          : module, window x3

  Wrapped global overrides : soul

  Wrapped global accessors : soul x2

  Wrapped plugin imports   : gun

  Upgraded node imports    : events

  Is async                 : Yes



## lib/lex.js

  Expanded names           : undefined x8

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/list.js

  Wrapped global accessors : debug x3

  Ignored global accessors : setTimeout

  Wrapped plugin imports   : gun, index

  Is async                 : No



## lib/load.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun, open

  Is async                 : No



## lib/match.js

  Wrapped globals          : module

  Wrapped plugin imports   : src/type

  Is async                 : No



## lib/memdisk.js

  Expanded names           : undefined x2

  Ignored global accessors : clearTimeout, setTimeout

  Wrapped plugin imports   : gun

  Upgraded node imports    : fs, path

  Is async                 : Yes



## lib/meta/metaCore.js

  Expanded names           : undefined

  Wrapped globals          : window

  Wrapped global overrides : $, meta

  Wrapped global accessors : $ x19, document x2, meta x7

  Ignored global accessors : setTimeout

  Is async                 : No

  Is imported by           : lib/meta.js



## lib/meta/metaEvents.js

  Wrapped globals          : window

  Wrapped global accessors : $ x7, document x4, meta x2

  Is async                 : No

  Is imported by           : lib/meta.js



## lib/meta/metaUI.js

  Wrapped global overrides : meta x3

  Wrapped global accessors : $ x12, document x2, meta x6

  Ignored global accessors : setTimeout

  Is async                 : No

  Is imported by           : lib/meta.js



## lib/meta.js

  Wrapped globals          : module, MODULE x5

  Wrapped plugin imports   : meta/metaCore, meta/metaEvents, meta/metaUI

  Is async                 : No



## lib/mix.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/mobile.js

  Used string replacers    : downgrade buffer import, remove text-encoder import

  Wrapped globals          : global x4

  Ignored global accessors : TextDecoder x2, TextEncoder x2

  Upgraded node imports    : buffer

  Is async                 : Yes



## lib/monotype.js

  Expanded names           : undefined x2

  Wrapped globals          : window x2

  Wrapped global accessors : $ x33, document, Node, Range

  Is async                 : No



## lib/multicast.js

  Expanded names           : undefined

  Wrapped globals          : window x2

  Wrapped global overrides : port

  Wrapped global accessors : Buffer x2, debug, port x4, process x2

  Ignored global accessors : setInterval x2

  Wrapped plugin imports   : gun

  Upgraded node imports    : dgram

  Wrapped builtin accessors: Math.random x2

  Is async                 : Yes

  Is imported by           : lib/server.js



## lib/nomem.js

  Expanded names           : undefined

  Wrapped globals          : module, window x2

  Is async                 : No



## lib/normalize.js

  Expanded names           : undefined x2

  Wrapped global overrides : $, n2 x3, pAdd, sAdd, t2

  Wrapped global accessors : $ x18, n2 x6, t2 x3

  Is async                 : No



## lib/not.js

  Expanded names           : undefined x2

  Wrapped globals          : window x2

  Wrapped global accessors : debug, need

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/open.js

  Wrapped globals          : window x2

  Ignored global accessors : clearTimeout, setTimeout x2

  Wrapped plugin imports   : gun

  Wrapped builtin accessors: setTimeout.each

  Is async                 : No

  Is imported by           : lib/later.js, lib/load.js, lib/shim.js



## lib/path.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/promise.js

  Wrapped globals          : window x2

  Wrapped global accessors : debug

  Ignored global accessors : setTimeout

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/radisk.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : undefined x31

  Wrapped globals          : module, window x4

  Wrapped global accessors : debug x27, require, setImmediate x2

  Ignored global accessors : setTimeout x4

  Wrapped plugin imports   : gun, radix, radmigtmp, yson

  Wrapped builtin accessors: JSON.parseAsync, JSON.stringifyAsync, Math.random, setTimeout.turn

  Is async                 : No

  Is imported by           : lib/rs3.js, lib/store.js



## lib/radisk2.js

  Expanded names           : undefined x34

  Wrapped globals          : module, window x4

  Wrapped global accessors : debug x6

  Ignored global accessors : clearTimeout, setTimeout x2

  Wrapped plugin imports   : gun, radix2

  Is async                 : No



## lib/radisk3.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : setTimeout x12, undefined x2

  Wrapped globals          : module

  Wrapped global accessors : debug x6, fetch x2, localStorage, process x2, require x2

  Ignored global accessors : setInterval, setTimeout x6

  Upgraded node imports    : fs x2, os, v8

  Wrapped builtin overrides: setTimeout.RAD, setTimeout.RAD.has

  Wrapped builtin accessors: setTimeout.Book, setTimeout.RAD.has, setTimeout.RAD x4

  Is async                 : Yes



## lib/radix.js

  Expanded names           : undefined x19

  Wrapped globals          : module, window x2

  Wrapped global accessors : debug x3

  Is async                 : No

  Is imported by           : lib/radisk.js, lib/radmigtmp.js, lib/super.js



## lib/radix2.js

  Expanded names           : undefined x15

  Wrapped globals          : module, window x3

  Wrapped plugin imports   : gun

  Removed builtin overrides: Object.keys

  Is async                 : No

  Is imported by           : lib/radisk2.js



## lib/radmigtmp.js

  Wrapped globals          : module

  Wrapped global accessors : debug

  Wrapped plugin imports   : radix

  Is async                 : No

  Is imported by           : lib/radisk.js



## lib/ras.js

  Wrapped globals          : module

  Wrapped global accessors : debug x4

  Is async                 : No



## lib/reboot.js

  Wrapped global accessors : __dirname, debug x4

  Upgraded node imports    : child_process

  Is async                 : Yes



## lib/rfs.js

  Expanded names           : undefined x2

  Wrapped globals          : module, window x2

  Wrapped global accessors : debug x2

  Wrapped plugin imports   : gun

  Upgraded node imports    : fs

  Wrapped builtin accessors: Math.random

  Is async                 : Yes

  Is imported by           : lib/rfsmix.js, lib/server.js



## lib/rfsmix.js

  Wrapped globals          : module

  Wrapped plugin imports   : rfs

  Is async                 : Yes

  Is imported by           : lib/rs3.js



## lib/rindexed.js

  Expanded names           : undefined x2

  Wrapped globals          : module, window x2

  Wrapped global accessors : debug x3, indexedDB x2, window

  Ignored global accessors : location, setInterval, setTimeout x4

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/rls.js

  Wrapped globals          : module, window

  Wrapped global accessors : localStorage, window

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/rmem.js

  Expanded names           : undefined x2

  Wrapped globals          : module, window x2

  Is async                 : No



## lib/role.js

  Wrapped globals          : window x8

  Wrapped global overrides : debug x2

  Wrapped global accessors : debug x8, gun x5

  Ignored global accessors : setTimeout x2

  Wrapped plugin imports   : gun, sea

  Is async                 : No



## lib/rs3.js

  Expanded names           : undefined x3

  Wrapped globals          : module

  Wrapped global accessors : AWS_SDK_NOT_INSTALLED, debug x2, process x6

  Wrapped plugin imports   : gun, radisk, rfsmix

  Upgraded node imports    : fs

  Upgraded npm imports     : aws-sdk

  Is async                 : Yes

  Is imported by           : lib/server.js



## lib/serve.js

  Wrapped globals          : module

  Wrapped global accessors : __dirname x2, debug x5

  Upgraded node imports    : fs x2, path

  Is async                 : Yes

  Is imported by           : lib/server.js



## lib/server.js

  Expanded names           : undefined x3

  Wrapped globals          : module

  Wrapped plugin imports   : axe, gun, multicast, rfs, rs3, sea, serve, stats, store, wire, yson

  Is async                 : Yes



## lib/shim.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : bye, gun, open

  Is async                 : No



## lib/space.js

  Expanded names           : undefined x3

  Wrapped globals          : window x2

  Wrapped global accessors : debug

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/stats.js

  Wrapped globals          : window x2

  Wrapped global overrides : debug x2, process x3

  Wrapped global accessors : __dirname x3, debug x6, process x8, require

  Ignored global accessors : setInterval, setTimeout x2

  Wrapped plugin imports   : gun, yson

  Upgraded node imports    : child_process, fs, os, path

  Wrapped builtin accessors: JSON.stringifyAsync

  Is async                 : Yes

  Is imported by           : lib/server.js



## lib/store.js

  Used string replacers    : remove undefined generator hack (variant 2)

  Expanded names           : undefined x13

  Wrapped globals          : window x2

  Wrapped global accessors : debug x11, process x2

  Wrapped plugin imports   : gun, radisk

  Wrapped builtin accessors: Object.empty

  Is async                 : No

  Is imported by           : lib/server.js



## lib/super.js

  Expanded names           : undefined

  Wrapped globals          : module, window x2

  Wrapped global accessors : debug

  Wrapped plugin imports   : gun, radix

  Is async                 : No



## lib/text-encoding/index.js

  Wrapped globals          : module

  Wrapped global accessors : debug

  Ignored global accessors : TextDecoder x2, TextEncoder x2

  Is async                 : No



## lib/then.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/time.js

  Expanded names           : undefined x2

  Wrapped globals          : window x2

  Wrapped global overrides : opt x2

  Wrapped global accessors : opt x4

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/unset.js

  Wrapped globals          : window x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/untitled.js

  Used string replacers    : remove if statement syntax error

  Expanded names           : undefined x4

  Wrapped global accessors : cb, echo, gun, obj_map

  Is async                 : No



## lib/upload.js

  Wrapped global overrides : $

  Wrapped global accessors : $ x3, document, file, FileReader, Image

  Is async                 : No



## lib/utils.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : undefined x31

  Wrapped global accessors : debug, Gun x2

  Removed builtin overrides: Object.keys

  Wrapped builtin accessors: Math.random

  Is async                 : No



## lib/uws.js

  Wrapped global accessors : debug

  Ignored global accessors : clearTimeout, setTimeout x2

  Wrapped plugin imports   : gun

  Upgraded node imports    : url

  Upgraded npm imports     : uws

  Is async                 : Yes



## lib/verify.js

  Wrapped globals          : module

  Wrapped plugin imports   : gun

  Upgraded node imports    : url

  Is async                 : Yes



## lib/wave.js

  Wrapped global accessors : debug x2, document x4, global x2, requireScriptPromises x3, Tone x11, window

  Ignored global accessors : clearTimeout, setTimeout x5

  Wrapped builtin accessors: Math.random

  Is async                 : No



## lib/webrtc.js

  Wrapped globals          : global x2, window x4

  Ignored global accessors : location x2, setTimeout x2

  Wrapped plugin imports   : gun

  Is async                 : No



## lib/wire.js

  Wrapped global overrides : debug

  Wrapped global accessors : debug x2

  Ignored global accessors : setTimeout x2

  Wrapped plugin imports   : gun

  Upgraded node imports    : url

  Upgraded npm imports     : ws

  Is async                 : Yes

  Is imported by           : lib/server.js



## lib/ws.js

  Ignored global accessors : clearTimeout, setTimeout x2

  Wrapped plugin imports   : gun

  Upgraded node imports    : url

  Upgraded npm imports     : ws

  Is async                 : Yes

  Is imported by           : lib/wsp.js



## lib/wsp.js

  Wrapped global accessors : __dirname, debug

  Ignored global accessors : clearTimeout x2, setTimeout x2

  Wrapped plugin imports   : gun, http, jsonp, ws

  Upgraded node imports    : fs, http, https, url

  Upgraded npm imports     : ws x2

  Is async                 : Yes



## lib/wsproto.js

  Wrapped globals          : window x4

  Wrapped global accessors : Gun x5

  Ignored global accessors : clearTimeout, setTimeout x2

  Is async                 : No



## lib/yson.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : undefined x21

  Wrapped globals          : module x2, window x2

  Wrapped global accessors : setImmediate x2

  Ignored global accessors : setTimeout x2

  Wrapped builtin overrides: JSON.parseAsync, JSON.stringifyAsync

  Wrapped builtin accessors: setTimeout.turn

  Is async                 : No

  Is imported by           : lib/radisk.js, lib/server.js, lib/stats.js



## sea/aeskey.js

  Wrapped globals          : module

  Wrapped plugin imports   : settings, sha256, shim

  Is async                 : No

  Is imported by           : sea.js, sea/decrypt.js, sea/encrypt.js



## sea/array.js

  Wrapped globals          : module

  Ignored global accessors : btoa

  Wrapped plugin imports   : base64

  Is async                 : No

  Is imported by           : sea.js, sea/buffer.js



## sea/auth.js

  Expanded names           : undefined x5

  Wrapped global accessors : debug

  Ignored global accessors : setTimeout

  Wrapped plugin imports   : user

  Wrapped builtin accessors: String.random

  Is async                 : No

  Is imported by           : sea.js



## sea/base64.js

  Wrapped global accessors : debug

  Is async                 : No



## sea/buffer.js

  Wrapped globals          : module

  Wrapped global accessors : debug x2

  Ignored global accessors : atob

  Wrapped plugin imports   : array, base64

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js, sea/shim.js



## sea/certify.js

  Wrapped globals          : module

  Wrapped global accessors : debug x4

  Wrapped plugin imports   : root

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js



## sea/create.js

  Expanded names           : undefined

  Wrapped plugin imports   : user

  Wrapped builtin accessors: String.random

  Is async                 : No

  Is imported by           : sea.js



## sea/decrypt.js

  Wrapped globals          : module

  Wrapped global accessors : debug x2

  Ignored global accessors : TextDecoder

  Wrapped plugin imports   : aeskey, root, settings, shim

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js



## sea/encrypt.js

  Expanded names           : undefined x2

  Wrapped globals          : module

  Wrapped global accessors : debug x2

  Ignored global accessors : TextEncoder

  Wrapped plugin imports   : aeskey, root, settings, shim

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js



## sea/https.js

  Used string replacers    : correct SEA HTTPS warning

  Removed global overrides : location.protocol

  Wrapped global accessors : debug

  Ignored global accessors : location x4

  Wrapped plugin imports   : root

  Is async                 : No

  Is imported by           : sea.js



## sea/index.js

  Used string replacers    : remove undefined generator hack (variant 1), remove USE bundler test

  Expanded names           : undefined x9

  Ignored global accessors : btoa

  Wrapped plugin imports   : gun, sea, settings

  Wrapped builtin overrides: String.match

  Wrapped builtin accessors: JSON.parseAsync, JSON.stringifyAsync x2, String.match x6

  Is async                 : No

  Is imported by           : sea.js



## sea/pair.js

  Wrapped globals          : module

  Wrapped global accessors : debug x5

  Wrapped plugin imports   : root, settings, shim

  Is async                 : No

  Is imported by           : sea.js



## sea/recall.js

  Wrapped plugin imports   : user

  Is async                 : No

  Is imported by           : sea.js



## sea/root.js

  Used string replacers    : remove undefined generator hack (variant 2)

  Expanded names           : undefined

  Wrapped globals          : MODULE x2, module x6, self x2, window x2

  Is async                 : No

  Is imported by           : sea.js, sea/certify.js, sea/decrypt.js, sea/encrypt.js, sea/https.js, sea/pair.js, sea/sea.js, sea/secret.js, sea/settings.js, sea/shim.js, sea/sign.js, sea/verify.js, sea/work.js



## sea/sea.js

  Wrapped globals          : module

  Wrapped global accessors : debug, sha1hash

  Wrapped plugin imports   : buffer, certify, decrypt, encrypt, root, shim, sign, verify, work

  Is async                 : No

  Is imported by           : sea.js, sea/index.js, sea/user.js



## sea/secret.js

  Wrapped globals          : module

  Wrapped global accessors : debug x2

  Wrapped plugin imports   : root, settings, shim

  Is async                 : No

  Is imported by           : sea.js



## sea/settings.js

  Wrapped globals          : module

  Wrapped plugin imports   : root, shim

  Is async                 : No

  Is imported by           : sea.js, sea/aeskey.js, sea/decrypt.js, sea/encrypt.js, sea/index.js, sea/pair.js, sea/secret.js, sea/sign.js, sea/verify.js, sea/work.js



## sea/sha1.js

  Wrapped globals          : module

  Wrapped plugin imports   : shim

  Is async                 : No

  Is imported by           : sea.js



## sea/sha256.js

  Wrapped globals          : module

  Ignored global accessors : TextEncoder

  Wrapped plugin imports   : shim

  Is async                 : No

  Is imported by           : sea.js, sea/aeskey.js, sea/sign.js, sea/verify.js, sea/work.js



## sea/share.js

  Wrapped globals          : module

  Wrapped global accessors : authRecall, debug x6, path, theirPubkey

  Wrapped plugin imports   : user

  Is async                 : No

  Is imported by           : sea.js



## sea/shim.js

  Used string replacers    : b, k, remove undefined generator hack (variant 2), remove USE bundler test, s

  Expanded names           : undefined x5

  Wrapped globals          : module

  Wrapped global accessors : debug

  Ignored global accessors : TextDecoder x3, TextEncoder x2

  Wrapped plugin imports   : buffer, lib/text_encoding, root

  Wrapped builtin overrides: JSON.parseAsync, JSON.stringifyAsync

  Wrapped builtin accessors: JSON.parseAsync x2, JSON.stringifyAsync x2

  Is async                 : No

  Is imported by           : sea.js, sea/aeskey.js, sea/decrypt.js, sea/encrypt.js, sea/pair.js, sea/sea.js, sea/secret.js, sea/settings.js, sea/sha1.js, sea/sha256.js, sea/sign.js, sea/verify.js, sea/work.js



## sea/sign.js

  Expanded names           : undefined x3

  Wrapped globals          : module

  Wrapped global accessors : debug x3

  Wrapped plugin imports   : root, settings, sha256, shim

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js



## sea/then.js

  Used string replacers    : remove undefined generator hack (variant 1), remove USE bundler test

  Expanded names           : undefined

  Wrapped global accessors : GUN x2

  Wrapped plugin imports   : gun

  Is async                 : No

  Is imported by           : sea.js



## sea/user.js

  Used string replacers    : remove undefined generator hack (variant 2), remove USE bundler test

  Expanded names           : undefined

  Wrapped globals          : module

  Wrapped plugin imports   : gun, sea

  Is async                 : No

  Is imported by           : sea.js, sea/auth.js, sea/create.js, sea/recall.js, sea/share.js



## sea/verify.js

  Expanded names           : undefined x3

  Wrapped globals          : module

  Wrapped global accessors : debug x4

  Ignored global accessors : TextEncoder

  Wrapped plugin imports   : root, settings, sha256, shim

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js



## sea/work.js

  Expanded names           : undefined x2

  Wrapped globals          : module

  Wrapped global accessors : debug x3

  Ignored global accessors : TextEncoder x2

  Wrapped plugin imports   : root, settings, sha256, shim

  Is async                 : No

  Is imported by           : sea.js, sea/sea.js



## src/ask.js

  Wrapped globals          : module

  Ignored global accessors : clearTimeout, setTimeout x2

  Wrapped plugin imports   : onto

  Wrapped builtin accessors: Math.random, String.random

  Is async                 : No

  Is imported by           : gun.js, src/root.js



## src/back.js

  Expanded names           : undefined x3

  Wrapped plugin imports   : root

  Is async                 : No

  Is imported by           : gun.js, src/index.js



## src/chain.js

  Expanded names           : undefined x22

  Wrapped global accessors : debug

  Ignored global accessors : setTimeout x5

  Wrapped plugin imports   : root

  Wrapped builtin accessors: setTimeout.each x5, String.random

  Is async                 : No

  Is imported by           : gun.js, src/index.js



## src/dup.js

  Wrapped globals          : module

  Wrapped global accessors : debug x2

  Ignored global accessors : setTimeout x2

  Wrapped plugin imports   : shim

  Wrapped builtin accessors: setTimeout.each

  Is async                 : No

  Is imported by           : gun.js, src/root.js



## src/get.js

  Expanded names           : undefined x11

  Wrapped plugin imports   : root

  Wrapped builtin accessors: String.random

  Is async                 : No

  Is imported by           : gun.js, src/index.js



## src/index.js

  Wrapped globals          : module

  Wrapped plugin imports   : back, chain, get, put, root

  Is async                 : No

  Is imported by           : gun.js, src/map.js, src/on.js, src/set.js, src/websocket.js



## src/localStorage.js

  Expanded names           : undefined x7

  Wrapped global accessors : Gun x9

  Ignored global accessors : clearTimeout, setTimeout x4

  Wrapped builtin accessors: JSON.parseAsync, JSON.stringifyAsync, Math.random, Object.plain, setTimeout.each, setTimeout.turn

  Is async                 : No

  Is imported by           : gun.js



## src/map.js

  Expanded names           : undefined x3

  Wrapped plugin imports   : index

  Wrapped builtin accessors: Object.plain x2, String.match x2

  Is async                 : No

  Is imported by           : gun.js



## src/mesh.js

  Expanded names           : undefined x8

  Wrapped globals          : module

  Wrapped global overrides : debug

  Wrapped global accessors : debug x28

  Ignored global accessors : setTimeout x7

  Wrapped plugin imports   : shim

  Wrapped builtin accessors: JSON.parseAsync, JSON.stringifyAsync, Math.random, Object.plain x2, setTimeout.each x3, setTimeout.turn, String.hash x2, String.random x4

  Is async                 : No

  Is imported by           : gun.js, src/websocket.js



## src/on.js

  Expanded names           : undefined x3

  Ignored global accessors : clearTimeout x3, setTimeout x2

  Wrapped plugin imports   : index

  Wrapped builtin accessors: String.random

  Is async                 : No

  Is imported by           : gun.js



## src/onto.js

  Expanded names           : hasCallbackFunction x3, undefined x2

  Wrapped globals          : module

  Is async                 : No

  Is imported by           : gun.js, src/ask.js, src/root.js



## src/put.js

  Expanded names           : undefined x3

  Ignored global accessors : setTimeout x3

  Wrapped plugin imports   : root

  Wrapped builtin accessors: Object.empty, Object.plain, setTimeout.each x2, setTimeout.turn

  Is async                 : No

  Is imported by           : gun.js, src/index.js



## src/root.js

  Used string replacers    : remove welcome log

  Expanded names           : undefined x6

  Wrapped globals          : module, MODULE x2, window x4

  Wrapped global accessors : debug x15

  Ignored global accessors : setTimeout x4

  Wrapped plugin imports   : ask, dup, onto, shim, state, valid

  Wrapped builtin accessors: Object.empty, Object.plain x3, setTimeout.each, setTimeout.turn x2, String.random x2

  Is async                 : No

  Is imported by           : gun.js, src/back.js, src/chain.js, src/get.js, src/index.js, src/put.js



## src/set.js

  Wrapped plugin imports   : index

  Wrapped builtin accessors: Object.plain

  Is async                 : No

  Is imported by           : gun.js



## src/shim.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : _setImmediate x2, setTimeout x17, undefined x11

  Wrapped global accessors : setImmediate x2

  Ignored global accessors : MessageChannel x2, performance x2, setTimeout x9

  Removed builtin overrides: Object.keys

  Wrapped builtin overrides: Object.empty, Object.plain, setTimeout.check, setTimeout.each, setTimeout.hold, setTimeout.poll, setTimeout.turn, String.hash, String.match, String.random

  Wrapped builtin accessors: Math.random, setTimeout.check, setTimeout.each, setTimeout.hold x2, setTimeout.poll x2, setTimeout.turn x2

  Is async                 : No

  Is imported by           : gun.js, src/dup.js, src/mesh.js, src/root.js, src/state.js



## src/state.js

  Expanded names           : undefined x3

  Wrapped globals          : module

  Wrapped plugin imports   : shim

  Is async                 : No

  Is imported by           : gun.js, src/root.js



## src/valid.js

  Wrapped globals          : module

  Is async                 : No

  Is imported by           : gun.js, src/root.js



## src/websocket.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : undefined

  Wrapped global accessors : document x2

  Ignored global accessors : clearTimeout, setTimeout x3

  Wrapped plugin imports   : index, mesh

  Is async                 : No

  Is imported by           : gun.js



## as.js

  Expanded names           : undefined x6

  Wrapped globals          : window x8

  Removed global overrides : location.hash

  Wrapped global overrides : $ x3, as, JOY

  Wrapped global accessors : $ x30, debug x5, document x3, Gun, gun x4, JOY x2

  Ignored global accessors : clearTimeout, location x2, setTimeout

  Is async                 : No



## axe.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : setTimeout x4, undefined

  Wrapped globals          : module x2, window x2

  Wrapped global accessors : fetch

  Ignored global accessors : location x2, setTimeout x5

  Wrapped plugin imports   : gun, lib/axe

  Wrapped builtin overrides: setTimeout.window

  Wrapped builtin accessors: Math.random, setTimeout.window x2

  Is async                 : No

  Is imported by           : lib/server.js



## gun.js

  Used string replacers    : remove undefined generator hack (variant 1)

  Expanded names           : undefined x32

  Wrapped globals          : module, MODULE x20

  Wrapped global accessors : debug, Gun x2

  Wrapped plugin imports   : src/ask, src/back, src/chain, src/dup, src/get, src/index, src/localStorage, src/map, src/mesh, src/on, src/onto, src/put, src/root, src/set, src/shim, src/state, src/valid, src/websocket

  Removed builtin overrides: Object.keys

  Wrapped builtin accessors: Math.random

  Is async                 : No

  Is imported by           : axe.js, lib/aws.js, lib/axe.js, lib/bye.js, lib/debug.js, lib/erase.js, lib/evict.js, lib/file.js, lib/forget.js, lib/fork.js, lib/http.js, lib/jsonp.js, lib/later.js, lib/les.js, lib/level.js, lib/lex.js, lib/list.js, lib/load.js, lib/memdisk.js, lib/mix.js, lib/multicast.js, lib/not.js, lib/open.js, lib/path.js, lib/promise.js, lib/radisk.js, lib/radisk2.js, lib/radix2.js, lib/rfs.js, lib/rindexed.js, lib/rls.js, lib/role.js, lib/rs3.js, lib/server.js, lib/shim.js, lib/space.js, lib/stats.js, lib/store.js, lib/super.js, lib/then.js, lib/time.js, lib/unset.js, lib/uws.js, lib/verify.js, lib/webrtc.js, lib/wire.js, lib/ws.js, lib/wsp.js, nts.js, sea/index.js, sea/then.js, sea/user.js



## nts.js

  Wrapped globals          : window x2

  Wrapped global accessors : debug x6

  Ignored global accessors : setTimeout x3

  Wrapped plugin imports   : gun

  Wrapped builtin accessors: String.random

  Is async                 : No



## sea.js

  Wrapped globals          : module, MODULE x27

  Wrapped plugin imports   : sea/aeskey, sea/array, sea/auth, sea/base64, sea/buffer, sea/certify, sea/create, sea/decrypt, sea/encrypt, sea/https, sea/index, sea/pair, sea/recall, sea/root, sea/sea, sea/secret, sea/settings, sea/sha1, sea/sha256, sea/share, sea/shim, sea/sign, sea/then, sea/user, sea/verify, sea/work

  Is async                 : No

  Is imported by           : lib/role.js, lib/server.js



## index.js

  Is imported by           : lib/hub.js, lib/list.js



## src/type

  Is imported by           : lib/match.js



## In total for gun root

  Used string replacers    : remove undefined generator hack (variant 1) x3, remove welcome log

  Expanded names           : _setImmediate x2, hasCallbackFunction x3, setTimeout x17, undefined x115

  Wrapped globals          : MODULE x22, module x9, window x4

  Wrapped global overrides : debug

  Wrapped global accessors : debug x47, document x2, Gun x11, setImmediate x2

  Ignored global accessors : clearTimeout x6, MessageChannel x2, performance x2, setTimeout x41

  Wrapped plugin imports   : ask, back, chain, dup, get, index x4, mesh, onto x2, put, root x5, shim x4, src/ask, src/back, src/chain, src/dup, src/get, src/index, src/localStorage, src/map, src/mesh, src/on, src/onto, src/put, src/root, src/set, src/shim, src/state, src/valid, src/websocket, state, valid

  Removed builtin overrides: Object.keys x2

  Wrapped builtin overrides: Object.empty, Object.plain, setTimeout.check, setTimeout.each, setTimeout.hold, setTimeout.poll, setTimeout.turn, String.hash, String.match, String.random

  Wrapped builtin accessors: JSON.parseAsync x2, JSON.stringifyAsync x2, Math.random x5, Object.empty x2, Object.plain x10, setTimeout.check, setTimeout.each x14, setTimeout.hold x2, setTimeout.poll x2, setTimeout.turn x7, String.hash x2, String.match x2, String.random x10

  Is async                 : No x19

  Is imported by           : axe.js, gun.js x18, lib/aws.js, lib/axe.js, lib/bye.js, lib/debug.js, lib/erase.js, lib/evict.js, lib/file.js, lib/forget.js, lib/fork.js, lib/http.js, lib/jsonp.js, lib/later.js, lib/les.js, lib/level.js, lib/lex.js, lib/list.js, lib/load.js, lib/memdisk.js, lib/mix.js, lib/multicast.js, lib/not.js, lib/open.js, lib/path.js, lib/promise.js, lib/radisk.js, lib/radisk2.js, lib/radix2.js, lib/rfs.js, lib/rindexed.js, lib/rls.js, lib/role.js, lib/rs3.js, lib/server.js, lib/shim.js, lib/space.js, lib/stats.js, lib/store.js, lib/super.js, lib/then.js, lib/time.js, lib/unset.js, lib/uws.js, lib/verify.js, lib/webrtc.js, lib/wire.js, lib/ws.js, lib/wsp.js, nts.js, sea/index.js, sea/then.js, sea/user.js, src/ask.js, src/back.js, src/chain.js, src/dup.js, src/get.js, src/index.js x5, src/map.js, src/mesh.js, src/on.js, src/put.js, src/root.js x6, src/set.js, src/state.js, src/websocket.js x2



## In total for sea

  Used string replacers    : b, correct SEA HTTPS warning, k, remove undefined generator hack (variant 1) x2, remove undefined generator hack (variant 2) x3, remove USE bundler test x4, s

  Expanded names           : undefined x33

  Wrapped globals          : module x25, MODULE x29, self x2, window x2

  Removed global overrides : location.protocol

  Wrapped global accessors : authRecall, debug x38, GUN x2, path, sha1hash, theirPubkey

  Ignored global accessors : atob, btoa x2, location x4, setTimeout, TextDecoder x4, TextEncoder x7

  Wrapped plugin imports   : aeskey x2, array, base64 x2, buffer x2, certify, decrypt, encrypt, gun x3, lib/text_encoding, root x12, sea x2, sea/aeskey, sea/array, sea/auth, sea/base64, sea/buffer, sea/certify, sea/create, sea/decrypt, sea/encrypt, sea/https, sea/index, sea/pair, sea/recall, sea/root, sea/sea, sea/secret, sea/settings, sea/sha1, sea/sha256, sea/share, sea/shim, sea/sign, sea/then, sea/user, sea/verify, sea/work, settings x9, sha256 x4, shim x12, sign, user x4, verify, work

  Wrapped builtin overrides: JSON.parseAsync, JSON.stringifyAsync, String.match

  Wrapped builtin accessors: JSON.parseAsync x3, JSON.stringifyAsync x4, String.match x6, String.random x2

  Is async                 : No x27

  Is imported by           : lib/role.js, lib/server.js, sea.js x25, sea/aeskey.js x3, sea/auth.js, sea/buffer.js, sea/certify.js, sea/create.js, sea/decrypt.js x4, sea/encrypt.js x4, sea/https.js, sea/index.js x2, sea/pair.js x3, sea/recall.js, sea/sea.js x9, sea/secret.js x3, sea/settings.js x2, sea/sha1.js, sea/sha256.js, sea/share.js, sea/shim.js x2, sea/sign.js x4, sea/user.js, sea/verify.js x4, sea/work.js x4



## In total for other

  Used string replacers    : downgrade buffer import, remove if statement syntax error, remove text-encoder import, remove undefined generator hack (variant 1) x6, remove undefined generator hack (variant 2)

  Expanded names           : setTimeout x19, undefined x236

  Wrapped globals          : global x7, module x39, MODULE x5, window x111

  Removed global overrides : location.hash

  Wrapped global overrides : $ x27, as, debug x5, JOY, meta x4, n2 x3, opt x2, pAdd, port, process x3, sAdd, soul, t2

  Wrapped global accessors : __dirname x9, $ x151, AWS_SDK_NOT_INSTALLED, Buffer x4, cb, debug x145, document x25, echo, fetch x3, file, FileReader, fun x3, global x2, gun x11, Gun x8, Image, indexedDB x2, JOY x2, localStorage x2, meta x16, n2 x6, need, Node, obj_map, opt x4, port x4, process x44, Range, require x4, requireScriptPromises x3, setImmediate x4, soul x2, t2 x3, Tone x11, window x5

  Ignored global accessors : clearTimeout x13, location x7, setInterval x8, setTimeout x74, TextDecoder x4, TextEncoder x4

  Wrapped plugin imports   : axe, bye, email, gun x49, http, index x2, jsonp, lib/axe, meta/metaCore, meta/metaEvents, meta/metaUI, multicast, open x3, radisk x2, radix x3, radix2, radmigtmp, rfs x2, rfsmix, rs3, sea x2, serve, src/type, stats, store, wire, ws, yson x3

  Upgraded node imports    : buffer, child_process x2, dgram, events, fs x13, http, https, os x10, path x5, url x6, v8 x2

  Upgraded npm imports     : aws-sdk x2, chokidar, emailjs, formidable, gun, uws, ws x4

  Removed builtin overrides: Object.keys x2

  Wrapped builtin overrides: JSON.parseAsync x2, JSON.stringifyAsync x2, Object.Map x2, Object.maps, setTimeout.Book, setTimeout.RAD, setTimeout.RAD.has, setTimeout.window

  Wrapped builtin accessors: JSON.parseAsync, JSON.stringifyAsync x2, Math.random x10, Object.empty, Object.Map x12, Object.maps x2, setTimeout.Book x2, setTimeout.each x6, setTimeout.RAD.has, setTimeout.RAD x4, setTimeout.turn x2, setTimeout.window x2, String.random x2

  Is async                 : No x60, Yes x26

  Is imported by           : axe.js, lib/crashed.js, lib/hub.js, lib/later.js, lib/list.js, lib/load.js, lib/match.js, lib/meta.js x3, lib/radisk.js x3, lib/radisk2.js, lib/radmigtmp.js, lib/rfsmix.js, lib/rs3.js x2, lib/server.js x9, lib/shim.js x2, lib/stats.js, lib/store.js, lib/super.js, lib/wsp.js x3



## In total

  Used string replacers    : b, correct SEA HTTPS warning, downgrade buffer import, k, remove if statement syntax error, remove text-encoder import, remove undefined generator hack (variant 1) x11, remove undefined generator hack (variant 2) x4, remove USE bundler test x4, remove welcome log, s

  Expanded names           : _setImmediate x2, hasCallbackFunction x3, setTimeout x36, undefined x384

  Wrapped globals          : global x7, MODULE x56, module x73, self x2, window x117

  Removed global overrides : location.hash, location.protocol

  Wrapped global overrides : $ x27, as, debug x6, JOY, meta x4, n2 x3, opt x2, pAdd, port, process x3, sAdd, soul, t2

  Wrapped global accessors : __dirname x9, $ x151, authRecall, AWS_SDK_NOT_INSTALLED, Buffer x4, cb, debug x230, document x27, echo, fetch x3, file, FileReader, fun x3, global x2, gun x11, Gun x19, GUN x2, Image, indexedDB x2, JOY x2, localStorage x2, meta x16, n2 x6, need, Node, obj_map, opt x4, path, port x4, process x44, Range, require x4, requireScriptPromises x3, setImmediate x6, sha1hash, soul x2, t2 x3, theirPubkey, Tone x11, window x5

  Ignored global accessors : atob, btoa x2, clearTimeout x19, location x11, MessageChannel x2, performance x2, setInterval x8, setTimeout x116, TextDecoder x8, TextEncoder x11

  Wrapped plugin imports   : aeskey x2, array, ask, axe, back, base64 x2, buffer x2, bye, certify, chain, decrypt, dup, email, encrypt, get, gun x52, http, index x6, jsonp, lib/axe, lib/text_encoding, mesh, meta/metaCore, meta/metaEvents, meta/metaUI, multicast, onto x2, open x3, put, radisk x2, radix x3, radix2, radmigtmp, rfs x2, rfsmix, root x17, rs3, sea x4, sea/aeskey, sea/array, sea/auth, sea/base64, sea/buffer, sea/certify, sea/create, sea/decrypt, sea/encrypt, sea/https, sea/index, sea/pair, sea/recall, sea/root, sea/sea, sea/secret, sea/settings, sea/sha1, sea/sha256, sea/share, sea/shim, sea/sign, sea/then, sea/user, sea/verify, sea/work, serve, settings x9, sha256 x4, shim x16, sign, src/ask, src/back, src/chain, src/dup, src/get, src/index, src/localStorage, src/map, src/mesh, src/on, src/onto, src/put, src/root, src/set, src/shim, src/state, src/type, src/valid, src/websocket, state, stats, store, user x4, valid, verify, wire, work, ws, yson x3

  Upgraded node imports    : buffer, child_process x2, dgram, events, fs x13, http, https, os x10, path x5, url x6, v8 x2

  Upgraded npm imports     : aws-sdk x2, chokidar, emailjs, formidable, gun, uws, ws x4

  Removed builtin overrides: Object.keys x4

  Wrapped builtin overrides: JSON.parseAsync x3, JSON.stringifyAsync x3, Object.empty, Object.Map x2, Object.maps, Object.plain, setTimeout.Book, setTimeout.check, setTimeout.each, setTimeout.hold, setTimeout.poll, setTimeout.RAD, setTimeout.RAD.has, setTimeout.turn, setTimeout.window, String.hash, String.match x2, String.random

  Wrapped builtin accessors: JSON.parseAsync x6, JSON.stringifyAsync x8, Math.random x15, Object.empty x3, Object.Map x12, Object.maps x2, Object.plain x10, setTimeout.Book x2, setTimeout.check, setTimeout.each x20, setTimeout.hold x2, setTimeout.poll x2, setTimeout.RAD.has, setTimeout.RAD x4, setTimeout.turn x9, setTimeout.window x2, String.hash x2, String.match x8, String.random x14

  Is async                 : No x106, Yes x26

  Is imported by           : axe.js x2, gun.js x18, lib/aws.js, lib/axe.js, lib/bye.js, lib/crashed.js, lib/debug.js, lib/erase.js, lib/evict.js, lib/file.js, lib/forget.js, lib/fork.js, lib/http.js, lib/hub.js, lib/jsonp.js, lib/later.js x2, lib/les.js, lib/level.js, lib/lex.js, lib/list.js x2, lib/load.js x2, lib/match.js, lib/memdisk.js, lib/meta.js x3, lib/mix.js, lib/multicast.js, lib/not.js, lib/open.js, lib/path.js, lib/promise.js, lib/radisk.js x4, lib/radisk2.js x2, lib/radix2.js, lib/radmigtmp.js, lib/rfs.js, lib/rfsmix.js, lib/rindexed.js, lib/rls.js, lib/role.js x2, lib/rs3.js x3, lib/server.js x11, lib/shim.js x3, lib/space.js, lib/stats.js x2, lib/store.js x2, lib/super.js x2, lib/then.js, lib/time.js, lib/unset.js, lib/uws.js, lib/verify.js, lib/webrtc.js, lib/wire.js, lib/ws.js, lib/wsp.js x4, nts.js, sea.js x25, sea/aeskey.js x3, sea/auth.js, sea/buffer.js, sea/certify.js, sea/create.js, sea/decrypt.js x4, sea/encrypt.js x4, sea/https.js, sea/index.js x3, sea/pair.js x3, sea/recall.js, sea/sea.js x9, sea/secret.js x3, sea/settings.js x2, sea/sha1.js, sea/sha256.js, sea/share.js, sea/shim.js x2, sea/sign.js x4, sea/then.js, sea/user.js x2, sea/verify.js x4, sea/work.js x4, src/ask.js, src/back.js, src/chain.js, src/dup.js, src/get.js, src/index.js x5, src/map.js, src/mesh.js, src/on.js, src/put.js, src/root.js x6, src/set.js, src/state.js, src/websocket.js x2

