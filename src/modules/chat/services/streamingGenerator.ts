import { useChatStore } from '../model/chatStore';

const LOREM_WORDS =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';

const WORD_POOL = LOREM_WORDS.split(' ');

function pickWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const idx = Math.floor(Math.random() * WORD_POOL.length);
    words.push(WORD_POOL[idx]);
  }
  return words;
}

let activeTimer: number | null = null;
let activeMessageId: string | null = null;

export function startHighSpeedStreaming(targetWords = 10_000) {
  const store = useChatStore.getState();

  if (store.stream?.isStreaming) {
    return;
  }

  const messageId = store.startStreamingResponse(targetWords);
  if (!messageId) return;

  activeMessageId = messageId;

  const tick = () => {
    const { stream } = useChatStore.getState();
    if (!stream || !stream.isStreaming || !activeMessageId) {
      if (activeTimer !== null) {
        window.clearInterval(activeTimer);
        activeTimer = null;
      }
      useChatStore.getState().finishStreaming();
      return;
    }

    if (stream.generatedWords >= stream.targetWordCount) {
      useChatStore.getState().finishStreaming();
      if (activeTimer !== null) {
        window.clearInterval(activeTimer);
        activeTimer = null;
      }
      return;
    }

    const chunkSize = 8 + Math.floor(Math.random() * 8);
    const remaining = stream.targetWordCount - stream.generatedWords;
    const wordsToGenerate = Math.min(chunkSize, remaining);
    const words = pickWords(wordsToGenerate);

    const textChunk = `${words.join(' ')} `;

    useChatStore
      .getState()
      .appendToMessage(activeMessageId, textChunk, wordsToGenerate);
  };

  if (activeTimer !== null) {
    window.clearInterval(activeTimer);
  }

  activeTimer = window.setInterval(tick, 16);
}

export function stopHighSpeedStreaming() {
  if (activeTimer !== null) {
    window.clearInterval(activeTimer);
    activeTimer = null;
  }
  activeMessageId = null;
  useChatStore.getState().stopStreaming();
}

