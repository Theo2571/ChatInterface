import {type JSX, memo, useMemo} from 'react';
import type { ChatMessage } from '../../model/chatTypes';

interface Props {
  message: ChatMessage;
}

function parseMarkdown(text: string): JSX.Element[] {
  const elements: JSX.Element[] = [];
  if (!text) return elements;

  const segments = text.split(/```/g);

  segments.forEach((segment, index) => {
    if (index % 2 === 1) {
      elements.push(
        <pre
          key={`code-${index}`}
          className="my-2 overflow-auto rounded-md bg-slate-900 p-3 text-xs leading-relaxed"
        >
          <code>{segment}</code>
        </pre>,
      );
      return;
    }

    if (!segment) return;

    const parts = segment.split(/(\*\*[^*]+\*\*)/g);

    elements.push(
      <span key={`text-${index}`} className="whitespace-pre-wrap break-words">
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return (
              <strong key={i} className="font-semibold text-slate-100">
                {content}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>,
    );
  });

  return elements;
}

export const MarkdownMessage = memo(function MarkdownMessage({ message }: Props) {
  const content = message.content;

  const parsed = useMemo(() => parseMarkdown(content), [content]);

  return <div className="text-sm leading-relaxed">{parsed}</div>;
});

