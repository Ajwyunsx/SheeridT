
import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, Activity } from 'lucide-react';

interface LogPanelProps {
  logs: LogEntry[];
}

const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-white rounded shadow-md border border-gray-200 flex flex-col h-96 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700">
            <Terminal size={16} />
            <span className="font-bold text-xs uppercase tracking-wider">系统日志 (System Logs)</span>
        </div>
        <Activity size={14} className="text-green-500 animate-pulse" />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 bg-[#FAFAFA]">
        {logs.length === 0 && (
            <div className="text-gray-400 italic text-center mt-10">等待输入验证链接...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-fade-in">
            <span className="text-gray-400 shrink-0 select-none">[{log.timestamp}]</span>
            <span className={`break-all ${
              log.type === 'error' ? 'text-red-600 font-bold' :
              log.type === 'success' ? 'text-green-700 font-bold' :
              log.type === 'warning' ? 'text-orange-600' :
              'text-gray-700'
            }`}>
              {log.type === 'info' && <span className="text-blue-500 mr-1">ℹ</span>}
              {log.type === 'success' && <span className="text-green-500 mr-1">✔</span>}
              {log.type === 'warning' && <span className="text-orange-500 mr-1">⚠</span>}
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default LogPanel;
