import { memo } from 'react';
import type { ChatMessage } from '../../model/chatTypes';
import { MarkdownMessage } from './MarkdownMessage';

interface Props {
  message: ChatMessage;
}

export const MessageItem = memo(function MessageItem({ message }: Props) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex w-full px-4 py-3 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 text-sm shadow-sm ${
          isAssistant
            ? 'bg-slate-900/70 text-slate-50 ring-1 ring-slate-700/60'
            : 'bg-sky-600 text-sky-50'
        }`}
      >
        <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
          {isAssistant ? 'Assistant' : 'You'}
        </div>
        <MarkdownMessage message={message} />
        {message.isStreaming && (
          <span className="mt-1 inline-flex h-3 w-3 animate-pulse rounded-full bg-emerald-400/80" />
        )}
      </div>
    </div>
  );
});

