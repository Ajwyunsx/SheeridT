
import React from 'react';
import { InboxMessage } from '../types';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';

interface InboxProps {
  messages: InboxMessage[];
  loading: boolean;
  onRefresh: () => void;
}

const Inbox: React.FC<InboxProps> = ({ messages, loading, onRefresh }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(messages.length > 0 ? messages[0].id : null);
  const selectedMessage = messages.find(m => m.id === selectedId);

  // Update selected if messages change and nothing selected
  React.useEffect(() => {
    if (messages.length > 0 && !selectedId) {
      setSelectedId(messages[0].id);
    }
  }, [messages, selectedId]);

  return (
    <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden flex flex-col h-[600px] animate-fade-in">
      {/* Inbox Toolbar */}
      <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center shadow z-20">
        <div className="flex items-center gap-3 text-white">
            <button className="md:hidden mr-1"><ArrowLeft size={20} /></button>
            <h2 className="font-medium text-lg tracking-wide">收件箱 (Inbox)</h2>
        </div>
        <button 
          onClick={onRefresh} 
          className={`text-white p-2 hover:bg-white/10 rounded-full transition-colors ${loading ? 'animate-spin' : ''}`}
        >
            <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className={`${selectedId ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200 bg-white overflow-y-auto`}>
           {messages.length === 0 ? (
               <div className="p-6 text-center text-gray-400 mt-10">
                   <p className="text-sm">暂无邮件</p>
                   <p className="text-xs mt-2">开始验证流程以接收验证码</p>
               </div>
           ) : (
               messages.map(msg => (
                   <div 
                    key={msg.id}
                    onClick={() => setSelectedId(msg.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === msg.id ? 'bg-blue-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                   >
                       <div className="flex justify-between mb-1">
                           <span className={`text-sm font-bold truncate ${!msg.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{msg.sender}</span>
                           <span className="text-xs text-gray-400">{msg.timestamp}</span>
                       </div>
                       <div className="text-sm font-medium text-gray-800 truncate">{msg.subject}</div>
                       <div className="text-xs text-gray-500 mt-1 truncate opacity-80">{msg.content.replace(/<[^>]*>?/gm, '')}</div>
                   </div>
               ))
           )}
        </div>

        {/* Detail */}
        <div className={`${!selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-2/3 bg-gray-50 flex-col`}>
            {selectedMessage ? (
                <div className="flex-1 overflow-y-auto p-8 bg-white m-4 rounded shadow-sm border border-gray-100">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                        <h1 className="text-xl font-bold text-gray-900 mb-2">{selectedMessage.subject}</h1>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                {selectedMessage.sender[0]}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900">{selectedMessage.sender}</div>
                                <div className="text-xs text-gray-500">收件人: 我</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                        <div dangerouslySetInnerHTML={{__html: selectedMessage.content}} />
                    </div>

                    {selectedMessage.code && (
                        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Verification Code (验证码)</span>
                            <span className="text-4xl font-mono font-bold text-gray-800 tracking-[0.2em] bg-white px-6 py-2 rounded border border-gray-200 shadow-inner">
                                {selectedMessage.code}
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
                    <Mail size={48} className="opacity-20 mb-2" />
                    <p>选择邮件以查看详情</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
