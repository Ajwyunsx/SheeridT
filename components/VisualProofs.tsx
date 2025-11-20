
import React from 'react';
import { StudentProfile } from '../types';
import { QrCode, School, User, Download } from 'lucide-react';

interface VisualProofsProps {
  profile: StudentProfile;
}

const VisualProofs: React.FC<VisualProofsProps> = ({ profile }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-8">
      
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
        <div className="h-10 w-1 bg-[#3F51B5]"></div>
        <div>
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">生成凭证 (Proofs)</h3>
            <p className="text-xs text-gray-500 mt-1">请保存以下图片以备 SheerID 人工审核（如需要）。</p>
        </div>
      </div>

      {/* 1. Student ID Card (Simulated Physical Card) */}
      <div className="relative group perspective-1000 max-w-lg mx-auto">
         <div className="flex justify-between items-center mb-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">凭证 1: 实体学生卡 (ID Card)</div>
            <button className="text-[#3F51B5] hover:bg-indigo-50 p-1 rounded transition-colors">
                <Download size={16} />
            </button>
         </div>
         
         <div className="w-full bg-white rounded-xl elevation-z8 overflow-hidden border border-gray-200 relative aspect-[1.586/1]">
            {/* Card Background Design */}
            <div className="absolute top-0 left-0 w-full h-28 bg-[#303F9F]"></div>
            <div className="absolute top-20 -left-10 w-48 h-48 bg-[#3F51B5] rounded-full mix-blend-overlay filter blur-2xl opacity-50"></div>
            
            {/* Card Content */}
            <div className="relative z-10 p-6 flex flex-col h-full text-gray-800">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="text-white">
                        <h2 className="font-bold text-lg leading-tight tracking-wide uppercase drop-shadow-md">{profile.universityName}</h2>
                        <p className="text-[9px] font-light opacity-90 tracking-[0.2em] uppercase mt-1">Official Student Identity</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur p-1.5 rounded shadow-sm">
                        <School className="text-white" size={24} />
                    </div>
                </div>

                <div className="flex gap-5 mt-auto items-end">
                    {/* Photo */}
                    <div className="w-28 h-36 bg-gray-100 rounded-md border-[3px] border-white shadow-md overflow-hidden shrink-0 relative">
                         {profile.avatarUrl ? (
                             <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="ID Photo" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <User className="text-gray-400" size={32} />
                             </div>
                         )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-end pb-1">
                        <div className="mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 uppercase leading-none">{profile.lastName}</h3>
                            <p className="text-lg font-medium text-gray-600">{profile.firstName}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                            <div>
                                <span className="block text-gray-400 font-normal">ID Number</span>
                                <span className="text-gray-900 font-mono text-xs">{profile.studentId}</span>
                            </div>
                            <div>
                                <span className="block text-gray-400 font-normal">Expires</span>
                                <span className="text-gray-900 text-xs">{profile.graduationDate}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Barcode Sim */}
                    <div className="h-24 w-8 hidden sm:flex flex-col items-center justify-end gap-0.5 opacity-60">
                        {Array.from({length: 15}).map((_, i) => (
                            <div key={i} className="w-full bg-black" style={{height: Math.random() * 4 + 1 + 'px'}}></div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Hologram Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-40 pointer-events-none"></div>
         </div>
      </div>

      {/* 2. Admission Letter & Campus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          
          {/* Admission Letter */}
          <div className="relative">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">凭证 2: 录取通知书 (Admission Letter)</div>
            <div className="bg-white border border-gray-200 elevation-z4 p-6 font-serif text-gray-900 relative min-h-[400px]">
                {/* Letter Header */}
                <div className="border-b-2 border-gray-900 pb-3 mb-4 flex justify-between items-end">
                    <div className="w-3/4">
                        <h1 className="text-lg font-bold uppercase tracking-wide leading-tight">{profile.universityName}</h1>
                    </div>
                    <div className="w-12 opacity-80">
                        <School size={32} />
                    </div>
                </div>

                {/* Body */}
                <div className="text-[11px] leading-relaxed space-y-3 text-justify">
                    <p><strong>Ref: {profile.studentId}</strong></p>
                    
                    <p>
                        This letter certifies that <strong>{profile.firstName} {profile.lastName}</strong> is a registered full-time student at {profile.universityName}.
                    </p>

                    <div className="bg-gray-50 p-3 border-l-2 border-gray-400 my-2 font-sans text-[10px] grid grid-cols-2 gap-2">
                        <div><span className="text-gray-500">DOB:</span> <span className="font-bold">{profile.dob}</span></div>
                        <div><span className="text-gray-500">Admitted:</span> <span className="font-bold">{profile.admissionDate}</span></div>
                        <div><span className="text-gray-500">Degree:</span> <span className="font-bold">{profile.degree}</span></div>
                        <div><span className="text-gray-500">Status:</span> <span className="font-bold text-green-700">Enrolled</span></div>
                    </div>

                    <p>
                        This document serves as official verification for SheerID.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 flex justify-between items-end">
                    <div>
                        <div className="font-cursive text-lg text-blue-900 mb-1" style={{fontFamily: 'cursive'}}>RegistrarSign</div>
                        <div className="border-t border-gray-300 w-32 pt-1">
                            <p className="font-bold text-[10px] uppercase">Office of Registrar</p>
                        </div>
                    </div>
                    <QrCode size={40} className="opacity-80" />
                </div>
            </div>
         </div>

         {/* Campus Image Proof */}
         <div className="relative flex flex-col h-full">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">凭证 3: 校园实景 (Campus Photo)</div>
            <div className="bg-white border border-gray-200 elevation-z4 p-1 flex-1 flex flex-col">
                <div className="w-full h-48 bg-gray-100 overflow-hidden relative mb-2">
                    {profile.campusUrl ? (
                        <img src={profile.campusUrl} className="w-full h-full object-cover" alt="University Campus" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 flex-col gap-2">
                            <School size={32} />
                            <span className="text-xs">正在生成校园图像...</span>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 px-2 truncate">
                        {profile.universityName} - Main Campus
                    </div>
                </div>
                <div className="p-2 bg-gray-50 flex-1">
                    <p className="text-[10px] text-gray-500 leading-tight">
                        <strong>提示:</strong> 部分验证流程可能需要提供包含学生本人的校园背景照或学校门户截图。此图像由 AI 生成，仅供参考。
                    </p>
                </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default VisualProofs;
