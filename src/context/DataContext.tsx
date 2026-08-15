import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Transaction, MeetingSession, OrgSettings } from '../types';
import { INITIAL_MEMBERS, INITIAL_TRANSACTIONS, INITIAL_MEETINGS, INITIAL_SETTINGS } from '../utils/initialData';

interface DataContextType {
  members: Member[];
  transactions: Transaction[];
  meetings: MeetingSession[];
  settings: OrgSettings;
  addMember: (member: Omit<Member, 'id' | 'memberCode' | 'duesPaid'>) => void;
  updateMember: (id: string, updated: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'transactionId' | 'date' | 'month' | 'year' | 'receiptNumber'>) => Transaction;
  updateTransactionStatus: (id: string, status: Transaction['status']) => void;
  updateAttendance: (meetingId: string, memberId: string, status: 'Present' | 'Absent' | 'Excused') => void;
  updateSettings: (newSettings: Partial<OrgSettings>) => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('orgflo_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('orgflo_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [meetings, setMeetings] = useState<MeetingSession[]>(() => {
    const saved = localStorage.getItem('orgflo_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MEETINGS;
  });

  const [settings, setSettings] = useState<OrgSettings>(() => {
    const saved = localStorage.getItem('orgflo_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('orgflo_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('orgflo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('orgflo_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('orgflo_settings', JSON.stringify(settings));
  }, [settings]);

  const addMember = (newMemberData: Omit<Member, 'id' | 'memberCode' | 'duesPaid'>) => {
    const newId = `mem-${Date.now()}`;
    const newCode = `MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMember: Member = {
      ...newMemberData,
      id: newId,
      memberCode: newCode,
      duesPaid: 0,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const updateMember = (id: string, updated: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addTransaction = (
    txData: Omit<Transaction, 'id' | 'transactionId' | 'date' | 'month' | 'year' | 'receiptNumber'>
  ) => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const monthStr = today.toLocaleString('default', { month: 'long' });
    const yearNum = today.getFullYear();
    const txId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const receiptNum = `RCP-${yearNum}-${Math.floor(100 + Math.random() * 900)}`;

    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      transactionId: txId,
      date: dateStr,
      month: monthStr,
      year: yearNum,
      receiptNumber: receiptNum,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // If transaction status is Paid, update member's dues paid
    if (newTx.status === 'Paid') {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === newTx.memberId) {
            const newPaid = m.duesPaid + newTx.amount;
            const newOwed = Math.max(0, m.duesOwed - newTx.amount);
            return { ...m, duesPaid: newPaid, duesOwed: newOwed };
          }
          return m;
        })
      );
    }

    return newTx;
  };

  const updateTransactionStatus = (id: string, status: Transaction['status']) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const updateAttendance = (
    meetingId: string,
    memberId: string,
    status: 'Present' | 'Absent' | 'Excused'
  ) => {
    setMeetings((prev) =>
      prev.map((meeting) => {
        if (meeting.id !== meetingId) return meeting;

        const updatedRecords = {
          ...meeting.attendanceRecords,
          [memberId]: status,
        };

        const values = Object.values(updatedRecords);
        const presentCount = values.filter((v) => v === 'Present').length;
        const absentCount = values.filter((v) => v === 'Absent').length;
        const excusedCount = values.filter((v) => v === 'Excused').length;

        return {
          ...meeting,
          attendanceRecords: updatedRecords,
          presentCount,
          absentCount,
          excusedCount,
        };
      })
    );
  };

  const updateSettings = (newSettings: Partial<OrgSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetDemoData = () => {
    localStorage.removeItem('orgflo_members');
    localStorage.removeItem('orgflo_transactions');
    localStorage.removeItem('orgflo_meetings');
    localStorage.removeItem('orgflo_settings');
    setMembers(INITIAL_MEMBERS);
    setTransactions(INITIAL_TRANSACTIONS);
    setMeetings(INITIAL_MEETINGS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <DataContext.Provider
      value={{
        members,
        transactions,
        meetings,
        settings,
        addMember,
        updateMember,
        deleteMember,
        addTransaction,
        updateTransactionStatus,
        updateAttendance,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
