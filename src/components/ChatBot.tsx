import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { BUSINESS_PHONE_DISPLAY } from '@/lib/business';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Freelance Plumbing assistant. I can help you figure out which service you need, check if you're in our service area, or guide you to request a quote. What can I help you with?",
};

const SYSTEM_PROMPT = `You are the AI assistant for Freelance Plumbing, a residential and commercial plumbing business in Scarborough, Toronto.

BUSINESS DETAILS:
- Name: Freelance Plumbing
- Phone: 437-245-1556
- Email: dexter125555@gmail.com
- Address: 20 Tuxedo Court, Toronto, ON M1G 3S5
- Service radius: approximately 100 km from Scarborough, Toronto

SERVICES OFFERED:
1. Emergency Plumbing Assistance - Fast response for urgent plumbing problems
2. Drain Cleaning - Clearing slow and blocked drains
3. Clogged Sinks & Toilets - Resolving stubborn clogs
4. Leak Detection & Repair - Locating hidden leaks and repairing them
5. Faucet & Fixture Repair - Repairing and replacing faucets and fixtures
6. Toilet Installation & Repair
7. Pipe Repair & Replacement
8. Water Heater Service - Tank and tankless systems
9. Sump Pump Service
10. Sewer Line Service
11. Kitchen Plumbing
12. Bathroom Plumbing
13. Appliance Plumbing Connections - Dishwashers, washing machines
14. Residential Plumbing
15. Commercial Plumbing
16. Plumbing Inspections
17. General Plumbing Maintenance

GUIDELINES:
- Be friendly, helpful, and professional
- Keep responses concise (2-4 sentences max)
- For emergencies, advise calling 437-245-1556 directly
- For pricing, direct them to request a quote on the website or call for an estimate
- For service area questions, explain they can use the service area checker on the website
- Help users identify which service they need
- Do not make up specific prices or guarantee availability
- If you don't know something, direct them to call 437-245-1556`;

function buildPrompt(messages: ChatMessage[]): string {
  let prompt = `${SYSTEM_PROMPT}\n\n=== CONVERSATION ===\n`;
  for (const msg of messages) {
    prompt += `${msg.role === 'user' ? 'Customer' : 'Assistant'}: ${msg.content}\n`;
  }
  prompt += `Assistant: `;
  return prompt;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const prompt = buildPrompt(newMessages);
      const encodedPrompt = encodeURIComponent(prompt);

      const response = await fetch(
        `https://text.pollinations.ai/${encodedPrompt}?model=openai&referrer=freelance-plumbing.ca`,
        { method: 'GET', headers: { Accept: 'text/plain' } },
      );

      if (!response.ok) throw new Error('Chat request failed');

      const replyText = await response.text();
      let cleanReply = replyText.trim();
      if (cleanReply.startsWith('Assistant:')) {
        cleanReply = cleanReply.slice('Assistant:'.length).trim();
      }

      if (!cleanReply) throw new Error('Empty response');

      setMessages((prev) => [...prev, { role: 'assistant', content: cleanReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I'm having trouble connecting right now. Please call us at ${BUSINESS_PHONE_DISPLAY} and we'll be happy to help.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-card-hover transition-all hover:scale-105 hover:bg-brand-700 active:scale-95 sm:bottom-6"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!isOpen && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-success-500" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-36 right-4 z-50 flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-navy-200 bg-white shadow-card-hover sm:bottom-24">
          <div className="flex items-center gap-3 bg-brand-600 px-4 py-3.5 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Freelance Plumbing Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-white/80">
                <span className="inline-block h-2 w-2 rounded-full bg-success-300" />
                Online now
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="ml-auto rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-navy-50 px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-br-md bg-brand-600 text-white'
                      : 'rounded-bl-md bg-white text-navy-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-navy-500 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Typing…
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-navy-100 bg-white px-3 py-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services…"
              disabled={loading}
              className="flex-1 rounded-full border border-navy-200 px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
