import React, { useState } from 'react';
import { Applicant, ApplicationStatus, TimelineEvent } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  UserCheck, 
  Database,
  XCircle,
  AlertCircle,
  FileCheck,
  Download,
  FileText,
  UploadCloud,
  Eye,
  Printer,
  MessageSquare,
  ArrowUpDown,
  DownloadCloud
} from 'lucide-react';

interface AdminDashboardProps {
  applicants: Applicant[];
  onUpdateApplicant: (applicant: Applicant) => void;
  onBulkUpdateApplicants?: (applicants: Applicant[]) => void;
  onBulkImport: (imported: Applicant[]) => void;
  onLogout: () => void;
}

export default function AdminDashboard({ 
  applicants, 
  onUpdateApplicant,
  onBulkUpdateApplicants,
  onLogout 
}: AdminDashboardProps) {

  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chosenStatus, setChosenStatus] = useState<ApplicationStatus | 'All'>('All');
  const [newNote, setNewNote] = useState('');
  
  // Sorting & Bulk Selection
  const [sortConfig, setSortConfig] = useState<{column: 'date' | 'name', direction: 'asc' | 'desc'}>({ column: 'date', direction: 'desc' });
  const [selectedBulkIds, setSelectedBulkIds] = useState<Set<string>>(new Set());

  const activeDetail = applicants.find(app => app.id === selectedApplicantId);

  const handleAddNote = () => {
    if (!newNote.trim() || !activeDetail) return;
    
    const updated: Applicant = {
      ...activeDetail,
      timeline: [...activeDetail.timeline, {
        id: `t-${Date.now()}`,
        type: 'comment',
        timestamp: new Date().toISOString(),
        operator: 'Admin',
        comment: newNote.trim()
      }]
    };
    onUpdateApplicant(updated);
    setNewNote('');
  };

  const handleTransitionStatus = (nextStatus: ApplicationStatus) => {
    if (!activeDetail) return;
    const updated: Applicant = {
      ...activeDetail,
      status: nextStatus,
      timeline: [...activeDetail.timeline, {
        id: `t-${Date.now()}`,
        type: 'status_change',
        timestamp: new Date().toISOString(),
        fromStatus: activeDetail.status,
        toStatus: nextStatus,
        operator: 'Admin',
        comment: `Status updated to ${nextStatus}`
      }]
    };
    onUpdateApplicant(updated);
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = chosenStatus === 'All' || app.status === chosenStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortConfig.column === 'date') {
      const diff = new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      return sortConfig.direction === 'desc' ? diff : -diff;
    } else {
      const comp = a.name.localeCompare(b.name);
      return sortConfig.direction === 'asc' ? comp : -comp;
    }
  });

  const toggleSort = (col: 'date' | 'name') => {
    setSortConfig(prev => ({
      column: col,
      direction: prev.column === col && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBulkIds(new Set(filteredApplicants.map(a => a.id)));
    } else {
      setSelectedBulkIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const next = new Set(selectedBulkIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBulkIds(next);
  };

  const handleBulkStatusChange = (newStatus: ApplicationStatus) => {
    const updatedApplicants = Array.from(selectedBulkIds).map(id => {
      const app = applicants.find(a => a.id === id)!;
      return {
        ...app,
        status: newStatus,
        timeline: [...app.timeline, {
          id: `t-${Date.now()}-${id}`,
          type: 'status_change',
          timestamp: new Date().toISOString(),
          fromStatus: app.status,
          toStatus: newStatus,
          operator: 'Admin',
          comment: `Bulk status update to ${newStatus}`
        }]
      } as Applicant;
    });

    if (onBulkUpdateApplicants) {
      onBulkUpdateApplicants(updatedApplicants);
    } else {
      updatedApplicants.forEach(app => onUpdateApplicant(app));
    }
    setSelectedBulkIds(new Set());
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Role', 'Status', 'Date Applied', 'Education', 'Experience'];
    const rows = filteredApplicants.map(app => [
      `"${app.name}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${app.role}"`,
      `"${app.status}"`,
      `"${new Date(app.appliedAt).toLocaleDateString()}"`,
      `"${app.education.map(ed => `${ed.degree} from ${ed.college}`).join('; ')}"`,
      `"${app.experience.replace(/\n/g, ' ')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `applicants_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in print:p-0 print:m-0 print:space-y-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 print:hidden">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-gray-950">
            Hiring Command Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review detailed applicant forms and pipeline tracking.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800 transition-colors"
        >
          Exit Dashboard
        </button>
      </div>

      <div className="grid gap-4 grid-cols-3 print:hidden">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <div className="flex justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Active Pool</span>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{applicants.length}</span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <div className="flex justify-between text-amber-500">
            <span className="text-xs font-bold uppercase text-gray-500">In Pipeline</span>
            <Clock className="h-5 w-5" />
          </div>
          <span className="text-3xl font-bold text-amber-600">
            {applicants.filter(a => ['Pending', 'Ongoing'].includes(a.status)).length}
          </span>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <div className="flex justify-between text-green-500">
            <span className="text-xs font-bold uppercase text-gray-500">Selected</span>
            <UserCheck className="h-5 w-5" />
          </div>
          <span className="text-3xl font-bold text-green-600">
            {applicants.filter(a => a.status === 'Selected').length}
          </span>
        </div>
      </div>

      <div className="space-y-4 print:space-y-0">
        
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center justify-between print:hidden">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Name, Email, or Role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={chosenStatus}
                onChange={(e) => setChosenStatus(e.target.value as any)}
                className="rounded-lg border border-gray-200 bg-white p-2 text-sm focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Work from Home">Work from Home</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <DownloadCloud className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {selectedBulkIds.size > 0 && (
          <div className="flex items-center gap-4 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 print:hidden animate-fade-in shadow-sm">
            <span className="text-sm font-bold text-emerald-900 bg-white px-2 py-1 rounded border border-emerald-200">
              {selectedBulkIds.size} Selected
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-emerald-800 font-semibold">Bulk Action:</span>
              <select
                className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-sm focus:outline-none text-gray-700"
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusChange(e.target.value as ApplicationStatus);
                    e.target.value = ''; // reset
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>Update Status...</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
                <option value="Work from Home">Work from Home</option>
              </select>
            </div>
            <button
              onClick={() => setSelectedBulkIds(new Set())}
              className="ml-auto text-sm text-emerald-700 hover:text-emerald-900 font-semibold underline"
            >
              Clear Selection
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-12 print:block">
          
          <div className={`${selectedApplicantId ? 'lg:col-span-6' : 'lg:col-span-12'} transition-all print:hidden`}>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                    <th className="py-3 px-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        checked={filteredApplicants.length > 0 && selectedBulkIds.size === filteredApplicants.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                    </th>
                    <th className="py-3 px-4">
                      <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-gray-900 uppercase">
                        Applicant
                        <ArrowUpDown className={`h-3 w-3 ${sortConfig.column === 'name' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </button>
                    </th>
                    <th className="py-3 px-4">Applied Role</th>
                    <th className="py-3 px-4">
                      <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-gray-900 uppercase">
                        Applied Date
                        <ArrowUpDown className={`h-3 w-3 ${sortConfig.column === 'date' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </button>
                    </th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplicants.map((app) => (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedApplicantId === app.id ? 'bg-emerald-50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedBulkIds.has(app.id)}
                          onChange={() => handleSelectOne(app.id)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={() => setSelectedApplicantId(app.id)}>
                        <div className="font-semibold text-gray-900">{app.name}</div>
                        <div className="text-xs text-gray-500">{app.email}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-700 cursor-pointer" onClick={() => setSelectedApplicantId(app.id)}>{app.role}</td>
                      <td className="py-3 px-4 text-gray-600 cursor-pointer" onClick={() => setSelectedApplicantId(app.id)}>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 cursor-pointer" onClick={() => setSelectedApplicantId(app.id)}>
                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-700 border border-gray-200">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedApplicantId && activeDetail && (
            <div className="lg:col-span-6 space-y-6 print:block">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-md relative overflow-hidden print:shadow-none print:border-none">
                <div className="bg-emerald-50 p-6 border-b border-gray-200 relative">
                   <div className="absolute top-4 right-4 flex gap-2 print:hidden">
                     <button
                       onClick={() => window.print()}
                       className="p-2 text-gray-500 hover:text-emerald-700 bg-white rounded-full shadow-sm"
                       title="Download PDF"
                     >
                       <Printer className="h-5 w-5" />
                     </button>
                     <button
                      onClick={() => setSelectedApplicantId(null)}
                      className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full shadow-sm"
                     >
                      <XCircle className="h-5 w-5" />
                     </button>
                   </div>
                   <div className="flex gap-4 items-start">
                     <div className="w-20 h-24 bg-white border border-gray-300 rounded overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                       {activeDetail.photoUrl ? (
                         <img src={activeDetail.photoUrl} className="w-full h-full object-cover" alt="photo" />
                       ) : (
                         <UserCheck className="h-8 w-8 text-gray-300" />
                       )}
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900">{activeDetail.name}</h2>
                       <p className="text-emerald-700 font-semibold">{activeDetail.role}</p>
                       <p className="text-sm text-gray-500 mt-1">{activeDetail.email} &bull; {activeDetail.phone}</p>
                     </div>
                   </div>
                </div>

                <div className="p-6 space-y-6 text-sm">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Date of Birth</span>
                      <span className="font-semibold text-gray-900">{activeDetail.dateOfBirth || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Marital Status</span>
                      <span className="font-semibold text-gray-900">{activeDetail.maritalStatus || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Father / Husband's Name</span>
                      <span className="font-semibold text-gray-900">{activeDetail.fatherOrHusbandName || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase">Typing Skill</span>
                      <span className="font-semibold text-gray-900">{activeDetail.typingSkill || '-'}</span>
                    </div>
                  </div>

                  <div>
                     <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Address</span>
                     <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{activeDetail.address || '-'}</p>
                  </div>

                  <div>
                     <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Educational Qualification</span>
                     {activeDetail.education && activeDetail.education.length > 0 ? (
                       <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                          <thead className="bg-gray-100 text-gray-600 text-xs">
                            <tr>
                              <th className="px-3 py-2 border-b border-gray-200">Degree</th>
                              <th className="px-3 py-2 border-b border-l border-gray-200">College / University</th>
                              <th className="px-3 py-2 border-b border-l border-gray-200">Year</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white text-gray-900 text-sm">
                            {activeDetail.education.map((ed, i) => (
                              <tr key={i}>
                                <td className="px-3 py-2">{ed.degree}</td>
                                <td className="px-3 py-2 border-l border-gray-200">{ed.college}</td>
                                <td className="px-3 py-2 border-l border-gray-200">{ed.year}</td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                     ) : (
                       <p className="text-gray-500 italic">No details provided.</p>
                     )}
                  </div>

                  <div>
                     <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Work Experience</span>
                     <p className="text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">{activeDetail.experience || '-'}</p>
                  </div>

                  {/* Attached Documents */}
                  <div className="print:hidden">
                     <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Attached Documents</span>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                             <FileText className="h-4 w-4" />
                           </div>
                           <div>
                             <p className="text-sm font-semibold text-gray-900">Resume / CV</p>
                             <p className="text-xs text-gray-500">{activeDetail.resumeUrl ? 'Available' : 'Not Provided'}</p>
                           </div>
                         </div>
                         {activeDetail.resumeUrl && (
                           <div className="flex items-center gap-1">
                             <a 
                               href={activeDetail.resumeUrl}
                               target="_blank"
                               rel="noreferrer"
                               className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                               title="View Resume"
                             >
                               <Eye className="h-4 w-4" />
                             </a>
                             <a 
                               href={activeDetail.resumeUrl}
                               download={`Resume_${activeDetail.name.replace(/\s+/g, '_')}`}
                               className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                               title="Download Resume"
                             >
                               <Download className="h-4 w-4" />
                             </a>
                           </div>
                         )}
                       </div>

                       <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                         <div className="flex items-center gap-2">
                           <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
                             <UploadCloud className="h-4 w-4" />
                           </div>
                           <div>
                             <p className="text-sm font-semibold text-gray-900">ID Proof</p>
                             <p className="text-xs text-gray-500">{activeDetail.idProofUrl ? 'Available' : 'Not Provided'}</p>
                           </div>
                         </div>
                         {activeDetail.idProofUrl && (
                           <div className="flex items-center gap-1">
                             <a 
                               href={activeDetail.idProofUrl}
                               target="_blank"
                               rel="noreferrer"
                               className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                               title="View ID Proof"
                             >
                               <Eye className="h-4 w-4" />
                             </a>
                             <a 
                               href={activeDetail.idProofUrl}
                               download={`ID_Proof_${activeDetail.name.replace(/\s+/g, '_')}`}
                               className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                               title="Download ID Proof"
                             >
                               <Download className="h-4 w-4" />
                             </a>
                           </div>
                         )}
                       </div>
                     </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex justify-between items-center">
                     <div>
                       <span className="block text-xs text-gray-500">Declared at</span>
                       <span className="font-semibold">{activeDetail.place || '-'}, {activeDetail.date || '-'}</span>
                     </div>
                     <div className="text-right flex flex-col items-end">
                       <span className="block text-xs text-gray-500 mb-1">Signature</span>
                       {activeDetail.signatureUrl ? (
                         <img src={activeDetail.signatureUrl} alt="Signature" className="h-10 object-contain" />
                       ) : (
                         <span className="font-serif italic text-lg">{activeDetail.signature || '-'}</span>
                       )}
                     </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 print:hidden">
                    <span className="block text-xs font-bold text-gray-400 uppercase mb-3">Update Application Status</span>
                    <div className="flex flex-wrap gap-2">
                       {(['Pending', 'Ongoing', 'Selected', 'Rejected', 'Work from Home'] as const).map(status => (
                         <button
                           key={status}
                           onClick={() => handleTransitionStatus(status)}
                           className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
                             activeDetail.status === status
                               ? 'bg-gray-900 text-white border-gray-900'
                               : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                           }`}
                         >
                           {status}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Application History & Notes */}
                  <div className="pt-4 border-t border-gray-200 print:hidden">
                    <span className="block text-xs font-bold text-gray-400 uppercase mb-3 text-emerald-900 flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> 
                      Internal Notes & History
                    </span>
                    <div className="space-y-4">
                      {/* Note Input */}
                      <div className="flex flex-col gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <textarea
                          placeholder="Add internal feedback or interview notes..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="w-full rounded-md border border-gray-200 p-2 text-sm focus:border-emerald-500 focus:outline-none min-h-[80px]"
                        />
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="self-end px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-md hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Save Note
                        </button>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-3 mt-4">
                        {[...activeDetail.timeline].reverse().map(event => (
                          <div key={event.id} className="flex gap-3 text-sm">
                            <div className="mt-1">
                              {event.type === 'comment' ? (
                                <MessageSquare className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                              <div className="flex justify-between items-start mb-1 text-xs text-gray-500">
                                <span className="font-bold">{event.operator}</span>
                                <span>{new Date(event.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="text-gray-900">{event.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
