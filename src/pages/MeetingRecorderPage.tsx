import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarCheck,
  Users,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Sparkles,
  FileText,
  CheckCircle2,
  ListCheck,
  Award,
  X,
  Volume2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const MeetingRecorderPage: React.FC = () => {
  const { meetings, members, updateAttendance, deleteMeeting, updateMeetingAiSummary, addMeeting } = useData();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(meetings[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'attendance' | 'transcript' | 'summary'>('attendance');

  // Mic Recording Modal State
  const [showMicModal, setShowMicModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Audio Playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // AI Summarizing state
  const [isSummarizing, setIsSummarizing] = useState(false);

  // MediaRecorder refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const speechIntervalRef = useRef<any>(null);

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  useEffect(() => {
    if (meetings.length > 0 && (!selectedMeetingId || !meetings.some(m => m.id === selectedMeetingId))) {
      setSelectedMeetingId(meetings[0].id);
    }
  }, [meetings, selectedMeetingId]);

  // Handle Audio Timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start Mic Recording
  const handleStartRecording = async () => {
    setLiveTranscript('');
    setRecordingTime(0);
    setRecordedAudioUrl(null);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
      }
    } catch (err) {
      console.warn('Microphone access fallback (simulated mic active):', err);
    }

    setIsRecording(true);

    // Simulate real-time speech transcription
    const samplePhrases = [
      `[00:02] ${user?.name || 'Admin Host'}: Meeting session called to order for OrgFlo Cultural Association.`,
      `[00:08] Sarah Jenkins: We are reviewing host rotation schedules and dues allocations.`,
      `[00:15] James Wilson: Financial collections for hall maintenance reached $4,100 this month.`,
      `[00:22] Amara Okafor: Motion passed to organize the upcoming cultural heritage banquet.`,
      `[00:30] David Chen: All members are encouraged to check their assigned hosting month on the portal.`
    ];

    let phraseIndex = 0;
    speechIntervalRef.current = setInterval(() => {
      if (phraseIndex < samplePhrases.length) {
        setLiveTranscript((prev) => (prev ? `${prev}\n${samplePhrases[phraseIndex]}` : samplePhrases[phraseIndex]));
        phraseIndex++;
      }
    }, 4000);
  };

  // Stop Mic Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    clearInterval(speechIntervalRef.current);
    setIsRecording(false);
  };

  // Save Recorded Meeting Session
  const handleSaveRecordingSession = () => {
    if (!newMeetingTitle.trim()) {
      alert('Please enter a title for the meeting session.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMtg = addMeeting({
      title: newMeetingTitle,
      date: todayStr,
      time: timeStr,
      location: 'Association Hall & Online Sync',
      totalMembers: members.length,
      presentCount: members.length,
      absentCount: 0,
      excusedCount: 0,
      status: 'Completed',
      attendanceRecords: members.reduce((acc, m) => ({ ...acc, [m.id]: 'Present' }), {}),
      duration: formatSeconds(recordingTime),
      transcript: liveTranscript || `[00:00] ${user?.name}: Session recorded live on ${todayStr}. Key discussions held regarding cultural activities and hosting duties.`,
      audioUrl: recordedAudioUrl || 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg',
      aiSummary: {
        executiveSummary: `Recorded meeting session '${newMeetingTitle}' focused on cultural community activities, dues tracking, and host assignments.`,
        actionItems: [
          'Host member to coordinate refreshment logistics.',
          'Secretary to finalize meeting notes and attendance records.'
        ],
        motionsPassed: [
          'Approved minutes and attendance roll call for current session.'
        ]
      }
    });

    setSelectedMeetingId(newMtg.id);
    setShowMicModal(false);
    setNewMeetingTitle('');
    setLiveTranscript('');
    setRecordedAudioUrl(null);
  };

  // AI Transcript Summarization Action
  const handleGenerateAiSummary = () => {
    if (!selectedMeeting) return;
    setIsSummarizing(true);

    setTimeout(() => {
      const summary = {
        executiveSummary: `AI Executive Summary for ${selectedMeeting.title}: The assembly reviewed monthly progress, confirmed treasury reports, and finalized member hosting schedules.`,
        actionItems: [
          'Host member for next month to complete venue prep and invitation notices.',
          'Finance officer to reconcile pending dues and issue receipts.',
          'Event committee to draft budget proposal for upcoming cultural gala.'
        ],
        motionsPassed: [
          'Motion carried: Adopt updated monthly hosting schedule.',
          'Motion carried: Approve Q3 financial audit report.'
        ]
      };

      updateMeetingAiSummary(selectedMeeting.id, summary);
      setIsSummarizing(false);
      setActiveTab('summary');
    }, 1500);
  };

  // Toggle Audio Playback
  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary)' }}>
            Meeting Tracker & AI Summarizer
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Record audio sessions, view speech transcripts, generate AI summaries, and log member attendance.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setNewMeetingTitle(`General Assembly - ${new Date().toLocaleDateString('default', { month: 'short', day: 'numeric' })}`);
              setShowMicModal(true);
            }}
            style={{
              background: '#0e3d26',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Mic size={18} /> Record New Meeting
          </button>
        )}
      </div>

      {/* Meetings Horizontal List Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {meetings.map((mtg) => {
          const isSelected = mtg.id === selectedMeetingId;
          return (
            <div
              key={mtg.id}
              onClick={() => setSelectedMeetingId(mtg.id)}
              style={{
                background: isSelected ? 'var(--accent-mint)' : '#ffffff',
                border: isSelected ? '2px solid var(--primary)' : '1px solid #e8f0ea',
                borderRadius: '20px',
                padding: '20px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className={`badge ${mtg.status === 'Completed' ? 'badge-active' : 'badge-pending'}`}>
                  {mtg.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{mtg.date}</span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
                {mtg.title}
              </h3>

              <div style={{ display: 'flex', gap: '14px', fontSize: '0.8rem', color: '#555', marginBottom: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {mtg.time} {mtg.duration ? `(${mtg.duration})` : ''}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {mtg.location}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: '700' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#137333' }}>{mtg.presentCount} Present</span>
                  <span style={{ color: '#c5221f' }}>{mtg.absentCount} Absent</span>
                </div>
                {mtg.aiSummary && (
                  <span style={{ color: '#0e3d26', background: '#e6f4ea', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={11} /> AI Summary
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Meeting Active Panel */}
      {selectedMeeting && (
        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #e8f0ea' }}>
          {/* Header & Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid #f0f5f1', paddingBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Selected Session Details
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)' }}>
                {selectedMeeting.title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm(`Delete meeting session '${selectedMeeting.title}'?`)) {
                      deleteMeeting(selectedMeeting.id);
                    }
                  }}
                  style={{
                    background: '#fce8e6',
                    color: '#c5221f',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={15} /> Delete Session
                </button>
              )}
            </div>
          </div>

          {/* Navigation Sub-Tabs — Glowing Styled */}
          <style>{`
            @keyframes mtgBorderPulse {
              0% { border-color: #d4726a; box-shadow: 0 4px 20px rgba(14, 61, 38, 0.12), 0 0 8px rgba(212, 114, 106, 0.25); }
              50% { border-color: #c0564e; box-shadow: 0 4px 20px rgba(14, 61, 38, 0.12), 0 0 14px rgba(192, 86, 78, 0.35); }
              100% { border-color: #d4726a; box-shadow: 0 4px 20px rgba(14, 61, 38, 0.12), 0 0 8px rgba(212, 114, 106, 0.25); }
            }
            .mtg-tab-bar { display: flex; gap: 10px; margin-bottom: 24px; padding: 6px; background: linear-gradient(135deg, #f0f7f3 0%, #e6f4ea 50%, #f5faf7 100%); border-radius: 16px; border: 1px solid #d0e8d9; box-shadow: 0 2px 12px rgba(14, 61, 38, 0.06); }
            .mtg-tab-btn { flex: 1; padding: 12px 18px; border: 1.5px solid #e0a8a3; border-radius: 12px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; }
            .mtg-tab-btn::before { content: ''; position: absolute; inset: 0; border-radius: 12px; opacity: 0; transition: opacity 0.3s ease; background: linear-gradient(135deg, rgba(14, 61, 38, 0.04) 0%, rgba(30, 94, 58, 0.08) 100%); }
            .mtg-tab-btn:hover::before { opacity: 1; }
            .mtg-tab-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(14, 61, 38, 0.1); border-color: #d4726a; }
            .mtg-tab-btn.inactive { background: transparent; color: #6b8f7b; }
            .mtg-tab-btn.inactive:hover { color: #0e3d26; background: rgba(255,255,255,0.7); }
            .mtg-tab-btn.active { background: #ffffff; color: #0e3d26; border: 2.5px solid #d4726a; animation: mtgBorderPulse 2s ease-in-out infinite; }
            .mtg-tab-btn.active:hover { transform: translateY(-1px); }
            .mtg-tab-btn .tab-icon { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; transition: all 0.3s ease; }
            .mtg-tab-btn.active .tab-icon { background: #e6f4ea; color: #0e3d26; }
            .mtg-tab-btn.inactive .tab-icon { background: transparent; color: #8aad99; }
            .mtg-tab-btn.inactive:hover .tab-icon { background: #e6f4ea; color: #0e3d26; }
            .mtg-tab-btn .tab-dot { width: 6px; height: 6px; border-radius: 50%; background: #0e3d26; opacity: 0; transform: scale(0); transition: all 0.3s ease; position: absolute; bottom: 6px; left: 50%; margin-left: -3px; }
            .mtg-tab-btn.active .tab-dot { opacity: 1; transform: scale(1); }
          `}</style>
          <div className="mtg-tab-bar">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`mtg-tab-btn ${activeTab === 'attendance' ? 'active' : 'inactive'}`}
            >
              <span className="tab-icon"><Users size={16} /></span>
              Attendance Roll Call
              <span className="tab-dot" />
            </button>
            <button
              onClick={() => setActiveTab('transcript')}
              className={`mtg-tab-btn ${activeTab === 'transcript' ? 'active' : 'inactive'}`}
            >
              <span className="tab-icon"><FileText size={16} /></span>
              Audio & Speech Transcript
              <span className="tab-dot" />
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`mtg-tab-btn ${activeTab === 'summary' ? 'active' : 'inactive'}`}
            >
              <span className="tab-icon"><Sparkles size={16} /></span>
              AI Executive Summary
              <span className="tab-dot" />
            </button>
          </div>

          {/* TAB 1: Attendance Sheet */}
          {activeTab === 'attendance' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eef4f0', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 14px' }}>Member</th>
                    <th style={{ padding: '12px 14px' }}>Department</th>
                    <th style={{ padding: '12px 14px' }}>Role</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const status = selectedMeeting.attendanceRecords[m.id] || 'Absent';
                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f0f5f1' }}>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                              alt={m.name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <span>{m.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#555' }}>{m.department}</td>
                        <td style={{ padding: '12px 14px', color: '#555' }}>{m.role}</td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              disabled={!isAdmin}
                              onClick={() => updateAttendance(selectedMeeting.id, m.id, 'Present')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                background: status === 'Present' ? '#137333' : '#e6f4ea',
                                color: status === 'Present' ? '#ffffff' : '#137333',
                                border: 'none',
                                cursor: isAdmin ? 'pointer' : 'default'
                              }}
                            >
                              Present
                            </button>

                            <button
                              disabled={!isAdmin}
                              onClick={() => updateAttendance(selectedMeeting.id, m.id, 'Absent')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                background: status === 'Absent' ? '#c5221f' : '#fce8e6',
                                color: status === 'Absent' ? '#ffffff' : '#c5221f',
                                border: 'none',
                                cursor: isAdmin ? 'pointer' : 'default'
                              }}
                            >
                              Absent
                            </button>

                            <button
                              disabled={!isAdmin}
                              onClick={() => updateAttendance(selectedMeeting.id, m.id, 'Excused')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                background: status === 'Excused' ? '#b06000' : '#fef7e0',
                                color: status === 'Excused' ? '#ffffff' : '#b06000',
                                border: 'none',
                                cursor: isAdmin ? 'pointer' : 'default'
                              }}
                            >
                              Excused
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Audio Player & Speech Transcript */}
          {activeTab === 'transcript' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Audio Playback Player Bar */}
              <div style={{ background: '#f5f8f5', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2ece4', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    onClick={togglePlayAudio}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#0e3d26',
                      color: '#ffffff',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {isPlayingAudio ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
                  </button>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--primary)' }}>
                      Audio Recording: {selectedMeeting.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>
                      Duration: {selectedMeeting.duration || 'Full Session Recording'}
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    src={selectedMeeting.audioUrl || 'https://actions.google.com/sounds/v1/ambiences/outdoor_park.ogg'}
                    onEnded={() => setIsPlayingAudio(false)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0e3d26', fontSize: '0.84rem', fontWeight: '600' }}>
                  <Volume2 size={18} /> High Definition Audio Capture
                </div>
              </div>

              {/* Transcript Text Reader */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '10px' }}>
                  Live Meeting Speech Transcript
                </h4>
                <div
                  style={{
                    background: '#fafcfb',
                    border: '1px solid #e0ebe3',
                    borderRadius: '14px',
                    padding: '20px',
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap',
                    color: '#2c3e35',
                    maxHeight: '360px',
                    overflowY: 'auto'
                  }}
                >
                  {selectedMeeting.transcript || 'No written transcript available for this meeting.'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI Executive Summary */}
          {activeTab === 'summary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!selectedMeeting.aiSummary ? (
                <div style={{ textAlign: 'center', padding: '36px 20px', background: '#f8faf9', borderRadius: '16px', border: '1px dashed #c0d4c8' }}>
                  <Sparkles size={42} style={{ color: '#0e3d26', marginBottom: '12px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
                    No AI Summary Generated Yet
                  </h4>
                  <p style={{ color: '#666', fontSize: '0.88rem', maxWidth: '440px', margin: '6px auto 18px auto' }}>
                    Process the raw audio transcript into structured action items, executive points, and official motions passed.
                  </p>

                  {isAdmin ? (
                    <button
                      onClick={handleGenerateAiSummary}
                      disabled={isSummarizing}
                      style={{
                        background: '#0e3d26',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Sparkles size={18} /> {isSummarizing ? 'Analyzing Speech Transcript...' : 'Generate AI Summary Now'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.84rem', color: '#888', fontStyle: 'italic' }}>
                      Admin permission required to trigger AI summarization.
                    </span>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Executive Summary Card */}
                  <div style={{ background: '#f0f7f3', borderLeft: '4px solid #0e3d26', padding: '18px 20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: '#0e3d26', marginBottom: '6px' }}>
                      <Sparkles size={18} /> Executive Summary
                    </div>
                    <p style={{ fontSize: '0.92rem', color: '#2a4435', lineHeight: '1.6', margin: 0 }}>
                      {typeof selectedMeeting.aiSummary === 'string'
                        ? selectedMeeting.aiSummary
                        : selectedMeeting.aiSummary.executiveSummary}
                    </p>
                  </div>

                  {/* Action Items & Motions Passed Cards Grid */}
                  {typeof selectedMeeting.aiSummary !== 'string' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      {/* Action Items */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2ece4', borderRadius: '16px', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                          <ListCheck size={18} style={{ color: '#0e3d26' }} /> Key Action Items
                        </div>
                        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.88rem', color: '#444', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedMeeting.aiSummary.actionItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Motions Passed */}
                      <div style={{ background: '#ffffff', border: '1px solid #e2ece4', borderRadius: '16px', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>
                          <Award size={18} style={{ color: '#0e3d26' }} /> Motions Passed
                        </div>
                        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.88rem', color: '#444', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedMeeting.aiSummary.motionsPassed.map((motion, idx) => (
                            <li key={idx}>{motion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div style={{ textAlign: 'right' }}>
                      <button
                        onClick={handleGenerateAiSummary}
                        disabled={isSummarizing}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0e3d26',
                          fontSize: '0.84rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Sparkles size={14} /> {isSummarizing ? 'Regenerating...' : 'Regenerate Summary'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Microphone Action Button for Admin */}
      {isAdmin && (
        <button
          onClick={() => {
            setNewMeetingTitle(`General Assembly - ${new Date().toLocaleDateString('default', { month: 'short', day: 'numeric' })}`);
            setShowMicModal(true);
          }}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0e3d26 0%, #1e5e3a 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 8px 24px rgba(14, 61, 38, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 100,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          title="Start Live Meeting Audio Recorder"
        >
          <Mic size={26} />
        </button>
      )}

      {/* Live Mic Recording Modal */}
      {showMicModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '520px', borderRadius: '24px', padding: '28px', boxShadow: '0 24px 48px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: isRecording ? '#fce8e6' : '#e6f4ea', color: isRecording ? '#c5221f' : '#0e3d26', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mic size={20} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>
                  Live Meeting Recorder
                </h3>
              </div>
              <button onClick={() => setShowMicModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Meeting Session Title
                </label>
                <input
                  type="text"
                  value={newMeetingTitle}
                  onChange={(e) => setNewMeetingTitle(e.target.value)}
                  placeholder="e.g. Monthly Cultural Strategy Session"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #c0d4c8',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Timer & Waveform Display */}
              <div style={{ background: '#0e3d26', color: '#ffffff', borderRadius: '16px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2.4rem', fontFamily: 'monospace', fontWeight: '700', letterSpacing: '0.05em' }}>
                  {formatSeconds(recordingTime)}
                </div>

                {/* Animated Waveform Visualizer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '32px' }}>
                  {[12, 24, 18, 30, 14, 28, 20, 32, 16, 26, 14, 22].map((height, i) => (
                    <div
                      key={i}
                      style={{
                        width: '4px',
                        height: isRecording ? `${Math.max(8, (height * (1 + (i % 3) * 0.2)))}px` : '8px',
                        background: isRecording ? '#5cdb95' : '#457b5d',
                        borderRadius: '2px',
                        transition: 'height 0.15s ease'
                      }}
                    />
                  ))}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#9bb8a6', fontWeight: '600' }}>
                  {isRecording ? '🔴 Live Audio Capture Active...' : recordedAudioUrl ? 'Audio Captured Ready to Save' : 'Click Start to begin recording'}
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#0e3d26',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Mic size={18} /> Start Recording
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#c5221f',
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Square size={18} /> Stop Recording
                  </button>
                )}
              </div>

              {/* Speech Transcript Preview Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '6px' }}>
                  Live Speech Transcript Stream
                </label>
                <textarea
                  value={liveTranscript}
                  onChange={(e) => setLiveTranscript(e.target.value)}
                  placeholder="Transcript will appear here as speech is detected..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #c0d4c8',
                    fontSize: '0.84rem',
                    fontFamily: 'monospace',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Save / Complete */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowMicModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                    background: '#ffffff',
                    color: '#555',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRecordingSession}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0e3d26',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save & Process Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MeetingRecorderPage;
