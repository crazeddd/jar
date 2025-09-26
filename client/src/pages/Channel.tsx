import { useNavigate } from '@solidjs/router';
import { createSignal, createEffect, For, createMemo } from 'solid-js';
import { messages, sendMessage } from "../websocket";

function WebSocketComponent() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login")
  }

  const [inputValue, setInputValue] = createSignal('');

  const handleSend = () => {
    if (!inputValue().trim()) return;
    if (inputValue().length > 2000) {
      alert("Message too long (max 2000 characters)");
      return;
    }

    sendMessage(inputValue());
    setInputValue('');
  }

  const reversed = createMemo(() => [...messages()].reverse()); // not very efficient, might change later

  createEffect(() => {
    const handleEnter = (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [inputValue]);

  return (
    <main>
      <div class="flex align-center g-2">
        <img src="/jar.svg" class="icon" />
      </div>
      <div class="channel">
        <h5>General 1</h5>
        <hr />
        <div class="content">
          <For each={reversed()}>{(msg) => {
            
            let time = new Date(msg.timestamp);
            let hours = time.getHours();
            let minutes = time.getMinutes();

            return (
              <div class="flex g-3 align-center">
                <div class="pfp"></div>
                <div class="flex flex-col">
                  <p><b>{msg.userName}</b> <small class="txt-muted">{`${hours}:${minutes}`}</small></p>
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          }}
          </For>
        </div>
        <div class="flex g-2">
          <input
            type="text"
            class="w-100"
            value={inputValue()}
            onInput={(e) => setInputValue(e.target.value)}
          />
          <button class="primary" onClick={handleSend}>Send</button>
        </div>
      </div>
    </main>
  );
}

export default WebSocketComponent;