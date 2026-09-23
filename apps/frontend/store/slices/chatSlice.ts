import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sendChatMessage, ChatMessageItem } from '@/apis/chat.api';

const DEFAULT_WELCOME_MESSAGE: ChatMessageItem = {
  id: 'welcome-init',
  role: 'assistant',
  content:
    `Hello! 👋 I am your **BuildForJob AI Navigator & Platform Guide**.\n\n` +
    `I have full knowledge about the website and can help you navigate and use any feature (Resume Builder, ATS Checker, Portfolio Builder, Cover Letters, GitHub Connect, Application Versions).\n\n` +
    `How can I help you navigate or build today?`,
  timestamp: Date.now(),
};

const loadInitialMessages = (): ChatMessageItem[] => {
  if (typeof window === 'undefined') return [DEFAULT_WELCOME_MESSAGE];
  try {
    const saved = localStorage.getItem('bfj_chat_history');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load saved chat history:', err);
  }
  return [DEFAULT_WELCOME_MESSAGE];
};

const saveMessagesToStorage = (messages: ChatMessageItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('bfj_chat_history', JSON.stringify(messages));
  } catch (err) {
    console.warn('Failed to save chat history:', err);
  }
};

interface ChatState {
  messages: ChatMessageItem[];
  isLoading: boolean;
  error: string | null;
  isOpenDrawer: boolean;
}

const initialState: ChatState = {
  messages: loadInitialMessages(),
  isLoading: false,
  error: null,
  isOpenDrawer: false,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (
    { text, customHistory }: { text: string; customHistory?: { role: 'user' | 'assistant' | 'system'; content: string }[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { chat: ChatState };
      const historyPayload = customHistory || state.chat.messages
        .filter((m) => m.id !== 'welcome-init')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await sendChatMessage(text, historyPayload);
      return response;
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Failed to send message';
      return rejectWithValue(msg);
    }
  }
);

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const userMsg: ChatMessageItem = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'user',
        content: action.payload,
        timestamp: Date.now(),
      };
      state.messages.push(userMsg);
      saveMessagesToStorage(state.messages);
    },
    clearChat: (state) => {
      const freshWelcome: ChatMessageItem = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat history cleared! How can I assist you with your career tools or job searches today?`,
        timestamp: Date.now(),
      };
      state.messages = [freshWelcome];
      saveMessagesToStorage(state.messages);
      state.error = null;
    },
    toggleDrawer: (state) => {
      state.isOpenDrawer = !state.isOpenDrawer;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpenDrawer = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const botMsg: ChatMessageItem = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          role: 'assistant',
          content: action.payload.reply,
          scrapedJob: action.payload.scrapedJob,
          timestamp: Date.now(),
        };
        state.messages.push(botMsg);
        saveMessagesToStorage(state.messages);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        const errorMsg: ChatMessageItem = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ Error: ${action.payload || 'Failed to communicate with AI Assistant.'}`,
          timestamp: Date.now(),
        };
        state.messages.push(errorMsg);
        saveMessagesToStorage(state.messages);
      });
  },
});

export const { addUserMessage, clearChat, toggleDrawer, setDrawerOpen } = chatSlice.actions;
export default chatSlice.reducer;
