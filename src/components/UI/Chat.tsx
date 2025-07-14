import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, Empty, Spin } from "antd";
import { Send, Search } from "lucide-react";
import { Message, Student, ServerMessage } from "../../types";
import studentManagementService from "../../services/studentManagement.service";
import chatService from "../../services/chat.service";
import socketService from "../../services/socket.service";
import authService from "../../services/auth.service";

const ChatInterface: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    userType: '',
    phoneNumber: ''
  });

  const filteredStudents = students.filter(
    (student) =>
      student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        await socketService.connect(token);
        
        socketService.on("new-message", (message: ServerMessage) => {
          console.log('Received new message:', message);
          const formattedMessage: Message = {
            id: Date.now().toString(),
            senderId: message.senderType === 'instructor' ? message.instructorPhone! : message.studentEmail,
            senderName: message.senderType === 'instructor' ? message.fromName || 'Instructor' : message.fromName || message.studentEmail,
            content: message.message,
            timestamp: new Date(message.timestamp),
            type: 'text',
            isOwn: message.senderType === userInfo.userType
          };
          setMessages(prev => [...prev, formattedMessage]);
        });

        socketService.on("error", (error: any) => {
          console.error('Socket error:', error);
          setError(`Chat error: ${error.message}`);
        });

      } catch (error: any) {
        console.error("Socket connection error:", error);
        setError(`Failed to connect to chat server: ${error.message}`);
      }
    };

    initializeSocket();

    return () => {
      socketService.disconnect();
    };
  }, [userInfo.userType]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await studentManagementService.getAllStudents();
        console.log('API Response:', response);
        
        if (response?.success && Array.isArray(response.students)) {
          const studentList = response.students.map((student: Student) => ({
            id: student.id || student.email,
            name: student.name || 'Unknown',
            email: student.email,
            isOnline: false,
          }));
          console.log('Formatted students:', studentList);
          setStudents(studentList);
        } else {
          console.warn('Invalid or empty students data:', response);
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
        setError("Failed to load students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await authService.getMe();
        if (data) {
          setUserInfo({
            name: data.name,
            userType: data.userType,
            phoneNumber: data.phoneNumber
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedStudent) return;

      try {
        setLoading(true);
        setError(null);
        const response = await chatService.getChatHistory(selectedStudent.email);
        console.log('Chat history response:', response);
        
        if (response?.success && Array.isArray(response.data)) {
          const formattedMessages = response.data.map((msg) => ({
            id: msg.id || Date.now().toString(),
            senderId: msg.senderType === "instructor" ? "me" : msg.studentEmail,
            senderName: msg.fromName || msg.studentEmail,
            content: msg.message,
            timestamp: new Date(msg.timestamp),
            type: "text" as const,
            isOwn: msg.senderType === "instructor",
          }));
          console.log('Formatted messages:', formattedMessages);
          setMessages(formattedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setError("Failed to load chat history");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [selectedStudent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedStudent) return;

    try {
      const messageData = {
        message: messageInput.trim(),
        recipientEmail: selectedStudent.email,
      };

      console.log('Sending message:', messageData);
      
      if (!socketService.isConnected()) {
        console.warn('Socket not connected, attempting to reconnect...');
        const token = localStorage.getItem("accessToken");
        if (token) {
          socketService.connect(token).then(() => {
            sendMessageWithSocket(messageData);
          }).catch(error => {
            setError("Failed to reconnect to chat server");
          });
        } else {
          setError("No authentication token found");
        }
        return;
      }

      sendMessageWithSocket(messageData);
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");
    }
  };

  const sendMessageWithSocket = (message: any) => {
    socketService.emit("send-message", message, (response: any) => {
      console.log('Message sent response:', response);
      if (response?.error) {
        console.error('Failed to send message:', response.error);
        setError(`Failed to send message: ${response.error}`);
        return;
      }
    });
    
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (error) {
    return (
      <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
        <div className="text-red-600 bg-red-50 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex">
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder="Search students..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            allowClear
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Spin />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-4">
              <Empty description="No students found" />
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div
                key={student.email}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedStudent?.email === student.email
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
                onClick={() => setSelectedStudent(student)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
                    {student.name?.charAt(0) || 'U'}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {student.name || 'Unknown'}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {student.email}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedStudent ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Avatar size={40} style={{ backgroundColor: "#1890ff" }}>
                  {selectedStudent.name?.charAt(0) || 'U'}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedStudent.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Spin size="large" />
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                      message.isOwn
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-900 border border-gray-200"
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-2">
                <Input.TextArea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="flex-1 resize-none"
                />
                <Button
                  type="primary"
                  icon={<Send size={16} />}
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="flex items-center"
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a student
              </h3>
              <p className="text-gray-500">
                Choose a student from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
