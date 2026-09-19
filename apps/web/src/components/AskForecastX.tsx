import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Sparkles,
  ExternalLink,
  Bot,
  User,
  CheckCircle2,
  Loader2,
  Volume2,
  ShieldAlert,
  AlertCircle,
  ArrowRight,
  Info,
  Share2
} from 'lucide-react';
import { streamChatMessage } from '@/services/api';
import { SourceCitation } from '@/types';
import { BriefingModal } from '@/components/BriefingModal';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  stage?: string;
  isStreaming?: boolean;
  riskLevel?: string;
  advisory?: string;
  action?: string;
  sources?: SourceCitation[];
  suggestedFollowups?: string[];
  timestamp: string;
}

interface AskForecastXProps {
  currentLanguage?: string;
  initialQuery?: string;
}

export const AskForecastX: React.FC<AskForecastXProps> = ({ currentLanguage = 'en', initialQuery }) => {
  const [sessionId] = useState<string>(() => `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  const [briefingLocation, setBriefingLocation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: "Hello! I am ForecastX, your Meteorological Intelligence Assistant. Ask me about live weather conditions, forecasts, storm hazards, route corridors, or farming advisories. Every response is grounded in authoritative IMD and ECMWF data.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const [followupSuggestions, setFollowupSuggestions] = useState<string[]>([
    'Will it rain in Kanpur tomorrow?',
    'What about the evening?',
    'When should I leave for Jaipur from Delhi?',
    'Can I spray pesticide on wheat tomorrow in Karnal?',
    'Is tomorrow good for an outdoor wedding in Delhi?',
    'कल कानपुर में बारिश होगी क्या?',
  ]);

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

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || isProcessing) return;

    setInputQuery('');
    setVoiceError(null);
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
    setCurrentStage('Analyzing query & conversational memory...');

    // Trigger SSE streaming pipeline with active sessionId
    streamChatMessage(q, currentLanguage, sessionId, {
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
                  riskLevel: data.riskLevel,
                  advisory: data.advisory,
                  action: data.action,
                  sources: data.sources,
                  suggestedFollowups: data.suggestedFollowups,
                  isStreaming: false,
                }
              : msg
          )
        );
        if (data.suggestedFollowups && data.suggestedFollowups.length > 0) {
          setFollowupSuggestions(data.suggestedFollowups);
        }
        setIsProcessing(false);
        setCurrentStage(null);
      },
      onError: () => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text: 'An authoritative meteorological response could not be retrieved at this moment. Please verify your connection or retry.',
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
    setVoiceError(null);
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is supported in Chrome, Edge, and modern mobile browsers.');
      return;
    }

    try {
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

      recognition.onerror = (e: any) => {
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else {
          setVoiceError('Could not capture audio clearly. Please try speaking again.');
        }
      };

      recognition.onend = () => setIsListening(false);
    } catch (e) {
      setIsListening(false);
      setVoiceError('Failed to initialize voice interface.');
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Clean markdown tags for natural speech
      const cleanText = text.replace(/[•#*`~_]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getRiskBadge = (risk?: string) => {
    if (!risk) return null;
    const r = risk.toUpperCase();
    if (r === 'SEVERE') {
      return (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-extrabold shadow-xs">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SEVERE RISK</span>
        </div>
      );
    }
    if (r === 'HIGH') {
      return (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          <span>HIGH RISK</span>
        </div>
      );
    }
    if (r === 'MODERATE') {
      return (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>MODERATE RISK</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>LOW RISK</span>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-[560px] flex flex-col justify-between overflow-hidden transition-colors">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-extrabold text-[#0f2942] dark:text-slate-100">Ask ForecastX</h3>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 tracking-wider">
                Grounded AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Multi-turn conversational weather intelligence
            </p>
          </div>
        </div>

        {/* Memory status indicator */}
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Memory Active</span>
        </div>
      </div>

      {/* Voice error banner */}
      {voiceError && (
        <div className="px-3 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
          <span>{voiceError}</span>
          <button onClick={() => setVoiceError(null)} className="font-bold underline ml-2">Dismiss</button>
        </div>
      )}

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
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[88%] ${isUser ? 'order-1' : 'order-2'}`}>
                <div
                  className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  {/* Risk Badge on Assistant message if present */}
                  {!isUser && m.riskLevel && (
                    <div className="mb-2.5 flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      {getRiskBadge(m.riskLevel)}
                      <span className="text-[10px] text-slate-400 font-semibold">Grounded Calculation</span>
                    </div>
                  )}

                  {m.text}

                  {m.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-600 animate-pulse rounded-sm" />
                  )}
                </div>

                {/* Text to speech button for assistant */}
                {!isUser && m.text && !m.isStreaming && (
                  <button
                    onClick={() => handleSpeak(m.text)}
                    className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen aloud</span>
                  </button>
                )}

                {/* Source Citations Pill Container */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2.5 p-2.5 bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-900 dark:text-blue-300">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>Authoritative Meteorological Verification</span>
                    </div>
                    <div className="space-y-1">
                      {m.sources.map((src, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 px-2 py-1 rounded-lg border border-blue-100/60 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-1.5 font-medium truncate">
                            <span className={`w-1.5 h-1.5 rounded-full ${src.status === 'Live' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{src.name}</span>
                            <span className="text-slate-400">({src.issued_at})</span>
                            <span className={`px-1 py-0.2 rounded text-[8px] font-extrabold ${src.status === 'Live' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'}`}>
                              {src.status}
                            </span>
                          </div>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 ml-1"
                            >
                              <span>Official Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action row: Export Briefing & TTS */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const match = m.text.match(/\b(Kanpur|Delhi|Jaipur|Mumbai|Kolkata|Chennai|Bengaluru|Lucknow|Karnal|Ludhiana|Patna)\b/i);
                        setBriefingLocation(match ? match[0] : 'Kanpur');
                      }}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Share2 className="w-3 h-3 text-blue-600" />
                      <span>Export Decision Briefing (PDF/WhatsApp)</span>
                    </button>
                    <button
                      onClick={() => handleSpeak(m.text)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
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
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-[11px] font-medium w-fit animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>{currentStage}</span>
          </div>
        )}

        {/* Dynamic Suggested Follow-ups */}
        {!isProcessing && followupSuggestions.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
              <ArrowRight className="w-2.5 h-2.5 text-blue-500" />
              <span>Contextual Follow-ups:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {followupSuggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="text-left px-2.5 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 rounded-lg text-slate-700 dark:text-slate-200 font-medium transition-all text-[11px]"
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
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
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
            placeholder={isListening ? 'Listening in ' + (currentLanguage === 'hi' ? 'Hindi...' : 'English...') : (currentLanguage === 'hi' ? 'मौसम के बारे में कोई भी प्रश्न पूछें...' : 'Ask about rain, routes, temperature, or travel safety...')}
            disabled={isProcessing}
            className="w-full pl-3.5 pr-20 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-inner"
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            <button
              type="button"
              onClick={handleVoiceInput}
              title="Voice Input (STT)"
              className={`p-1.5 rounded-lg transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="p-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 px-1 font-medium">
          <div className="flex items-center gap-1">
            <Info className="w-3 h-3 text-blue-500" />
            <span>Zero hallucination: grounded in IMD & ECMWF feeds</span>
          </div>
          <span className="text-[9px] text-slate-400">English & हिंदी</span>
        </div>
      </div>

      {/* 1-Click Briefing Export Modal */}
      {briefingLocation && (
        <BriefingModal
          locationName={briefingLocation}
          isOpen={!!briefingLocation}
          onClose={() => setBriefingLocation(null)}
        />
      )}
    </div>
  );
};
