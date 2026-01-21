import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import type { ChatMessage } from './chatTypes';

interface StreamState {
  isStreaming: boolean;
  targetWordCount: number;
  generatedWords: number;
}

interface ChatState {
  messages: ChatMessage[];
  stream: StreamState | null;
  autoScroll: boolean;
  addUserMessage: (content: string) => void;
  startStreamingResponse: (targetWordCount: number) => string | null;
  appendToMessage: (id: string, chunk: string, words: number) => void;
  finishStreaming: () => void;
  stopStreaming: () => void;
  setAutoScroll: (value: boolean) => void;
  hydrateLongHistory: (messages: ChatMessage[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  stream: null,
  autoScroll: true,

  addUserMessage: (content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: nanoid(),
          role: 'user',
          content,
          createdAt: Date.now(),
        },
      ],
    })),

  startStreamingResponse: (targetWordCount) => {
    const stream: StreamState = {
      isStreaming: true,
      targetWordCount,
      generatedWords: 0,
    };

    let assistantId: string | null = null;

    set((state) => {
      assistantId = nanoid();
      return {
        messages: [
          ...state.messages,
          {
            id: assistantId!,
            role: 'assistant',
            content: '',
            createdAt: Date.now(),
            isStreaming: true,
          },
        ],
        stream,
      };
    });

    return assistantId;
  },

  appendToMessage: (id, chunk, words) =>
    set((state) => {
      const { stream } = state;
      if (!stream || !stream.isStreaming) return state;

      const nextGenerated = stream.generatedWords + words;
      const messages = state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m,
      );

      return {
        messages,
        stream: {
          ...stream,
          generatedWords: nextGenerated,
        },
      };
    }),

  finishStreaming: () =>
    set((state) => ({
      stream: null,
      messages: state.messages.map((m) =>
        m.isStreaming ? { ...m, isStreaming: false } : m,
      ),
    })),

  stopStreaming: () =>
    set((state) => ({
      stream: null,
      messages: state.messages.map((m) =>
        m.isStreaming ? { ...m, isStreaming: false } : m,
      ),
    })),

  setAutoScroll: (value) => set({ autoScroll: value }),

  hydrateLongHistory: (messages) => set({ messages }),
}));

