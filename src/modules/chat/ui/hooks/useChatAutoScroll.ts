import {
    type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { ChatMessage } from '../../model/chatTypes';
import { useChatStore } from '../../model/chatStore';

interface UseChatAutoScrollResult {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  visibleMessages: ChatMessage[];
  handleScroll: (e: UIEvent<HTMLDivElement>) => void;
  autoScroll: boolean;
  setAutoScroll: (value: boolean) => void;
}

export function useChatAutoScroll(
  messages: ChatMessage[],
  maxMessages = 200,
): UseChatAutoScrollResult {
  const autoScroll = useChatStore((s) => s.autoScroll);
  const setAutoScroll = useChatStore((s) => s.setAutoScroll);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const userScrolledUpRef = useRef(false);

  const visibleMessages = useMemo(() => {
    if (messages.length <= maxMessages) return messages;
    return messages.slice(messages.length - maxMessages);
  }, [messages, maxMessages]);

  const lastMessageContent = useMemo(
    () => (messages.length ? messages[messages.length - 1]?.content ?? '' : ''),
    [messages],
  );

  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollTop = el.scrollHeight;
  }, [lastMessageContent, autoScroll]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 16;

      if (!atBottom) {
        userScrolledUpRef.current = true;
        if (autoScroll) setAutoScroll(false);
      } else {
        userScrolledUpRef.current = false;
        if (!autoScroll) setAutoScroll(true);
      }
    },
    [autoScroll, setAutoScroll],
  );

  return {
    scrollRef,
    visibleMessages,
    handleScroll,
    autoScroll,
    setAutoScroll,
  };
}

