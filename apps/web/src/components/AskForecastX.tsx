import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Image as ImageIcon, Sparkles, ExternalLink, Bot, User, CheckCircle2, Loader2, Volume2 } from 'lucide-react';
import { streamChatMessage } from '@/services/api';
import { SourceCitation } from '@/types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  stage?: string;
  isStreaming?: boolean;
  sources?: SourceCitation[];
  timestamp: string;
}

interface AskForecastXProps {
  currentLanguage?: string;
  initialQuery?: string;
}

export const AskForecastX: React.FC<AskForecastXProps> = ({ currentLanguage = 'en', initialQuery }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "Hello! I'm ForecastX. Ask me anything about the weather, warnings, travel conditions, farming advisories or climate information. I use official data from IMD, ISRO, WMO and other trusted sources.",
      timestamp: '10:30 AM',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStage]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const suggestedQuestions = [
    'Will it rain in Kanpur tomorrow?',
    'Is there any cyclone threat to Odisha?',
    'Show me the weather along Delhi to Jaipur route',
    'Give agricultural advisory for Punjab',
    "Explain today's weather in simple terms",
  ];

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || isProcessing) return;

    setInputQuery('');
    const userMsgId = `usr-${Date.now()}`;
    const assistantMsgId = `ast-${Date.now()}`;

    const newMessages: Message[] = [
      ...messages,
      {
        id: userMsgId,
        sender: 'user',
        text: q,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: assistantMsgId,
        sender: 'assistant',
        text: '',
        isStreaming: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];

    setMessages(newMessages);
    setIsProcessing(true);
    setCurrentStage('Understanding location & intent...');

    // Trigger SSE streaming pipeline
    streamChatMessage(q, currentLanguage, {
      onStage: (stageText) => {
        setCurrentStage(stageText);
      },
      onToken: (token) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, text: msg.text + token }
              : msg
          )
        );
      },
      onComplete: (data) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: data.response,
                  sources: data.sources,
                  isStreaming: false,
                }
              : msg
          )
        );
        setIsProcessing(false);
        setCurrentStage(null);
      },
      onError: (err) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: 'An authoritative response could not be retrieved at this moment. Please check your network connection.',
                  isStreaming: false,
                }
              : msg
          )
        );
        setIsProcessing(false);
        setCurrentStage(null);
      },
    });
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is supported directly in modern browsers (Chrome/Edge).');
      return;
    }

    try {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;

      setIsListening(true);
      recognition.start();

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-[520px] flex flex-col justify-between overflow-hidden">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/40 to-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-[#0f2942]">Ask ForecastX</h3>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 text-blue-700 tracking-wider">
                Beta
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Your AI assistant for trusted weather information
            </p>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
                <div
                  className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm font-medium'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {m.text}

                  {m.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-600 animate-pulse rounded-sm" />
                  )}
                </div>

                {/* Text to speech button for assistant */}
                {!isUser && m.text && !m.isStreaming && (
                  <button
                    onClick={() => handleSpeak(m.text)}
                    className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen</span>
                  </button>
                )}

                {/* Source Citations Pill Container */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-900">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>Authoritative Sources</span>
                    </div>
                    <div className="space-y-1">
                      {m.sources.map((src, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[10px] text-slate-600 bg-white/80 px-2 py-1 rounded-lg border border-blue-100/60"
                        >
                          <div className="flex items-center gap-1.5 font-medium truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="font-semibold text-slate-800">{src.name}</span>
                            <span className="text-slate-400">({src.issued_at})</span>
                          </div>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-0.5 ml-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Pipeline Stage Processing Badge */}
        {currentStage && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/90 border border-blue-200 text-blue-700 rounded-xl text-[11px] font-medium w-fit animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>{currentStage}</span>
          </div>
        )}

        {/* Suggested Chips when chat is fresh */}
        {messages.length <= 2 && (
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 mb-2">Try asking:</p>
            <div className="space-y-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-xl text-slate-700 font-medium transition-all text-[11px]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Action Bar */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Type your question...'}
            disabled={isProcessing}
            className="w-full pl-3.5 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-inner"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={handleVoiceInput}
              title="Voice Query"
              className={`p-1.5 rounded-lg transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1 font-medium">
          <button
            type="button"
            onClick={handleVoiceInput}
            className="flex items-center gap-1 hover:text-slate-600"
          >
            <Mic className="w-3 h-3 text-blue-500" />
            <span>Voice</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Radar / Satellite image upload is enabled for Doppler analysis.')}
            className="flex items-center gap-1 hover:text-slate-600"
          >
            <ImageIcon className="w-3 h-3 text-slate-400" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
