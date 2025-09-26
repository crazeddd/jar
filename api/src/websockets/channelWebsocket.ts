
import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import db from '../db/db';

interface AuthedWebSocket extends WebSocket {
    userId?: number;
    userName?: string;
}

const secret = process.env.USER_TOKEN;

if (!secret) throw new Error("USER_TOKEN env var not set!!!");

const channelWebsocket = (server: any) => {
    const wss = new WebSocketServer({ server });
    const clients = new Set<AuthedWebSocket>();

    wss.on('connection', function connection(ws: WebSocket, req: any) {
        const urlString = req.url ? `http://${req.headers.host}${req.url}` : `http://${req.headers.host}`;
        let url: URL;
        try {
            url = new URL(urlString);
        } catch {
            ws.send(JSON.stringify({ error: 'Invalid connection URL' }));
            ws.close();
            return;
        }
        const token = url.searchParams.get('token');
        if (!token) {
            ws.send(JSON.stringify({ error: 'Authentication required' }));
            ws.close();
            return;
        }
        let payload: any;
        try {
            payload = jwt.verify(token, secret);
        } catch (err) {
            ws.send(JSON.stringify({ error: 'Invalid token' }));
            ws.close();
            return;
        }
        // Attach user info to ws
        const authedWs = ws as AuthedWebSocket;
        authedWs.userId = payload.userId;
        authedWs.userName = payload.userName;

        clients.add(authedWs);
        console.log(`User ${authedWs.userName} connected`);
        authedWs.send(JSON.stringify({ userName: "DEBUG", content: 'Connected to channel.' }));

        authedWs.on('message', function incoming(message: any) {
            // Save message to DB and broadcast
            const msg = message.toString();
            if (!authedWs.userId) return;
            
            if (msg.length > 2000) {
                authedWs.send(JSON.stringify({ error: 'Message too long (max 2000 characters)' }));
                return;
            } else if (msg.trim().length === 0) {
                authedWs.send(JSON.stringify({ error: 'Message cannot be empty' }));
                return;
            }

            db.run(
                'CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, userName TEXT, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)',
                (err: any) => {
                    if (err) {
                        authedWs.send(JSON.stringify({ error: 'DB error' }));
                        return;
                    }
                    db.run(
                        'INSERT INTO messages (userId, userName, content) VALUES (?, ?, ?)',
                        [authedWs.userId, authedWs.userName, msg],
                        function (err: any) {
                            if (err) {
                                authedWs.send(JSON.stringify({ error: 'DB error' }));
                                return;
                            }
                            const outMsg = {
                                id: this.lastID,
                                userId: authedWs.userId,
                                userName: authedWs.userName,
                                content: msg,
                                timestamp: new Date().toISOString(),
                            };
                            // Broadcast to all
                            for (const client of clients) {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify({ message: outMsg }));
                                }
                            }
                        }
                    );
                }
            );
        });

        authedWs.on('close', () => {
            clients.delete(authedWs);
            console.log(`User ${authedWs.userName} disconnected`);
        });

        authedWs.on('error', (error: any) => {
            console.error('WebSocket error:', error);
        });
    });
};

export default channelWebsocket;