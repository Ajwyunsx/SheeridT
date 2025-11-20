
export enum Region {
  USA = 'United States',
  UK = 'United Kingdom',
  Canada = 'Canada',
  Australia = 'Australia',
  Germany = 'Germany',
  France = 'France',
  Japan = 'Japan'
}

export const RegionDisplay: Record<Region, string> = {
  [Region.USA]: '美国 (USA)',
  [Region.UK]: '英国 (UK)',
  [Region.Canada]: '加拿大 (Canada)',
  [Region.Australia]: '澳大利亚 (Australia)',
  [Region.Germany]: '德国 (Germany)',
  [Region.France]: '法国 (France)',
  [Region.Japan]: '日本 (Japan)'
};

export interface StudentProfile {
  firstName: string;
  lastName: string;
  dob: string; // Date of Birth (YYYY-MM-DD)
  universityName: string;
  universityDomain: string;
  email: string;
  major: string;
  studentId: string;
  admissionDate: string;
  graduationDate: string;
  degree: string;
  avatarUrl?: string; // Base64 image data
  campusUrl?: string; // Base64 image data
}

export interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  code?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING', // Combined generating + verifying
  COMPLETED = 'COMPLETED'
}
