import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, CheckCircle2, MessageSquare, ExternalLink, Menu, X, ArrowRight, ShieldCheck, Calendar, MapPin, ClipboardList, Mic, MicOff, Languages, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { jsPDF } from 'jspdf';
import { COUNTRIES, Country, ElectionInfo, LANGUAGES, UI_STRINGS } from './constants';
import { askElectionAssistant } from './services/geminiService';
import { fetchLiveElectionData } from './services/electionDataService';

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES.find(c => c.id === 'india') || COUNTRIES[0]);
  const [liveDataMap, setLiveDataMap] = useState<Record<string, ElectionInfo>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [checklist, setChecklist] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic voter checklist initialization
    setChecklist([
      { id: '1', text: 'Check registration status', completed: false },
      { id: '2', text: 'Locate nearest polling station', completed: false },
      { id: '3', text: 'Verify valid ID requirements', completed: false },
      { id: '4', text: 'Review sample ballot', completed: false },
    ]);
  }, [selectedCountry]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const currentElectionInfo = liveDataMap[selectedCountry.id] || selectedCountry.electionInfo;
  const t = UI_STRINGS[selectedLanguage.code] || UI_STRINGS.en;

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);

    const aiResponse = await askElectionAssistant(userMsg, { ...selectedCountry, electionInfo: currentElectionInfo }, selectedLanguage.name);
    setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsChatLoading(false);
  };

  const handleSyncData = async () => {
    setIsSyncing(true);
    const liveData = await fetchLiveElectionData(selectedCountry.name);
    if (liveData) {
      setLiveDataMap(prev => ({
        ...prev,
        [selectedCountry.id]: {
          ...selectedCountry.electionInfo,
          nextElection: liveData.nextElection,
          voterRegistrationDeadline: liveData.voterRegistrationDeadline,
          votingMethods: liveData.votingMethods,
        }
      }));
    }
    setIsSyncing(false);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLanguage.code === 'en' ? 'en-US' : 
                      selectedLanguage.code === 'hi' ? 'hi-IN' : 
                      selectedLanguage.code === 'mr' ? 'mr-IN' : 
                      selectedLanguage.code === 'ta' ? 'ta-IN' : 'te-IN';
    recognition.interimResults = true; // Use interim results for better feedback
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      setChatMessage(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const primaryColor = selectedCountry.colors.primary;
    
    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(`Voter Preparation Guide: ${selectedCountry.name}`, 20, 25);
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Next Election: ${currentElectionInfo.nextElection}`, 20, 55);
    doc.text(`Registration Deadline: ${currentElectionInfo.voterRegistrationDeadline}`, 20, 65);
    
    doc.setFontSize(16);
    doc.text('Voting Checklist:', 20, 85);
    doc.setFontSize(12);
    checklist.forEach((item, index) => {
      doc.text(`[ ] ${item.text}`, 25, 95 + (index * 10));
    });
    
    doc.setFontSize(16);
    doc.text('Voting Methods:', 20, 150);
    doc.setFontSize(12);
    currentElectionInfo.votingMethods.forEach((method, index) => {
      doc.text(`• ${method}`, 25, 160 + (index * 10));
    });
    
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Generated by VoterVoice Intelligence Agent', 20, 280);
    
    doc.save(`Voter_Guide_${selectedCountry.id}.pdf`);
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      className="min-h-screen transition-all duration-700 ease-in-out font-sans overflow-x-hidden"
      style={{ 
        backgroundColor: `${selectedCountry.colors.primary}05`,
        '--country-primary': selectedCountry.colors.primary,
        '--country-secondary': selectedCountry.colors.secondary,
        '--country-accent': selectedCountry.colors.accent,
      } as any}
    >
      {/* Dynamic Background Element */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[100px]" style={{ backgroundColor: selectedCountry.colors.primary }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]" style={{ backgroundColor: selectedCountry.colors.secondary }} />
      </div>

      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#002868] text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-4 flex flex-col gap-0.5">
              <div style={{ backgroundColor: selectedCountry.colors.primary }} className="h-1"></div>
              <div className="bg-white h-1"></div>
              <div style={{ backgroundColor: selectedCountry.colors.secondary }} className="h-1"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tighter uppercase whitespace-nowrap">
              VoterVoice <span className="font-light opacity-50 hidden sm:inline">{selectedCountry.id}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className="bg-white/10 px-3 sm:px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors"
            >
              <span className="hidden sm:inline text-[10px] sm:text-xs font-bold uppercase tracking-wider">Switch Region</span>
              <Search className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {isRegionDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
                >
                  <div className="p-2">
                    {COUNTRIES.map(c => (
                      <button 
                        key={c.id}
                        onClick={() => { 
                          setSelectedCountry(c); 
                          setIsRegionDropdownOpen(false); 
                          setChatHistory([]); // Reset chat for new context
                        }}
                        className={`w-full text-left p-4 hover:bg-slate-50 rounded-2xl flex items-center justify-between group transition-colors ${selectedCountry.id === c.id ? 'bg-slate-50' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{c.flag}</span>
                          <span className={`text-sm font-black ${selectedCountry.id === c.id ? 'text-[#002868]' : 'text-slate-600'}`}>
                            {c.name}
                          </span>
                        </div>
                        {selectedCountry.id === c.id && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="w-8 h-8 rounded-full border-2 border-white shadow-inner bg-slate-200 hidden sm:block" />
          
          <button 
            className="md:hidden p-2 rounded-lg bg-white/5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#002868] border-t border-white/10 px-6 py-4 z-40 relative"
          >
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="text-white text-sm font-bold uppercase tracking-widest text-left"
              >
                Timeline
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 lg:py-20 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Hero & Info */}
        <div className="md:col-span-12 lg:col-span-7 space-y-8">
          <section className="theme-card p-6 sm:p-10 accent-stripe-bottom relative overflow-hidden min-h-[300px] sm:min-h-[400px] flex flex-col justify-center">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-slate-50 rounded-full opacity-50 blur-3xl" />
            
            <div className="relative z-10 space-y-6">
              <motion.div 
                key={selectedCountry.id + 'badge'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-block bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              >
                Civic Pulse: {selectedCountry.name}
              </motion.div>

              <motion.h2 
                key={selectedCountry.id + 'title'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#002868] leading-[1.1] tracking-tighter"
              >
                Your friendly <br/>
                <span className="text-slate-300">neighbourhood</span> <br/>
                general election <br/>
                <span style={{ color: selectedCountry.colors.primary }}>non-biased agent.</span>
              </motion.h2>

              <p className="text-slate-500 max-w-md text-lg font-medium leading-snug">
                Helping the citizens of {selectedCountry.name} navigate democracy with ease and accuracy.
              </p>

              <div className="flex gap-4 sm:gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-red-600 leading-none" style={{ color: selectedCountry.colors.primary }}>{t.live}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mt-2">{t.status}</span>
                </div>
                <div className="w-px h-12 bg-slate-100" />
                <div className="flex flex-col">
                   <span className="text-4xl font-black text-[#002868] leading-none">{t.open}</span>
                   <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mt-2">{t.registration}</span>
                </div>
              </div>

              {selectedCountry.languages && (
                <div className="pt-8 flex flex-col gap-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Languages className="w-3 h-3" />
                    {t.preferredLanguage}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.filter(l => selectedCountry.languages?.includes(l.code)).map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedLanguage.code === lang.code ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                      >
                        {lang.native}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="grid sm:grid-cols-2 gap-6 pb-6">
            <section id="timeline-section" className="theme-card p-8 border border-slate-100 flex flex-col gap-6">
              <h3 className="text-lg font-black flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-600 rounded-full" style={{ backgroundColor: selectedCountry.colors.primary }}></span>
                {t.timeline}
              </h3>
              <div className="relative space-y-8 pl-2">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                <div className="relative flex items-center gap-6">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm z-10"></div>
                  <div className="flex-1 p-3 bg-slate-50 rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{t.registration}</p>
                    <p className="text-sm font-black">{currentElectionInfo.voterRegistrationDeadline}</p>
                  </div>
                </div>
                <div className="relative flex items-center gap-6">
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm z-10" style={{ backgroundColor: selectedCountry.colors.secondary }}></div>
                  <div className="flex-1 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">{selectedLanguage.code === 'en' ? 'Election Day' : selectedLanguage.code === 'hi' ? 'चुनाव दिवस' : 'Election Day'}</p>
                    <p className="text-sm font-black text-blue-900">{currentElectionInfo.nextElection}</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-6">
                  <div className="w-4 h-4 mt-2 rounded-full bg-amber-500 border-4 border-white shadow-sm z-10"></div>
                  <div className="flex-1 p-3 bg-amber-50/50 rounded-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-1">Voting Methods</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {currentElectionInfo.votingMethods.map((m, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-tight bg-white px-2 py-0.5 rounded-md border border-amber-100">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSyncData}
                disabled={isSyncing}
                className="w-full mt-2 cursor-pointer bg-white border border-slate-200 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                {isSyncing ? (
                  <span className="animate-pulse">{t.syncing}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    {t.sync}
                  </>
                )}
              </button>
            </section>

            <section className="theme-card p-8 accent-stripe-left">
              <h3 className="text-lg font-black mb-6">{t.checklist}</h3>
              <div className="space-y-4">
                {checklist.map(item => (
                  <button 
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className="flex items-center gap-4 w-full text-left group"
                  >
                    <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${item.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-transparent'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-sm font-bold transition-colors ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
              <button 
                onClick={generatePDF}
                className="w-full mt-10 bg-slate-900 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-colors"
              >
                {t.downloadGuide}
              </button>
            </section>

            {currentElectionInfo.majorCandidates && (
              <section className="sm:col-span-2 theme-card p-8 bg-slate-50 shadow-inner">
                <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {t.candidates}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {currentElectionInfo.majorCandidates.map((c, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{c.party}</span>
                      </div>
                      <h4 className="font-black text-slate-800 text-lg mb-2">{c.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.description}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest italic">
                  {t.neutralNote}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Right Column: AI Chatbot */}
        <aside className="md:col-span-12 lg:col-span-5 space-y-8">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-[#15171e] text-white rounded-[40px] p-4 sm:p-6 shadow-2xl flex flex-col h-[500px] sm:h-[600px] lg:h-[700px] border border-white/5">
              <div className="flex items-center gap-3 mb-6 p-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-black text-xs shadow-lg">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-tighter">Voter Assistant</h4>
                  <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Election Intel Engine</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scroll-hide py-4">
                {chatHistory.length === 0 && (
                  <div className="space-y-6 text-center py-20 opacity-30">
                    <MessageSquare className="w-12 h-12 mx-auto" />
                    <p className="text-xs font-mono uppercase tracking-[0.2em]">{t.askMe} {selectedCountry.name}</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5 text-sm leading-snug markdown-body'}`}>
                      {msg.role === 'ai' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-thick italic text-xs animate-pulse text-slate-400">
                      Syncing with election databases...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 space-y-4 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {['Register?', 'ID Required?', 'Poll Hours?'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setChatMessage(tag)}
                      className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-slate-400 transition-colors border border-white/5"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center gap-2 bg-white/10 rounded-2xl p-1 pr-2">
                  <input 
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={t.typeQuestion}
                    className="flex-1 bg-transparent py-4 px-5 text-sm focus:outline-none placeholder:text-slate-600"
                  />
                  <button 
                    onClick={handleVoiceInput}
                    className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-slate-400" />}
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!chatMessage.trim() || isChatLoading}
                    className="bg-blue-600 p-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-30"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Official Links */}
            <div className="theme-card p-6 sm:p-8 accent-stripe-left space-y-4">
              <h4 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Official Sources
              </h4>
              <div className="flex flex-col gap-2">
                {currentElectionInfo.importantLinks.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-slate-50 flex items-center justify-between text-xs font-bold hover:translate-x-2 transition-transform shadow-sm"
                  >
                    {link.label}
                    <ArrowRight className="w-4 h-4 opacity-30" />
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-mono">Powered by Google Gemini 3.0</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 mt-20 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h5 className="font-bold">VoterVoice</h5>
              <p className="text-sm text-[#888]">Non-partisan election data and AI assistance.</p>
            </div>
          <div className="flex gap-8 text-xs font-mono uppercase tracking-widest text-[#888]">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Terms</a>
            <a href="#" className="hover:text-black transition-colors">Contact</a>
          </div>
          <p className="text-xs text-[#888]">© 2026 VoterVoice Intelligence Project</p>
        </div>
      </footer>
    </div>
  );
}

