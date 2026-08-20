export type Role = 'admin' | 'member';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  memberId?: string;
  avatar?: string;
}

export interface Member {
  id: string;
  memberCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Alumni';
  joinDate: string;
  duesOwed: number;
  duesPaid: number;
  avatar?: string;
  address?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  memberId: string;
  memberName: string;
  type: 'Dues' | 'Donation' | 'Event Fee' | 'Special Levy';
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod: 'Mobile Money' | 'Card' | 'Bank Transfer' | 'Cash';
  date: string;
  month: string;
  year: number;
  receiptNumber: string;
  notes?: string;
}

export interface MeetingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  status: 'Upcoming' | 'In Progress' | 'Completed';
  attendanceRecords: Record<string, 'Present' | 'Absent' | 'Excused'>;
  transcript?: string;
  audioUrl?: string;
  duration?: string;
  aiSummary?: {
    executiveSummary: string;
    actionItems: string[];
    motionsPassed: string[];
  };
}

export interface HostingScheduleItem {
  id: string;
  year: number;
  month: string;
  hostMemberId: string;
  hostMemberName: string;
  assignedDate: string;
  notes?: string;
}

export interface OrgSettings {
  orgName: string;
  orgTagline: string;
  monthlyDues: number;
  annualDues: number;
  currency: string;
  allowMemberPayments: boolean;
  notifyOnPayment: boolean;
  contactEmail: string;
  contactPhone: string;
}
