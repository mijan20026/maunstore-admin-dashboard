"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Phone, Video, MoreHorizontal } from "lucide-react";
import { socketService } from "@/lib/socket";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isAdmin: boolean;
}

interface ChatSession {
  id: string;
  userName: string;
  userEmail: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: "active" | "waiting" | "closed";
}

const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    userName: "John Doe",
    userEmail: "john@example.com",
    lastMessage: "I need help with my order",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    status: "active",
  },
  {
    id: "2",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    lastMessage: "Product not delivered yet",
    lastMessageTime: "5 min ago",
    unreadCount: 1,
    status: "waiting",
  },
  {
    id: "3",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    lastMessage: "Thank you for your help!",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    status: "closed",
  },
  {
    id: "4",
    userName: "Johnson",
    userEmail: "mike@example.com",
    lastMessage: "Thank you for your help!",
    lastMessageTime: "1 hour ago",
    unreadCount: 10,
    status: "closed",
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "John Doe",
    message: "Hi, I need help with my order",
    timestamp: "2024-01-15T10:30:00Z",
    isAdmin: false,
  },
  {
    id: "2",
    senderId: "admin",
    senderName: "Admin",
    message:
      "Hello! I'd be happy to help you with your order. Could you please provide your order number?",
    timestamp: "2024-01-15T10:31:00Z",
    isAdmin: true,
  },
  {
    id: "3",
    senderId: "1",
    senderName: "John Doe",
    message: "Sure, my order number is #12345",
    timestamp: "2024-01-15T10:32:00Z",
    isAdmin: false,
  },
];

export default function SupportPage() {
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(
    mockChatSessions[0]
  );
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [chatSessions, setChatSessions] =
    useState<ChatSession[]>(mockChatSessions);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (socket) {
      socket.on("newMessage", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("newChatSession", (session: ChatSession) => {
        setChatSessions((prev) => [...prev, session]);
      });

      return () => {
        socket.off("newMessage");
        socket.off("newChatSession");
      };
    }
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "admin",
        senderName: "Admin",
        message: newMessage,
        timestamp: new Date().toISOString(),
        isAdmin: true,
      };

      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Emit to socket
      const socket = socketService.getSocket();
      if (socket) {
        socket.emit("sendMessage", {
          chatId: selectedChat.id,
          message: message,
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "waiting":
        return "bg-yellow-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Chat</h1>
        <p className="text-muted-foreground">
          Manage customer support conversations in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Chat Sessions List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Active Conversations</CardTitle>
            <CardDescription>
              {chatSessions.filter((s) => s.status === "active").length} active
              chats
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === session.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedChat(session)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={session.avatar}
                          alt={session.userName}
                        />
                        <AvatarFallback>
                          {session.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
                          session.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">
                          {session.userName}
                        </p>
                        <span className="text-xs text-gray-500">
                          {session.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        {/* <Badge variant="outline" className="text-xs">
                          {session.status}
                        </Badge> */}
                        <p className="text-sm text-gray-500 truncate">
                          {session.lastMessage}
                        </p>
                        {session.unreadCount > 0 && (
                          <Badge className="text-xs bg-primary text-white">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <Card className="lg:col-span-3">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={selectedChat.avatar}
                        alt={selectedChat.userName}
                      />
                      <AvatarFallback>
                        {selectedChat.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedChat.userName}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedChat.userEmail}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div> */}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isAdmin
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.isAdmin
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a chat from the list to start messaging
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send } from "lucide-react";
// import { socketService } from "@/lib/socket";

// interface Message {
//   id: string;
//   senderId: string;
//   senderName: string;
//   message: string;
//   timestamp: string;
//   isAdmin: boolean;
// }

// interface ChatSession {
//   id: string;
//   userName: string;
//   userEmail: string;
//   avatar?: string;
//   lastMessage: string;
//   lastMessageTime: string;
//   unreadCount: number;
//   status: "active" | "waiting" | "closed";
// }

// export default function SupportPage() {
//   const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     const socket = socketService.getSocket();

//     // Load initial chat sessions
//     socket.emit("getChatSessions");
//     socket.on("chatSessions", (sessions: ChatSession[]) =>
//       setChatSessions(sessions)
//     );

//     // Listen for messages
//     socket.on("chatMessages", (msgs: Message[]) => setMessages(msgs));
//     socket.on(
//       "newMessage",
//       ({ chatId, message }: { chatId: string; message: Message }) => {
//         if (selectedChat && chatId === selectedChat.id) {
//           setMessages((prev) => [...prev, message]);
//         }
//         setChatSessions((prev) =>
//           prev.map((s) =>
//             s.id === chatId ? { ...s, unreadCount: s.unreadCount + 1 } : s
//           )
//         );
//       }
//     );

//     // Listen for new chat sessions
//     socket.on("newChatSession", (session: ChatSession) =>
//       setChatSessions((prev) => [...prev, session])
//     );

//     return () => {
//       socket.off("chatSessions");
//       socket.off("chatMessages");
//       socket.off("newMessage");
//       socket.off("newChatSession");
//     };
//   }, [selectedChat]);

//   // Load messages when selecting a chat
//   useEffect(() => {
//     if (!selectedChat) return;
//     const socket = socketService.getSocket();
//     socket.emit("getMessages", selectedChat.id);

//     // Reset unread count
//     setChatSessions((prev) =>
//       prev.map((s) => (s.id === selectedChat.id ? { ...s, unreadCount: 0 } : s))
//     );
//   }, [selectedChat]);

//   const sendMessage = () => {
//     if (newMessage.trim() && selectedChat) {
//       const message: Message = {
//         id: Date.now().toString(),
//         senderId: "admin",
//         senderName: "Admin",
//         message: newMessage,
//         timestamp: new Date().toISOString(),
//         isAdmin: true,
//       };

//       setMessages((prev) => [...prev, message]);
//       setNewMessage("");

//       const socket = socketService.getSocket();
//       socket.emit("sendMessage", { chatId: selectedChat.id, message });
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-500";
//       case "waiting":
//         return "bg-yellow-500";
//       case "closed":
//         return "bg-gray-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Support Chat</h1>
//         <p className="text-muted-foreground">
//           Manage customer support conversations in real-time.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
//         {/* Chat Sessions List */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle>Active Conversations</CardTitle>
//             <CardDescription>
//               {chatSessions.filter((s) => s.status === "active").length} active
//               chats
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="p-0">
//             <ScrollArea className="h-[500px]">
//               {chatSessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
//                     selectedChat?.id === session.id ? "bg-blue-50" : ""
//                   }`}
//                   onClick={() => setSelectedChat(session)}
//                 >
//                   <div className="flex items-start space-x-3">
//                     <div className="relative">
//                       <Avatar className="h-10 w-10">
//                         <AvatarImage
//                           src={session.avatar}
//                           alt={session.userName}
//                         />
//                         <AvatarFallback>
//                           {session.userName
//                             .split(" ")
//                             .map((n) => n[0])
//                             .join("")}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div
//                         className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(
//                           session.status
//                         )}`}
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between">
//                         <p className="text-sm font-medium truncate">
//                           {session.userName}
//                         </p>
//                         <span className="text-xs text-gray-500">
//                           {session.lastMessageTime}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between mt-1">
//                         <p className="text-sm text-gray-500 truncate">
//                           {session.lastMessage}
//                         </p>
//                         {session.unreadCount > 0 && (
//                           <Badge className="text-xs bg-primary text-white">
//                             {session.unreadCount}
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </ScrollArea>
//           </CardContent>
//         </Card>

//         {/* Chat Messages */}
//         <Card className="lg:col-span-3">
//           {selectedChat ? (
//             <>
//               <CardHeader className="border-b">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-3">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage
//                         src={selectedChat.avatar}
//                         alt={selectedChat.userName}
//                       />
//                       <AvatarFallback>
//                         {selectedChat.userName
//                           .split(" ")
//                           .map((n) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-medium">{selectedChat.userName}</h3>
//                       <p className="text-sm text-gray-500">
//                         {selectedChat.userEmail}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <ScrollArea className="h-[400px] p-4">
//                   <div className="space-y-4">
//                     {messages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex ${
//                           message.isAdmin ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`max-w-[70%] p-3 rounded-lg ${
//                             message.isAdmin
//                               ? "bg-blue-500 text-white"
//                               : "bg-gray-100 text-gray-900"
//                           }`}
//                         >
//                           <p className="text-sm">{message.message}</p>
//                           <p
//                             className={`text-xs mt-1 ${
//                               message.isAdmin
//                                 ? "text-blue-100"
//                                 : "text-gray-500"
//                             }`}
//                           >
//                             {new Date(message.timestamp).toLocaleTimeString()}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                     <div ref={messagesEndRef} />
//                   </div>
//                 </ScrollArea>
//                 <div className="border-t p-4">
//                   <div className="flex space-x-2">
//                     <Input
//                       value={newMessage}
//                       onChange={(e) => setNewMessage(e.target.value)}
//                       placeholder="Type your message..."
//                       onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//                     />
//                     <Button onClick={sendMessage}>
//                       <Send className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </>
//           ) : (
//             <CardContent className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <h3 className="text-lg font-medium mb-2">
//                   Select a conversation
//                 </h3>
//                 <p className="text-gray-500">
//                   Choose a chat from the list to start messaging
//                 </p>
//               </div>
//             </CardContent>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }
