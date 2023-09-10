/**
 * @file
 * The `ws` package changes its exports based on which module system it is being imported by.
 * This is very buggy because different bundlers and systems will activate different exports, and thus make it impossible for code to know which export layout to use.
 * This wrapper restores the old export structure to make it compatible with the Gun code, which is expecting the CJS export layout.
 */

const _ws = await import("ws");

const _WebSocket = _ws.WebSocket ?? _ws.default;

_WebSocket.createWebSocketStream ??= _ws.createWebSocketStream;
_WebSocket.Server ??= _ws.WebSocketServer;
_WebSocket.Sender ??= _ws.Sender;
_WebSocket.Receiver ??= _ws.Receiver;
_WebSocket.WebSocket ??= _ws.WebSocket;
_WebSocket.WebSocketServer ??= _ws.WebSocketServer;

export default _WebSocket;

