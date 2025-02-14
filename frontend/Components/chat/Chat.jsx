import { useState, useEffect, useRef } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const socketref = useRef(null);

  useEffect(() => {
    const connect = () => {
      socketref.current = new WebSocket("ws://localhost:9192/ws");
      //   whenConnectionOpen
      socketref.current.addEventListener("open", () => {
        console.log("connection ok");
        if (socketref.current.readyState === WebSocket.OPEN) {
          socketref.current.send(
            JSON.stringify({
              type: "subscribe",
              endpoint: "/topic/messages",
            })
          );
        }
      });

      // for incoming messages
      socketref.current.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        console.log("received message", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // listener for errors
      socketref.current.addEventListener("error", (error) => {
        console.log("websocket error:", error);
      });
      // when con closed
      socketref.current.addEventListener("closed", () => {
        console.log("con closed");
      });

      /*const socket = new WebSocket("ws://localhost:9192/ws");
      const client = Stomp.over(socket);

      client.connect({}, () => {
        client.subscribe("/topic/messages", (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      });

      stompClient.current = client;*/
    };

    connect();

    // return () => {
    //   if (socketref.current) {
    //     socketref.current.close();
    //   }
    //   //   if (stompClient.current && stompClient.current.connected) {
    //   //     stompClient.current.disconnect();
    //   //   }
    // };
  }, []);

  const handleMessageChange = (event) => {
    setText(event.target.value);
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (text.trim() && socketref.current.readyState === WebSocket.OPEN) {
      const chatMessage = {
        nickname,
        content: text,
      };
      socketref.current.send(JSON.stringify(chatMessage));
      setText("");
    } else {
      console.log("WebSocket is not open. Cannot send message.");
    }
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>ChatRoom</h2>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.nickname}</strong>: {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleMessageChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
