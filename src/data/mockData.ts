import { Applicant, JobPosition } from '../types';

export const DEFAULT_JOBS: JobPosition[] = [
  {
    id: 'job-1',
    title: 'Data Entry Operator',
    department: 'Operations',
    location: 'On-site',
    type: 'Full-time',
    description: 'Looking for a fast typing professional.'
  },
  {
    id: 'job-2',
    title: 'Customer Support Representative',
    department: 'Support',
    location: 'Remote',
    type: 'Full-time',
    description: 'Support active clients on product inquiries.'
  }
];

export const MOCK_APPLICANTS: Applicant[] = [];
