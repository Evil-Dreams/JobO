import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Trash2,
  Upload,
  File,
  Brain,
  Loader2,
  Plus,
  Search,
  X,
  Eye
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { generateCoverLetter, analyzeResumePDF } from '../store/aiSlice';
import {
  uploadResume,
  getResumes,
  getResumeFile,
  updateResume,
  deleteResume,
  uploadCoverLetter,
  getCoverLetters,
  getCoverLetterFile,
  deleteCoverLetter
} from '../services/documentService';

export default function Documents() {
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('resumes');
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('resume');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Debouncing refs
  const editTimeoutRef = useRef(null);

  // Debounced title update function
  const handleEditTitle = useCallback((id, newTitle, type) => {
    // Clear existing timeout
    if (editTimeoutRef.current) {
      clearTimeout(editTimeoutRef.current);
    }

    // Update local state immediately for responsive UI
    if (type === 'resume') {
      setResumes(prev => prev.map(r => (r._id || r.id) === id ? { ...r, title: newTitle } : r));
    } else {
      setCoverLetters(prev => prev.map(c => (c._id || c.id) === id ? { ...c, title: newTitle } : c));
    }

    // Debounce API call
    editTimeoutRef.current = setTimeout(async () => {
      try {
        if (type === 'resume') {
          
          await updateResume(id, newTitle, '', '');
          
        }
        // Cover letters don't have update endpoint yet, so we skip API call
      } catch (error) {
        console.error('CLIENT: Failed to update title:', error);
      }
    }, 1000); // 1 second debounce
  }, []);

  // Load documents from database
  React.useEffect(() => {
    loadDocuments();
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
      }
    };
  }, []);

  const loadDocuments = async () => {
    try {
      
      
      const [resumesData, coverLettersData] = await Promise.all([
        getResumes(),
        getCoverLetters()
      ]);
      
      
      
      
      
      
      setResumes(resumesData || []);
      setCoverLetters(coverLettersData || []);
      
      
      
    } catch (error) {
      console.error('CLIENT: Failed to load documents:', error);
      console.error('CLIENT: Error details:', error.response?.data || error.message);
      setNotification({ show: true, type: 'error', message: 'Failed to load documents. Please try again.' });
    }
  };

  const handleFileUpload = async (file, type) => {
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        setNotification({ show: true, type: 'error', message: 'File size must be less than 10MB' });
        return;
      }

      // Open upload modal
      setUploadType(type);
      setUploadFile(file);
      setUploadTitle(file.name.replace('.pdf', ''));
      setUploadPreview(URL.createObjectURL(file));
      setShowUploadModal(true);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !uploadTitle.trim()) {
      setNotification({ show: true, type: 'error', message: 'Please provide a title and select a file' });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', uploadFile);
      formData.append('coverLetter', uploadFile);

      if (uploadType === 'resume') {
        const result = await uploadResume(formData, uploadTitle, '', '');
        const newResume = {
          ...result.resume,
          id: result.resume._id || result.resume.id || `resume-${Date.now()}`,
          file: uploadFile, // Keep file for immediate use
          uploadDate: result.resume.uploadDate
        };
        setResumes([...resumes, newResume]);
      } else {
        const result = await uploadCoverLetter(formData, uploadTitle, '');
        const newCoverLetter = {
          ...result.coverLetter,
          id: result.coverLetter._id || result.coverLetter.id || `coverletter-${Date.now()}`,
          file: uploadFile, // Keep file for immediate use
          uploadDate: result.coverLetter.uploadDate
        };
        setCoverLetters([...coverLetters, newCoverLetter]);
      }

      // Close modal and reset state
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadFile(null);
      if (uploadPreview) {
        URL.revokeObjectURL(uploadPreview);
        setUploadPreview(null);
      }
      
      setNotification({ show: true, type: 'success', message: `${uploadType === 'resume' ? 'Resume' : 'Cover Letter'} uploaded successfully!` });
    } catch (error) {
      console.error('Failed to upload file:', error);
      setNotification({ show: true, type: 'error', message: 'Failed to upload file. Please try again.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadCancel = () => {
    setShowUploadModal(false);
    setUploadTitle('');
    setUploadFile(null);
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
      setUploadPreview(null);
    }
  };

  const handleViewFile = async (fileData, type = 'resume') => {
    try {
      
      
      
      // Validate file data
      const fileId = fileData._id || fileData.id;
      if (!fileData || (!fileId && !fileData.file)) {
        throw new Error('Invalid file data: missing ID or file');
      }
      
      // Try to get the file from database
      let blob;
      if (fileId) {
        // Get from database using correct service
        try {
          
          if (type === 'cover-letter') {
            blob = await getCoverLetterFile(fileId);
          } else {
            blob = await getResumeFile(fileId);
          }
          
        } catch (apiError) {
          console.warn('CLIENT: Failed to fetch file from API:', apiError.message);
          if (fileData.file instanceof File) {
            
            blob = fileData.file;
          } else {
            throw new Error('File not available in database and no local file found');
          }
        }
      } else if (fileData.file instanceof File) {
        // Use local file if available
        
        blob = fileData.file;
      } else {
        throw new Error('No file data available');
      }
      
      // Create object URL and open in new tab
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      // Clean up the object URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
      
      if (!newWindow) {
        // Fallback: download the file
        const link = document.createElement('a');
        link.href = url;
        link.download = (fileData.title || 'document') + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    } catch (error) {
      console.error('CLIENT: Failed to view file:', error);
      setNotification({ show: true, type: 'error', message: `Failed to view file: ${error.message}. Please try again.` });
    }
  };

  const handleDeleteResume = async (id) => {
    try {
      
      await deleteResume(id);
      setResumes(resumes.filter(r => (r._id || r.id) !== id));
      setNotification({ show: true, type: 'success', message: 'Resume deleted successfully!' });
    } catch (error) {
      console.error('Failed to delete resume:', error);
      setNotification({ show: true, type: 'error', message: 'Failed to delete resume. Please try again.' });
    }
  };

  const handleDeleteCoverLetter = async (id) => {
    try {
      await deleteCoverLetter(id);
      setCoverLetters(coverLetters.filter(c => (c._id || c.id) !== id));
      setNotification({ show: true, type: 'success', message: 'Cover letter deleted successfully!' });
    } catch (error) {
      console.error('Failed to delete cover letter:', error);
      setNotification({ show: true, type: 'error', message: 'Failed to delete cover letter. Please try again.' });
    }
  };

  const handleDownload = async (fileData) => {
    try {
      
      
      
      
      // For database-retrieved resumes, we need to fetch the file from the server
      if (!fileData.file && (fileData._id || fileData.id)) {
        
        const blob = await getResumeFile(fileData._id || fileData.id);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileData.title + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setNotification({ show: true, type: 'success', message: 'File downloaded successfully!' });
      } else if (fileData.file instanceof File) {
        // Use local file if available
        
        const url = URL.createObjectURL(fileData.file);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileData.title + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setNotification({ show: true, type: 'success', message: 'File downloaded successfully!' });
      } else {
        throw new Error('No file data available for download');
      }
    } catch (error) {
      console.error('CLIENT: Failed to download file:', error);
      setNotification({ show: true, type: 'error', message: 'Failed to download file. Please try again.' });
    }
  };

  const handleGenerateCoverLetter = async (resumeId, jobDescription, jobRole) => {
    setIsGenerating(true);
    try {
      
      const resume = resumes.find(r => (r._id || r.id) === resumeId);
      if (!resume) {
        console.error('CLIENT: Resume not found:', resumeId);
        setNotification({ show: true, type: 'error', message: 'Resume not found' });
        return;
      }

      

      // For database-retrieved resumes, we need to fetch the file first
      let fileBlob;
      if (!resume.file && (resume._id || resume.id)) {
        
        fileBlob = await getResumeFile(resume._id || resume.id);
      } else if (resume.file instanceof File) {
        
        fileBlob = resume.file;
      } else {
        console.error('CLIENT: No file data available for cover letter generation');
        setNotification({ show: true, type: 'error', message: 'Resume file not available. Please re-upload the resume.' });
        return;
      }

      const formData = new FormData();
      formData.append('resume', fileBlob, resume.title + '.pdf');
      formData.append('jobDescription', jobDescription || '');
      formData.append('jobRole', jobRole || '');
      

      const result = await dispatch(generateCoverLetter({
        resumeData: formData,
        jobDescription: jobDescription || '',
        jobRole: jobRole || ''
      }));
      
      
      
      if (result.payload) {
        const newCoverLetter = {
          title: `Cover Letter - ${jobRole || 'Position'}`,
          content: result.payload.content || result.payload,
          generatedFor: {
            resumeId,
            jobDescription: jobDescription || '',
            jobRole: jobRole || '',
            generatedDate: new Date().toISOString()
          },
          uploadDate: new Date().toISOString(),
          type: 'cover-letter'
        };
        
        // Save to database
        try {
          const formData = new FormData();
          if (result.payload.pdfData) {
            // If AI returns PDF data, convert to blob and upload
            const response = await fetch(result.payload.pdfData);
            const blob = await response.blob();
            formData.append('coverLetter', blob, `cover-letter-${Date.now()}.pdf`);
          }
          formData.append('title', newCoverLetter.title);
          formData.append('content', newCoverLetter.content);
          
          const savedCoverLetter = await uploadCoverLetter(formData, newCoverLetter.title, newCoverLetter.content);
          
          const coverLetterWithId = {
            ...savedCoverLetter.coverLetter,
            id: savedCoverLetter.coverLetter._id || savedCoverLetter.coverLetter.id || `coverletter-${Date.now()}`,
            generatedFor: newCoverLetter.generatedFor
          };
          
          
          setCoverLetters([...coverLetters, coverLetterWithId]);
          alert('Cover letter generated and saved successfully!');
        } catch (saveError) {
          console.error('Failed to save cover letter to database:', saveError);
          // Still add to local state for immediate use
          const coverLetterWithId = {
            ...newCoverLetter,
            id: Date.now().toString()
          };
          setCoverLetters([...coverLetters, coverLetterWithId]);
          alert('Cover letter generated successfully (saved locally)');
        }
      } else {
        console.error('No payload in AI result');
        alert('Failed to generate cover letter. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      alert('Failed to generate cover letter: ' + (error.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeResume = async (resumeId, jobDescription, jobRole) => {
    setIsGenerating(true);
    try {
      
      const resume = resumes.find(r => (r._id || r.id) === resumeId);
      if (!resume) {
        console.error('CLIENT: Resume not found:', resumeId);
        setNotification({ show: true, type: 'error', message: 'Resume not found' });
        return;
      }

      

      // For database-retrieved resumes, we need to fetch the file first
      let fileBlob;
      if (!resume.file && (resume._id || resume.id)) {
        
        fileBlob = await getResumeFile(resume._id || resume.id);
      } else if (resume.file instanceof File) {
        
        fileBlob = resume.file;
      } else {
        console.error('CLIENT: No file data available for resume analysis');
        setNotification({ show: true, type: 'error', message: 'Resume file not available. Please re-upload the resume.' });
        return;
      }

      const formData = new FormData();
      formData.append('resume', fileBlob, resume.title + '.pdf');
      formData.append('jobDescription', jobDescription || '');
      formData.append('jobRole', jobRole || '');
      formData.append('targetRole', jobRole || '');

      

      const result = await dispatch(analyzeResumePDF({
        file: formData.get('resume'),
        jobDescription: jobDescription || '',
        targetRole: jobRole || ''
      }));
      
      
      
      if (result.payload) {
        setAnalysisResult(result.payload);
        setShowAnalysis(true);
      } else {
        console.error('No payload in analysis result');
        alert('Failed to analyze resume. Please try again.');
      }
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('Failed to analyze resume: ' + (error.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Filter resumes and cover letters based on search
  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resume.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  
  

  const filteredCoverLetters = coverLetters.filter(letter =>
    letter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (letter.generatedFor?.jobRole && letter.generatedFor.jobRole.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
          <p className="text-slate-400">
            Manage your resumes and cover letters in one place
          </p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveSection('resumes')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeSection === 'resumes'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Resumes ({resumes.length})
          </div>
        </button>
        <button
          onClick={() => setActiveSection('cover-letters')}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeSection === 'cover-letters'
              ? 'text-cyan-400 border-cyan-400'
              : 'text-slate-400 border-transparent hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <File className="w-4 h-4" />
            Cover Letters ({coverLetters.length})
          </div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
        <input
          type="text"
          placeholder={`Search ${activeSection === 'resumes' ? 'resumes' : 'cover letters'}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
        />
      </div>

      {/* Content */}
      {activeSection === 'resumes' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Upload Section */}
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center bg-slate-900/30">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Upload Resume</h3>
            <p className="text-slate-400 mb-6">
              Upload multiple resumes for different roles (ML, Frontend, Backend, etc.)
            </p>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={(e) => {
                Array.from(e.target.files).forEach((file, index) => {
                  handleFileUpload(file, 'resume');
                });
              }}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
              title="Upload Resume"
            >
              <Plus className="w-6 h-6" />
            </label>
          </div>

          {/* Resume Grid */}
          {filteredResumes.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-semibold text-white mb-2">No Resumes Found</h3>
              <p className="text-slate-400">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first resume to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume, index) => (
                <motion.div
                  key={resume._id || resume.id || `resume-${index}-${resume.title}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-lg"
                >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={resume.title}
                          onChange={(e) => handleEditTitle(resume._id || resume.id, e.target.value, 'resume')}
                          className="bg-transparent border-b border-slate-600 text-white focus:border-cyan-400 outline-none px-1 py-0.5 text-sm font-medium"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          {resume.size ? `${(resume.size / 1024 / 1024).toFixed(2)}MB` : 'Unknown size'}
                        </p>
                      </div>
                    </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewFile(resume, 'resume')}
                      className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors flex items-center justify-center"
                      title="View Resume"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(resume)}
                      className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center justify-center"
                      title="Download Resume"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAnalyzeResume(resume._id || resume.id, '', '')}
                      className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center"
                      title="Analyze Resume"
                    >
                      <Brain className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const jobRole = prompt('Enter job role for cover letter:', 'Software Engineer');
                        const jobDescription = prompt('Enter job description (optional):', '');
                        if (jobRole) {
                          handleGenerateCoverLetter(resume._id || resume.id, jobDescription, jobRole);
                        }
                      }}
                      className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors flex items-center justify-center"
                      title="Generate Cover Letter"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume._id || resume.id)}
                      className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors flex items-center justify-center"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Cover Letter Grid */}
          {filteredCoverLetters.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800">
              <File className="w-16 h-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-lg font-semibold text-white mb-2">No Cover Letters Found</h3>
              <p className="text-slate-400">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload existing cover letters or generate new ones from your resumes'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoverLetters.map((coverLetter, index) => (
                <motion.div
                  key={coverLetter.id || `coverletter-${index}-${coverLetter.title}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <File className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={coverLetter.title}
                          onChange={(e) => handleEditTitle(coverLetter._id || coverLetter.id, e.target.value, 'cover-letter')}
                          className="bg-transparent border-b border-slate-600 text-white focus:border-cyan-400 outline-none px-1 py-0.5 text-sm font-medium"
                        />
                        {coverLetter.generatedFor && (
                          <p className="text-xs text-slate-500 mt-1">
                            For: {coverLetter.generatedFor.jobRole || 'Position'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {coverLetter.generatedFor && (
                    <div className="mb-4 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <p className="text-xs text-cyan-400">
                        Generated on {new Date(coverLetter.generatedFor.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {coverLetter.data || coverLetter.id ? (
                      <>
                        <button
                          onClick={() => handleViewFile(coverLetter, 'cover-letter')}
                          className="w-10 h-10 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors flex items-center justify-center"
                          title="View Cover Letter"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(coverLetter)}
                          className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center justify-center"
                          title="Download Cover Letter"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="flex-1 text-center text-xs text-slate-500 px-3 py-2">No file available</span>
                    )}
                    <button
                      onClick={() => handleDeleteCoverLetter(coverLetter._id || coverLetter.id)}
                      className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors flex items-center justify-center"
                      title="Delete Cover Letter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAnalysis(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Resume Analysis Results
              </h3>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-slate-800/50 rounded-lg p-6">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {analysisResult}
                </pre>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-white">
              {activeSection === 'cover-letters' ? 'Generating Cover Letter...' : 'Analyzing Resume...'}
            </p>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleUploadCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-xl font-semibold text-white">
                Upload {uploadType === 'resume' ? 'Resume' : 'Cover Letter'}
              </h3>
              <button
                onClick={handleUploadCancel}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* File Preview */}
              {uploadPreview && (
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-3">File Preview</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{uploadFile?.name}</p>
                      <p className="text-slate-400 text-sm">
                        {(uploadFile?.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(uploadPreview, '_blank')}
                      className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      title="View file"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <button
                  onClick={handleUploadCancel}
                  disabled={isUploading}
                  className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  disabled={isUploading || !uploadTitle.trim()}
                  className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload {uploadType === 'resume' ? 'Resume' : 'Cover Letter'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400' 
              : 'bg-rose-600/20 border-rose-500/50 text-rose-400'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
