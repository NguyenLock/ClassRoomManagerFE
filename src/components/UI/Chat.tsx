import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Avatar, Empty, Spin } from "antd";
import { Send, Search } from "lucide-react";
import { Message, Student, ServerMessage, Instructor } from "../../types";
import studentManagementService from "../../services/studentManagement.service";
import { studentAuthService } from "../../services/studentAuth.service";
import chatService from "../../services/chat.service";
import socketService from "../../services/socket.service";
import authService from "../../services/auth.service";

interface Contact extends Student {
  type: "student";
}

interface InstructorContact extends Instructor {
  type: "instructor";
  id: string;
  isOnline: boolean;
}

const ChatInterface: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<
    Contact | InstructorContact | null
  >(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<(Contact | InstructorContact)[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<any>(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    userType: "",
    phoneNumber: "",
  });

  const filteredContacts = contacts.filter(
    (contact) =>
      contact?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.type === "student"
        ? contact.email.toLowerCase().includes(searchQuery.toLowerCase())
        : contact.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()))
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
          const formattedMessage: Message = {
            id: Date.now().toString(),
            senderId:
              message.senderType === "instructor"
                ? message.instructorPhone!
                : message.studentEmail,
            senderName:
              message.senderType === "instructor"
                ? message.fromName || "Instructor"
                : message.fromName || message.studentEmail,
            content: message.message,
            timestamp: new Date(message.timestamp),
            type: "text",
            isOwn: message.senderType === userInfo.userType,
          };
          setMessages((prev) => [...prev, formattedMessage]);
        });

        socketService.on("error", (error: any) => {
          setError(`Chat error: ${error.message}`);
        });
      } catch (error: any) {
        setError(`Failed to connect to chat server: ${error.message}`);
      }
    };

    initializeSocket();

    return () => {
      socketService.disconnect();
    };
  }, [userInfo.userType]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (userInfo.userType === "student") {
          const response = await studentAuthService.getAllInstructors();

          if (response?.success && Array.isArray(response.data)) {
            const instructorList = response.data.map(
              (instructor: Instructor): InstructorContact => ({
                ...instructor,
                type: "instructor",
                id: instructor.phoneNumber,
                isOnline: false,
              })
            );
            setContacts(instructorList);
          } else {
            setContacts([]);
          }
        } else {
          const response = await studentManagementService.getAllStudents();

          if (response?.success && Array.isArray(response.students)) {
            const studentList = response.students.map(
              (student: Student): Contact => ({
                ...student,
                type: "student",
                id: student.id || student.email,
                isOnline: false,
              })
            );
            setContacts(studentList);
          } else {
            setContacts([]);
          }
        }
      } catch (error) {
        setError("Failed to load contacts");
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo.userType) {
      fetchContacts();
    }
  }, [userInfo.userType]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await authService.getMe();
        if (data) {
          setUserInfo({
            name: data.name,
            userType: data.userType,
            phoneNumber: data.phoneNumber,
          });
        }
      } catch (error) {}
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedContact) return;

      try {
        setLoading(true);
        setError(null);
        const contactId =
          selectedContact.type === "student"
            ? selectedContact.email
            : selectedContact.phoneNumber;
        const response = await chatService.getChatHistory(contactId);

        if (response?.success && Array.isArray(response.data)) {
          const formattedMessages = response.data.map((msg) => ({
            id: msg.id || Date.now().toString(),
            senderId:
              msg.senderType === "instructor"
                ? msg.instructorPhone || "me"
                : msg.studentEmail,
            senderName:
              msg.fromName ||
              (selectedContact.type === "student"
                ? selectedContact.email
                : selectedContact.phoneNumber),
            content: msg.message,
            timestamp: new Date(msg.timestamp),
            type: "text" as const,
            isOwn: msg.senderType === userInfo.userType,
          }));
          setMessages(formattedMessages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        setError("Failed to load chat history");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [selectedContact, userInfo.userType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    try {
      const messageData = {
        message: messageInput.trim(),
        recipientEmail:
          selectedContact.type === "student"
            ? selectedContact.email
            : undefined,
        recipientPhone:
          selectedContact.type === "instructor"
            ? selectedContact.phoneNumber
            : undefined,
      };

      if (!socketService.isConnected()) {
        const token = localStorage.getItem("accessToken");
        if (token) {
          socketService
            .connect(token)
            .then(() => {
              sendMessageWithSocket(messageData);
            })
            .catch((error) => {
              setError("Failed to reconnect to chat server");
            });
        } else {
          setError("No authentication token found");
        }
        return;
      }

      sendMessageWithSocket(messageData);
    } catch (error) {
      setError("Failed to send message");
    }
  };

  const sendMessageWithSocket = (message: any) => {
    socketService.emit("send-message", message, (response: any) => {
      if (response?.error) {
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
        <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm overflow-hidden flex">
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Input
            placeholder={`Search ${
              userInfo.userType === "student" ? "instructors" : "students"
            }...`}
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
          ) : filteredContacts.length === 0 ? (
            <div className="p-4">
              <Empty
                description={`No ${
                  userInfo.userType === "student" ? "instructors" : "students"
                } found`}
              />
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact?.id === contact.id
                    ? "bg-blue-50 border-blue-200"
                    : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar size={48} style={{ backgroundColor: "#1890ff" }}>
                    {contact.name?.charAt(0) || "U"}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {contact.name || "Unknown"}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {contact.type === "student"
                        ? contact.email
                        : contact.phoneNumber}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <Avatar size={40} style={{ backgroundColor: "#1890ff" }}>
                  {selectedContact.name?.charAt(0) || "U"}
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedContact.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedContact.type === "student"
                      ? selectedContact.email
                      : selectedContact.phoneNumber}
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
                    className={`flex ${
                      message.isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                        message.isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
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
                Select a{" "}
                {userInfo.userType === "student" ? "instructor" : "student"}
              </h3>
              <p className="text-gray-500">
                Choose a{" "}
                {userInfo.userType === "student" ? "instructor" : "student"}{" "}
                from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
