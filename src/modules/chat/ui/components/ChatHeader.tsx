interface ChatHeaderProps {
  isStreaming: boolean;
  autoScroll: boolean;
  onToggleAutoScroll: (value: boolean) => void;
}

export function ChatHeader({
  isStreaming,
  autoScroll,
  onToggleAutoScroll,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
      <div>
        <h1 className="text-sm font-semibold tracking-wide text-slate-50">
          High-Performance AI Chat Interface Test Task
        </h1>
        <p className="text-xs text-slate-400">
          Streaming 10k+ tokens with efficient rendering
        </p>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-slate-400">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
            isStreaming
              ? 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40'
              : 'bg-slate-800 text-slate-400 ring-1 ring-slate-700/80'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {isStreaming ? 'Generating...' : 'Idle'}
        </span>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => onToggleAutoScroll(e.target.checked)}
            className="h-3 w-3 rounded border-slate-700 bg-slate-900 text-emerald-500"
          />
          <span>Auto-scroll</span>
        </label>
      </div>
    </header>
  );
}

