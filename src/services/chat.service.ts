import apiInstance from "./api";
import { ChatHistoryResponse } from "../types";

const chatService = {
  getChatHistory: async (studentEmail?: string): Promise<ChatHistoryResponse> => {
    const url = studentEmail 
      ? `${import.meta.env.VITE_CHAT_INTRUCTOR_WITH_STUDENT}?recipientEmail=${studentEmail}`
      : import.meta.env.VITE_CHAT_INTRUCTOR_WITH_STUDENT;
    
    const response = await apiInstance.get(url);
    return response.data;
  }
};

export default chatService; 