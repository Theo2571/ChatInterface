import { type FormEvent, useState } from 'react';
import { useChatStore } from '../model/chatStore';
import { startHighSpeedStreaming, stopHighSpeedStreaming } from '../services/streamingGenerator';
import { useChatAutoScroll } from './hooks/useChatAutoScroll';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';

export function ChatPage() {
  const messages = useChatStore((s) => s.messages);
  const isStreaming = useChatStore((s) => !!s.stream?.isStreaming);
  const [input, setInput] = useState('');
  const { scrollRef, visibleMessages, handleScroll, autoScroll, setAutoScroll } =
    useChatAutoScroll(messages);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    useChatStore.getState().addUserMessage(trimmed);
    setInput('');
    setAutoScroll(true);

    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      el.scrollTop = el.scrollHeight;
    });
  };

  const handleGenerate = () => {
    startHighSpeedStreaming(10_000);
  };

  const handleStop = () => {
    stopHighSpeedStreaming();
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-50">
      <ChatHeader
        isStreaming={isStreaming}
        autoScroll={autoScroll}
        onToggleAutoScroll={setAutoScroll}
      />

      <MessageList
        messages={visibleMessages}
        scrollRef={scrollRef}
        onScroll={handleScroll}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={() => handleSubmit()}
        onGenerate={handleGenerate}
        onStop={handleStop}
        isStreaming={isStreaming}
      />
    </div>
  );
}

