
import React from 'react';
import { StudentProfile } from '../types';
import { Copy, Building2, Mail, Calendar, Award, Hash, Cake, User } from 'lucide-react';

interface IdentityCardProps {
  profile: StudentProfile;
}

const IdentityCard: React.FC<IdentityCardProps> = ({ profile }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-white rounded-lg elevation-z8 overflow-hidden relative mb-6">
      {/* Card Header */}
      <div className="bg-[#3F51B5] p-6 relative overflow-hidden h-32 flex items-center">
        <div className="absolute -right-6 -top-6 text-white opacity-10">
            <Award size={200} />
        </div>
        <div className="relative z-10 flex w-full justify-between items-end">
          <div className="flex items-end gap-4">
             <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-300 shadow-lg overflow-hidden relative">
               {profile.avatarUrl ? (
                 <img src={profile.avatarUrl} alt="Student" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <User size={32} />
                 </div>
               )}
             </div>
             <div className="mb-1 text-white">
                <h2 className="text-3xl font-bold leading-none tracking-tight">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-indigo-100 text-xs font-medium tracking-widest uppercase mt-1 opacity-90">International Student ID</p>
             </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded text-[10px] font-bold tracking-widest shadow-sm border border-white/10">
            已激活 (ACTIVE)
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-6 bg-white">
        
        {/* Primary Info Blocks - MDUI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className="group mdui-ripple relative bg-white border border-gray-100 p-4 rounded shadow hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-[#3F51B5]" 
            onClick={() => copyToClipboard(profile.universityName)}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-full text-[#3F51B5]">
                <Building2 size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">所属院校 (University)</p>
                <p className="text-gray-900 font-bold text-sm truncate">{profile.universityName}</p>
              </div>
              <Copy className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </div>
          </div>

          <div 
            className="group mdui-ripple relative bg-white border border-gray-100 p-4 rounded shadow hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-[#E91E63]" 
            onClick={() => copyToClipboard(profile.email)}
          >
             <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-50 rounded-full text-[#E91E63]">
                <Mail size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">教育邮箱 (Edu Email)</p>
                <p className="text-gray-900 font-mono text-sm truncate">{profile.email}</p>
              </div>
              <Copy className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
            </div>
          </div>
        </div>

        {/* Detail Grid - Clean MD style */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-2">
           <div>
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <Award size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">主修专业 (Major)</span>
              </div>
              <p className="text-gray-900 font-medium text-sm border-b border-gray-100 pb-1">{profile.major}</p>
           </div>

           <div>
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <Hash size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">学号 (Student ID)</span>
              </div>
              <p className="text-gray-900 font-medium font-mono text-sm border-b border-gray-100 pb-1">{profile.studentId}</p>
           </div>

           <div>
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <Cake size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">出生日期 (DOB)</span>
              </div>
              <p className="text-gray-900 font-medium text-sm border-b border-gray-100 pb-1">{profile.dob} <span className="text-xs text-gray-400 font-normal">(18岁)</span></p>
           </div>

           <div>
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <Calendar size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">入学时间 (Admission)</span>
              </div>
              <p className="text-gray-900 font-medium text-sm border-b border-gray-100 pb-1">{profile.admissionDate}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityCard;
