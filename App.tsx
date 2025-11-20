
import React, { useState, useCallback } from 'react';
import { StudentProfile, Region, InboxMessage, AppState, LogEntry, RegionDisplay } from './types';
import * as GeminiService from './services/geminiService';
import IdentityCard from './components/IdentityCard';
import Inbox from './components/Inbox';
import LogPanel from './components/LogPanel';
import VisualProofs from './components/VisualProofs';
import { Globe, ShieldCheck, User, Mail, Sparkles, CheckCircle, Image as ImageIcon, Loader2, Link as LinkIcon, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [selectedRegion, setSelectedRegion] = useState<Region>(Region.USA);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'identity' | 'proofs' | 'inbox'>('identity');
  const [sheerIdUrl, setSheerIdUrl] = useState('');

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  };

  const runAutoVerification = useCallback(async () => {
    if (!sheerIdUrl.trim()) {
        addLog("错误: 请先输入 SheerID 验证链接", 'error');
        return;
    }

    setAppState(AppState.PROCESSING);
    setLogs([]);
    setProfile(null);
    setMessages([]);
    
    addLog("初始化自动验证引擎 (Engine v2.5)...", 'info');
    
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    // 1. Analyze Link
    await delay(800);
    addLog(`检测到验证链接: ${sheerIdUrl.substring(0, 30)}...`, 'info');
    addLog(`正在解析目标服务...`, 'info');
    await delay(800);
    
    const serviceName = sheerIdUrl.toLowerCase().includes('spotify') ? 'Spotify' 
                     : sheerIdUrl.toLowerCase().includes('youtube') ? 'YouTube Premium'
                     : sheerIdUrl.toLowerCase().includes('music') ? 'Apple Music'
                     : 'SheerID Generic Service';
    
    addLog(`目标服务识别: ${serviceName}`, 'success');
    addLog(`匹配最佳身份策略: 海外大学生 (18岁/大一新生/Freshman) - 区域: ${selectedRegion}`, 'warning');

    try {
      // 2. Generate Profile
      addLog("正在请求 AI 生成合规身份数据 (Text)...", 'info');
      const newProfile = await GeminiService.generateStudentProfile(selectedRegion);
      setProfile(newProfile);
      addLog(`身份生成成功: ${newProfile.firstName} ${newProfile.lastName} (${newProfile.universityName})`, 'success');
      
      // 3. Start Asset Generation (Async) but don't block UI update too long
      addLog("正在合成视觉凭证 (ID Photo, Campus)...", 'info');
      setActiveTab('identity');
      
      const assets = await GeminiService.generateStudentAssets(newProfile);
      const fullProfile = { ...newProfile, avatarUrl: assets.avatar, campusUrl: assets.campus };
      setProfile(fullProfile);
      addLog("视觉凭证合成完毕", 'success');

      // 4. Simulate Submission
      setActiveTab('proofs');
      addLog("正在向 SheerID 提交表单数据...", 'info');
      await delay(1000);
      
      addLog("上传凭证中 (ID_Front.jpg, Admission.pdf)...", 'info');
      await delay(1200);
      
      addLog("SheerID: 正在验证学术数据库...", 'warning');
      await delay(1500);
      
      addLog("SheerID: 匹配成功 (Status: Active)", 'success');
      
      // 5. Email Simulation
      setActiveTab('inbox');
      addLog("正在拦截验证邮件...", 'info');
      
      const emailData = await GeminiService.generateVerificationEmail(fullProfile);
      const newMessage: InboxMessage = {
        id: Date.now().toString(),
        sender: "SheerID Verification",
        subject: emailData.subject,
        content: emailData.body.replace(/\n/g, '<br>'),
        timestamp: new Date().toLocaleTimeString(),
        isRead: false,
        code: emailData.code
      };
      setMessages([newMessage]);
      addLog(`邮件拦截成功! 验证码: ${newMessage.code}`, 'success');
      
      setAppState(AppState.COMPLETED);

    } catch (error) {
      addLog("流程异常: " + error, 'error');
      setAppState(AppState.IDLE);
    }
  }, [sheerIdUrl, selectedRegion]);

  return (
    <div className="min-h-screen bg-white text-[#333] font-sans pb-12">
      
      {/* MDUI App Bar */}
      <header className="bg-[#3F51B5] text-white elevation-z4 sticky top-0 z-50 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-full text-white shadow-sm">
                <ShieldCheck size={24} />
            </div>
            <h1 className="text-xl font-medium tracking-wide">SheerID <span className="font-light opacity-80">AutoVerifier Pro</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium opacity-90">
            <span className="bg-[#303F9F] px-4 py-1.5 rounded shadow text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Globe size={14} /> 海外大学生认证
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel: Config & Logs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Control Card */}
          <div className="bg-white rounded-lg elevation-z2 p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-[#3F51B5]">
                <Zap className="text-[#3F51B5]" size={20} />
                <h2 className="font-bold text-sm uppercase tracking-wider">自动验证配置 (Auto Config)</h2>
            </div>

            <div className="space-y-6">
                {/* URL Input */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SheerID 验证链接 (URL)</label>
                    <div className="flex items-center border-b-2 border-gray-200 hover:border-[#3F51B5] transition-colors">
                         <LinkIcon size={18} className="text-gray-400 mr-2" />
                         <input 
                            type="text" 
                            placeholder="https://services.sheerid.com/..."
                            value={sheerIdUrl}
                            onChange={(e) => setSheerIdUrl(e.target.value)}
                            disabled={appState === AppState.PROCESSING}
                            className="w-full py-2 bg-transparent focus:outline-none text-sm font-medium text-gray-800"
                         />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">粘贴需要验证的活动链接 (如 Spotify/YouTube 学生优惠)</p>
                </div>

                {/* Region Select */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">目标区域 (Target Region)</label>
                    <select 
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value as Region)}
                        disabled={appState === AppState.PROCESSING}
                        className="w-full border-b-2 border-gray-200 py-2 text-sm bg-transparent hover:border-[#3F51B5] focus:border-[#3F51B5] focus:outline-none transition-colors cursor-pointer font-medium text-gray-800"
                    >
                        {Object.values(Region).map(r => <option key={r} value={r}>{RegionDisplay[r]}</option>)}
                    </select>
                </div>

                <button
                    onClick={runAutoVerification}
                    disabled={appState === AppState.PROCESSING}
                    className={`mdui-ripple w-full py-3 rounded shadow-md uppercase text-sm font-bold tracking-wider flex items-center justify-center gap-2 transition-all duration-300
                        ${appState === AppState.PROCESSING
                            ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed' 
                            : 'bg-[#3F51B5] text-white hover:bg-[#303F9F] hover:shadow-lg active:scale-[0.98]'}
                    `}
                >
                    {appState === AppState.PROCESSING ? (
                        <><Loader2 size={18} className="animate-spin" /> 处理中 (Processing)...</>
                    ) : appState === AppState.COMPLETED ? (
                        <><CheckCircle size={18} /> 验证完成 (重新开始)</>
                    ) : (
                        <><Sparkles size={18} /> 一键自动验证 (Auto Verify)</>
                    )}
                </button>
            </div>
          </div>

          {/* Logs */}
          <LogPanel logs={logs} />
        </div>

        {/* Right Panel: Content Tabs */}
        <div className="lg:col-span-8">
            
            {/* Material Tabs */}
            <div className="bg-white rounded-t-lg elevation-z2 mb-1 flex overflow-x-auto border border-gray-100 border-b-0">
                <button 
                    onClick={() => setActiveTab('identity')}
                    className={`mdui-ripple flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center justify-center gap-2 min-w-[140px]
                        ${activeTab === 'identity' ? 'border-[#3F51B5] text-[#3F51B5] bg-indigo-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}
                    `}
                >
                    <User size={18} /> 身份信息 (Identity)
                </button>
                <button 
                    onClick={() => setActiveTab('proofs')}
                    className={`mdui-ripple flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center justify-center gap-2 min-w-[140px]
                        ${activeTab === 'proofs' ? 'border-[#3F51B5] text-[#3F51B5] bg-indigo-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}
                    `}
                >
                    <ImageIcon size={18} /> 视觉凭证 (Proofs)
                </button>
                <button 
                    onClick={() => setActiveTab('inbox')}
                    className={`mdui-ripple flex-1 py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center justify-center gap-2 min-w-[140px]
                        ${activeTab === 'inbox' ? 'border-[#3F51B5] text-[#3F51B5] bg-indigo-50/30' : 'border-transparent text-gray-500 hover:bg-gray-50'}
                    `}
                >
                    <Mail size={18} /> 收件箱 (Inbox)
                    {messages.length > 0 && <span className="bg-[#FF4081] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center ml-2 shadow-sm">1</span>}
                </button>
            </div>

            {/* Tab Content Area */}
            <div className="bg-white rounded-b-lg elevation-z2 min-h-[600px] p-6 border border-gray-100 border-t-0">
                {!profile ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center mt-20">
                        <div className="bg-gray-50 p-8 rounded-full mb-6 shadow-inner">
                            <Zap size={64} className="text-indigo-200" />
                        </div>
                        <p className="text-2xl font-light text-gray-600">系统就绪 (System Ready)</p>
                        <p className="text-sm mt-3 max-w-md text-gray-400">在左侧输入 SheerID 链接并点击自动验证，系统将自动生成18岁海外大学生身份并完成模拟验证。</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'identity' && (
                            <div className="animate-fade-in">
                                <IdentityCard profile={profile} />
                            </div>
                        )}

                        {activeTab === 'proofs' && (
                            <VisualProofs profile={profile} />
                        )}

                        {activeTab === 'inbox' && (
                            <Inbox 
                                messages={messages}
                                loading={appState === AppState.PROCESSING}
                                onRefresh={() => {}}
                            />
                        )}
                    </>
                )}
            </div>

        </div>
      </main>
    </div>
  );
};

export default App;
