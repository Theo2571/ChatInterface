import type {UIEvent} from 'react';
import type { ChatMessage } from '../../model/chatTypes';
import { MessageItem } from './MessageItem';

interface MessageListProps {
  messages: ChatMessage[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
}

export function MessageList({
  messages,
  scrollRef,
  onScroll,
}: MessageListProps) {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
        onScroll={onScroll}
      >
        {messages.map((m) => (
          <MessageItem key={m.id} message={m} />
        ))}
      </div>
    </main>
  );
}

