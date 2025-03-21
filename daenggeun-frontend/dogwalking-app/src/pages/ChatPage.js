"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Client } from "@stomp/stompjs"; // ✅ STOMP 클라이언트 추가
import "../styles/Chat.css";
import chatAPI from "../utils/chatApi";

function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // URL 쿼리에서 채팅방 ID 및 사용자 ID 가져오기
  const queryParams = new URLSearchParams(location.search);
  const chatRoomId = queryParams.get("chatRoomId");
  const senderId = queryParams.get("senderId");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!chatRoomId) return;

    const fetchMessages = async () => {
      try {
        const chatMessages = await chatAPI.getChatMessages(chatRoomId);
        setMessages(chatMessages);
      } catch (error) {
        console.error("기존 메세지 불러오기 실패:", error);
      }
    };
    fetchMessages();
    const intervalId = setInterval(fetchMessages, 1000);
    return () => clearInterval(intervalId);
  }, [chatRoomId]);



  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // ✅ WebSocket 연결 설정
  useEffect(() => {
    if (!chatRoomId) return;

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-chat", // WebSocket 서버 주소
      reconnectDelay: 5000, // 자동 재연결 활성화
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공");

        // ✅ 특정 채팅방을 구독하여 메시지 받기
        client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, receivedMessage]);
        });
      },
      onStompError: (error) => {
        console.error("🚨 WebSocket 오류 발생:", error);
      },
    });

    client.activate(); // WebSocket 연결 활성화
    setStompClient(client);

    return () => {
      client.deactivate(); // 컴포넌트 언마운트 시 연결 해제
    };
  }, [chatRoomId]);

  // ✅ 메시지 전송 핸들러
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      chatRoomId,
      senderId,
      message: newMessage,
      createdAt: new Date().toISOString(),
    };

    // ✅ WebSocket으로 메시지 전송
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messageData),
      });

      setNewMessage(""); // 입력 필드 초기화
    } else {
      console.error("❌ WebSocket 연결이 안 되어 있음.");
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-card">
          {/* 채팅 내용 */}
          <div className="chat-content">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.senderId === Number(senderId)
                    ? "message-mine"
                    : "message-other"
                }`}
              >
                <div className="message-bubble">
                  <div className="message-text">{message.message}</div>
                  <div className="message-time">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 폼 */}
          <div className="chat-footer">
            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                className="message-input"
                placeholder="메시지를 입력하세요..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-button">
                전송
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
