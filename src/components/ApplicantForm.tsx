import React, { useState, useRef } from 'react';
import { Applicant, JobPosition, EducationRecord } from '../types';
import { DEFAULT_JOBS } from '../data/mockData';
import { Logo } from './Logo';
import { 
  CheckCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  UploadCloud,
  FileText,
  X,
  Eye
} from 'lucide-react';

interface ApplicantFormProps {
  onAddApplicant: (applicant: Applicant) => void;
}

export default function ApplicantForm({ onAddApplicant }: ApplicantFormProps) {
  // Use mock jobs or dynamic ones if added by admin in future
  const jobsList = DEFAULT_JOBS;

  const [formPage, setFormPage] = useState<'apply' | 'success'>('apply');
  const [validationError, setValidationError] = useState('');

  // Form Fields
  const [role, setRole] = useState(jobsList[0]?.title || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState<EducationRecord[]>([
    { degree: '', college: '', year: '' }
  ]);
  const [typingSkill, setTypingSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [declaration, setDeclaration] = useState(false);
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [signature, setSignature] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [idProofUrl, setIdProofUrl] = useState('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const updateEducation = (index: number, field: keyof EducationRecord, value: string) => {
    const newEd = [...education];
    newEd[index][field] = value;
    setEducation(newEd);
  };

  const addEducationRow = () => {
    setEducation([...education, { degree: '', college: '', year: '' }]);
  };

  const removeEducationRow = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!role) return setValidationError('Please select a job role.');
    if (!name.trim()) return setValidationError('Name is required.');
    if (!phone.trim()) return setValidationError('Phone number is required.');
    if (!email.trim()) return setValidationError('Email is required.');
    if (!declaration) return setValidationError('You must accept the declaration.');
    if (!signature.trim() && !signatureUrl) return setValidationError('Digital signature or uploaded signature image is required.');

    const newApplicantId = `app-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newApplicant: Applicant = {
      id: newApplicantId,
      role,
      photoUrl,
      name,
      dateOfBirth,
      maritalStatus,
      fatherOrHusbandName,
      address,
      phone,
      email,
      education,
      typingSkill,
      experience,
      resumeUrl,
      idProofUrl,
      place,
      date,
      signature,
      signatureUrl,
      status: 'Pending',
      appliedAt: timestamp,
      timeline: [
        {
          id: `t-sub-${Date.now()}`,
          type: 'system_creation',
          timestamp: timestamp,
          operator: 'System Portal',
          comment: `Application submitted for ${role}.`
        }
      ]
    };

    onAddApplicant(newApplicant);
    setFormPage('success');

    // Reset fields
    setRole(jobsList[0]?.title || '');
    setPhotoUrl('');
    setName('');
    setDateOfBirth('');
    setMaritalStatus('');
    setFatherOrHusbandName('');
    setAddress('');
    setPhone('');
    setEmail('');
    setEducation([{ degree: '', college: '', year: '' }]);
    setTypingSkill('');
    setExperience('');
    setResumeUrl('');
    setIdProofUrl('');
    setDeclaration(false);
    setPlace('');
    setDate(new Date().toISOString().split('T')[0]);
    setSignature('');
    setSignatureUrl('');
  };

  if (formPage === 'success') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 mb-6">
          <CheckCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted successfully</h2>
        <p className="text-gray-600 mb-8">Thank you, {name}. Your application has been recorded.</p>
        <button
          onClick={() => setFormPage('apply')}
          className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Form Header (Vendor Styling) */}
        <div className="bg-emerald-900/5 p-6 md:p-8 border-b border-gray-200 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="flex h-16 w-16 items-center flex-shrink-0">
               <Logo className="h-full w-full" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-900 tracking-tight">Vendhan InfoTech</h1>
              <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider mb-2">Trust in Every Byte</p>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-semibold">
                10-G11, V.O.C Nagar, Dharapuram Road<br/>
                Oddanchatram - 624619<br/>
                Cell: 94888 67887, 73974 67887.
              </p>
            </div>
          </div>

          <div className="w-24 h-32 md:w-32 md:h-40 border-2 border-dashed border-gray-300 rounded bg-white flex flex-col flex-shrink-0 items-center justify-center cursor-pointer overflow-hidden transition-colors hover:border-emerald-500" onClick={() => photoInputRef.current?.click()}>
            <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
            {photoUrl ? (
              <img src={photoUrl} alt="Applicant" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-300 mb-2" />
                <span className="text-[10px] md:text-xs text-gray-400 font-medium font-sans">Attach Photo</span>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8">
          {validationError && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Job Selection Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-900">Applying For</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
            >
              <option value="" disabled>Select a position</option>
              {jobsList.map(job => (
                <option key={job.id} value={job.title}>{job.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900">1. Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
             </div>

             <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-900">2. Date of Birth</label>
                <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
             </div>

             <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-900">3. Marital Status</label>
                <select value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white">
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
             </div>

             <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900">4. Father's / Husband's Name</label>
                <input type="text" value={fatherOrHusbandName} onChange={e => setFatherOrHusbandName(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
             </div>

             <div className="space-y-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900">5. Address</label>
                <textarea rows={3} value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
             </div>

             <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-900">6. Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
             </div>

             <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-900">Mail Id</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
             </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">7. Educational Qualification</label>
            <div className="border border-gray-300 rounded-md overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm text-left">
                <thead className="bg-emerald-50 text-emerald-900 border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Degree</th>
                    <th className="px-4 py-2 font-semibold border-l border-gray-300">Name of the College / University</th>
                    <th className="px-4 py-2 font-semibold border-l border-gray-300 w-24">Year</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {education.map((row, index) => (
                    <tr key={index} className="bg-white">
                      <td className="p-0"><input type="text" value={row.degree} onChange={e => updateEducation(index, 'degree', e.target.value)} className="w-full border-0 px-4 py-2 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:outline-none bg-transparent" /></td>
                      <td className="p-0 border-l border-gray-300"><input type="text" value={row.college} onChange={e => updateEducation(index, 'college', e.target.value)} className="w-full border-0 px-4 py-2 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:outline-none bg-transparent" /></td>
                      <td className="p-0 border-l border-gray-300"><input type="text" value={row.year} onChange={e => updateEducation(index, 'year', e.target.value)} className="w-full border-0 px-4 py-2 focus:ring-2 focus:ring-inset focus:ring-emerald-500 focus:outline-none bg-transparent" /></td>
                      <td className="p-2 border-l border-gray-300 text-center">
                        <button type="button" onClick={() => removeEducationRow(index)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 border-t border-gray-300 p-2">
                <button type="button" onClick={addEducationRow} className="text-xs font-semibold text-emerald-700 flex items-center gap-1 hover:text-emerald-900 pl-2">
                  <Plus className="w-3 h-3" /> Add Row
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">8. Typing Skill</label>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {['Basic', 'Lower', 'Higher', 'High Speed', 'None'].map(skill => (
                <label key={skill} className="flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" name="typingSkill" value={skill} checked={typingSkill === skill} onChange={e => setTypingSkill(e.target.value)} className="text-emerald-600 focus:ring-emerald-500" />
                  {skill}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
             <label className="block text-sm font-semibold text-gray-900">9. Work Experience (If any)</label>
             <textarea rows={3} value={experience} onChange={e => setExperience(e.target.value)} className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>

          {/* Document Uploads */}
          <div className="space-y-4 pt-4">
            <label className="block text-sm font-semibold text-gray-900">10. Document Uploads</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Resume Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 transition-colors bg-gray-50"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('a')) {
                    resumeInputRef.current?.click();
                  }
                }}
              >
                <input 
                  type="file" 
                  ref={resumeInputRef} 
                  onChange={(e) => handleFileUpload(e, setResumeUrl)} 
                  accept=".pdf,.doc,.docx,image/*" 
                  className="hidden" 
                />
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Upload Resume / CV
                </p>
                <p className="text-xs text-gray-500">
                  {resumeUrl ? 'Document attached successfully.' : 'PDF, DOC, or Image format.'}
                </p>
                {resumeUrl && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center text-xs font-semibold text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Attached
                    </span>
                    <a href={resumeUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="View Document">
                      <Eye className="h-4 w-4" />
                    </a>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setResumeUrl(''); }} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Remove Document">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ID Proof Upload */}
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 transition-colors bg-gray-50"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (!target.closest('button') && !target.closest('a')) {
                    idProofInputRef.current?.click();
                  }
                }}
              >
                <input 
                  type="file" 
                  ref={idProofInputRef} 
                  onChange={(e) => handleFileUpload(e, setIdProofUrl)} 
                  accept=".pdf,image/*" 
                  className="hidden" 
                />
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Upload ID Proof
                </p>
                <p className="text-xs text-gray-500">
                  {idProofUrl ? 'Document attached successfully.' : 'Front side of National ID / Passport.'}
                </p>
                {idProofUrl && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex items-center text-xs font-semibold text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Attached
                    </span>
                    <a href={idProofUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded" title="View Document">
                      <Eye className="h-4 w-4" />
                    </a>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setIdProofUrl(''); }} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Remove Document">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="text-center mb-6">
               <h3 className="text-base font-bold text-gray-900 underline underline-offset-4 decoration-2 decoration-emerald-800">DECLARATION</h3>
            </div>
            
            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer mb-8">
              <input type="checkbox" checked={declaration} onChange={e => setDeclaration(e.target.checked)} className="mt-1 rounded text-emerald-600 focus:ring-emerald-500" />
              <span className="text-sm text-gray-800 font-medium">I hereby declare that the details furnished above are True and Correct.</span>
            </label>

            <div className="flex flex-col sm:flex-row justify-between items-end gap-6 text-sm font-semibold text-gray-900">
              <div className="space-y-4 w-full sm:w-1/2">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Place:</span>
                  <input type="text" value={place} onChange={e => setPlace(e.target.value)} className="flex-1 border-b border-gray-300 border-dashed focus:border-emerald-500 focus:outline-none py-1 bg-transparent" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Date:</span>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 border-b border-gray-300 border-dashed focus:border-emerald-500 focus:outline-none py-1 bg-transparent" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 w-full sm:w-1/3 mt-4 sm:mt-0 relative group">
                {signatureUrl ? (
                  <div className="relative w-full h-12 border-b border-gray-300 border-dashed flex justify-center items-end pb-1 bg-transparent">
                    <img src={signatureUrl} alt="Signature" className="max-h-full max-w-full object-contain" />
                    <button type="button" onClick={() => setSignatureUrl('')} className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-md p-1 hover:bg-red-200">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full flex items-center">
                    <input type="text" value={signature} onChange={e => setSignature(e.target.value)} placeholder="Type full name as signature" className="w-full text-center font-serif text-lg italic border-b border-gray-300 border-dashed focus:border-emerald-500 focus:outline-none py-1 bg-transparent pr-8" />
                    <button type="button" onClick={() => signatureInputRef.current?.click()} className="absolute right-0 bottom-2 text-gray-400 hover:text-emerald-600 flex flex-col items-center" title="Upload scanned signature">
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <input type="file" ref={signatureInputRef} onChange={(e) => handleFileUpload(e, setSignatureUrl)} accept="image/*" className="hidden" />
                  </div>
                )}
                <span className="text-xs text-gray-500 font-sans">Signature</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button type="submit" className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-md transition-colors w-full sm:w-auto">
              Submit Application
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
