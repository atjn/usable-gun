/**
 * @file
 * When upgrading from CJS to ESM, the `ws` package changes its exports.
 * This wrapper restores the old export structure to make it compatible with the Gun code, which is expecting the CJS export layout.
 */

import { createWebSocketStream, Receiver, Sender, WebSocket, WebSocketServer } from "ws";

WebSocket.createWebSocketStream = createWebSocketStream;
WebSocket.Server = WebSocketServer;
WebSocket.Sender = Sender;
WebSocket.Receiver = Receiver;
WebSocket.WebSocket = WebSocket;
WebSocket.WebSocketServer = WebSocketServer;

export default WebSocket;

