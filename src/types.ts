export type ApplicationStatus = 'Pending' | 'Ongoing' | 'Selected' | 'Rejected' | 'Work from Home';

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'comment' | 'system_creation';
  fromStatus?: ApplicationStatus;
  toStatus?: ApplicationStatus;
  comment?: string;
  operator: string;
  timestamp: string;
}

export interface EducationRecord {
  degree: string;
  college: string;
  year: string;
}

export interface Applicant {
  id: string;
  role: string;
  photoUrl?: string;
  name: string;
  dateOfBirth: string;
  maritalStatus: string;
  fatherOrHusbandName: string;
  address: string;
  phone: string;
  email: string;
  education: EducationRecord[];
  typingSkill: string;
  experience: string;
  place: string;
  date: string;
  signature: string;
  signatureUrl?: string;
  resumeUrl?: string;
  idProofUrl?: string;

  status: ApplicationStatus;
  appliedAt: string;
  timeline: TimelineEvent[];
}

export interface JobPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
}
