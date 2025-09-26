import { createSignal } from "solid-js";

const [messages, setMessages] = createSignal([]);
const token = localStorage.getItem("token");
const ws = new WebSocket(`wss://cautious-space-eureka-rwjpxj9v6653p65g-8080.app.github.dev/?token=${token}`);

ws.onopen = () => {
    console.log('WebSocket connected');
};

ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data && typeof data === 'object' && data.message) {
            setMessages(prev => [...prev, data.message]);
        } else {
            setMessages(prev => [...prev, data]);
        }
    } catch {
        setMessages(prev => [...prev, { content: event.data }]);
    }
};

ws.onclose = () => {
    console.log('WebSocket disconnected');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

function sendMessage(msg: string) {
    ws.send(msg);
}

export { messages, ws, sendMessage };