interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onGenerate: () => void;
  onStop: () => void;
  isStreaming: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onGenerate,
  onStop,
  isStreaming,
}: ChatInputProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="border-t border-slate-800 bg-gradient-to-t from-slate-900/80 via-slate-950/90 to-slate-950 px-4 py-3"
    >
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Ask the model anything... "
          className="max-h-40 min-h-[40px] flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 shadow-sm outline-none ring-2 ring-transparent transition focus:border-sky-500 focus:ring-sky-500/40"
        />
        <div className="flex flex-col gap-1">
          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-3 py-1.5 text-xs font-semibold text-sky-50 shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!value.trim()}
          >
            Send
          </button>
          <button
            type="button"
            onClick={isStreaming ? onStop : onGenerate}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
              isStreaming
                ? 'bg-rose-500 text-rose-50 hover:bg-rose-400'
                : 'bg-emerald-600 text-emerald-50 hover:bg-emerald-500'
            }`}
          >
            {isStreaming ? 'Stop Generating' : 'Generate 10k words'}
          </button>
        </div>
      </div>
    </form>
  );
}

