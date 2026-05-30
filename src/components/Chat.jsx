// import React, { useEffect, useState, useRef } from "react";
// import SockJS from "sockjs-client";
// import { Client } from "@stomp/stompjs";
// import { motion, AnimatePresence } from "framer-motion";
// import { Send, User, Circle, Paperclip, Smile, MoreVertical, Phone, Video } from "lucide-react";

// const Chat = ({ senderId, receiverId }) => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const scrollRef = useRef(null);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages]);

//   useEffect(() => {
//     // LOAD OLD CHAT
//     fetch(`http://localhost:8080/api/chat/${senderId}/${receiverId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setMessages(data);
//       });

//     // SOCKET CONNECTION
//     const socket = new SockJS("http://localhost:8080/ws");

//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,
//       onConnect: () => {
//         console.log("Connected");

//         // PRIVATE SUBSCRIPTION
//         stompClient.subscribe(`/topic/messages/${senderId}`, (msg) => {
//           const receivedMessage = JSON.parse(msg.body);

//           // ONLY CURRENT CHAT
//           if (
//             (receivedMessage.senderId === senderId &&
//               receivedMessage.receiverId === receiverId) ||
//             (receivedMessage.senderId === receiverId &&
//               receivedMessage.receiverId === senderId)
//           ) {
//             setMessages((prev) => [...prev, receivedMessage]);
//           }
//         });
//       },
//     });

//     stompClient.activate();
//     window.stompClient = stompClient;

//     return () => {
//       stompClient.deactivate();
//     };
//   }, [senderId, receiverId]);

//   const sendMessage = () => {
//     if (message.trim() === "") return;

//     const chatMessage = {
//       senderId,
//       receiverId,
//       message,
//     };

//     window.stompClient.publish({
//       destination: "/app/chat",
//       body: JSON.stringify(chatMessage),
//     });

//     setMessage("");
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   return (
//     <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto my-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden font-sans">
//       {/* HEADER */}
//       <div className="px-6 py-4 bg-white/50 border-b border-slate-100 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
//               <User className="h-6 w-6" />
//             </div>
//             <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white flex items-center justify-center">
//               <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
//             </div>
//           </div>
//           <div>
//             <h3 className="text-lg font-bold text-slate-800">Live Support</h3>
//             <div className="flex items-center gap-1.5">
//               <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Online</span>
//             </div>
//           </div>
//         </div>
//         <div className="flex items-center gap-3">
//           <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
//             <Phone className="h-5 w-5" />
//           </button>
//           <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
//             <Video className="h-5 w-5" />
//           </button>
//           <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
//             <MoreVertical className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* CHAT AREA */}
//       <div
//         ref={scrollRef}
//         className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth"
//       >
//         <AnimatePresence initial={false}>
//           {messages.map((msg, index) => {
//             const isSender = msg.senderId === senderId;
//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 className={`flex ${isSender ? "justify-end" : "justify-start"}`}
//               >
//                 <div className={`max-w-[75%] group relative ${isSender ? "text-right" : "text-left"}`}>
//                   <div className={`
//                     px-5 py-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed
//                     ${isSender
//                       ? "bg-gradient-to-br from-teal-600 to-teal-500 text-white rounded-tr-none"
//                       : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"}
//                   `}>
//                     {msg.message}
//                   </div>
//                   <motion.span
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 0.5 }}
//                     className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest block"
//                   >
//                     {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </motion.span>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>

//       {/* INPUT AREA */}
//       <div className="p-5 bg-white/80 border-t border-slate-100 backdrop-blur-md">
//         <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-2xl border border-slate-200/50 focus-within:border-teal-400/50 focus-within:bg-white transition-all duration-300">
//           <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
//             <Paperclip className="h-5 w-5" />
//           </button>

//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message..."
//             className="flex-1 bg-transparent py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
//           />

//           <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
//             <Smile className="h-5 w-5" />
//           </button>

//           <button
//             onClick={sendMessage}
//             disabled={!message.trim()}
//             className={`
//               p-3 rounded-xl transition-all duration-300 shadow-lg
//               ${message.trim()
//                 ? "bg-teal-600 text-white shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-0.5"
//                 : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"}
//             `}
//           >
//             <Send className="h-5 w-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  ArrowLeft,
  Paperclip,
  Smile,
  MoreVertical,
} from "lucide-react";

const Chat = ({ senderId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const scrollRef = useRef(null);

  // FORMAT TIME
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // AUTO SCROLL
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // LOAD OLD CHAT
    fetch(`http://localhost:8080/api/chat/${senderId}/${receiverId}`)
      .then((res) => res.json())
      .then((data) => {
        // ADD FIXED TIME TO OLD MSGS
        const updatedMessages = data.map((msg) => ({
          ...msg,
          time: msg.time || new Date().toISOString(),
        }));

        setMessages(updatedMessages);
      });

    // SOCKET CONNECTION
    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        stompClient.subscribe(`/topic/messages/${senderId}`, (msg) => {
          const receivedMessage = JSON.parse(msg.body);

          if (
            (receivedMessage.senderId === senderId &&
              receivedMessage.receiverId === receiverId) ||
            (receivedMessage.senderId === receiverId &&
              receivedMessage.receiverId === senderId)
          ) {
            // FIXED TIME PER MESSAGE
            const updatedMessage = {
              ...receivedMessage,
              time: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, updatedMessage]);
          }
        });
      },
    });

    stompClient.activate();
    window.stompClient = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const chatMessage = {
      senderId,
      receiverId,
      message,
      time: new Date().toISOString(),
    };

    // ADD MESSAGE INSTANTLY
    setMessages((prev) => [...prev, chatMessage]);

    window.stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(chatMessage),
    });

    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto my-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden font-sans">
      {/* HEADER */}
      <div className="px-6 py-4 bg-white/50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-full text-slate-500 hover:text-teal-600 hover:bg-slate-100 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <User className="h-6 w-6" />
            </div>

            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">Live Support</h3>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                Online
              </span>
            </div>
          </div>
        </div>

        {/* ONLY MENU */}
        <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      {/* CHAT AREA */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const isSender = msg.senderId === senderId;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] group relative ${
                    isSender ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`
                      px-5 py-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed
                      ${
                        isSender
                          ? "bg-gradient-to-br from-teal-600 to-teal-500 text-white rounded-tr-none"
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                      }
                    `}
                  >
                    {msg.message}
                  </div>

                  {/* FIXED TIME */}
                  <span className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest block">
                    {formatTime(msg.time)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* INPUT AREA */}
      <div className="p-5 bg-white/80 border-t border-slate-100 backdrop-blur-md">
        <div className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-2xl border border-slate-200/50 focus-within:border-teal-400/50 focus-within:bg-white transition-all duration-300">
          <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-transparent py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />

          <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors">
            <Smile className="h-5 w-5" />
          </button>

          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className={`
              p-3 rounded-xl transition-all duration-300 shadow-lg
              ${
                message.trim()
                  ? "bg-teal-600 text-white shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-0.5"
                  : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              }
            `}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
