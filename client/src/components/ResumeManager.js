import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Trash2,
  Edit2,
  Upload,
  File,
  Brain,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { generateCoverLetter, analyzeResume } from '../store/aiSlice';

export function ResumeManager({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('resumes');
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Load resumes from localStorage
  React.useEffect(() => {
    const savedResumes = localStorage.getItem('jobo-resumes');
    const savedCoverLetters = localStorage.getItem('jobo-cover-letters');
    
    if (savedResumes) {
      try {
        const parsedResumes = JSON.parse(savedResumes);
        // Note: File objects can't be stored in localStorage, so we only store metadata
        // Files will need to be re-uploaded after page refresh
        setResumes(parsedResumes);
      } catch (error) {
        console.error('Failed to load resumes:', error);
      }
    }
    
    if (savedCoverLetters) {
      try {
        const parsedCoverLetters = JSON.parse(savedCoverLetters);
        setCoverLetters(parsedCoverLetters);
      } catch (error) {
        console.error('Failed to load cover letters:', error);
      }
    }
  }, []);

  // Save to localStorage (metadata only)
  const saveResumes = (newResumes) => {
    setResumes(newResumes);
    // Only store metadata, not File objects
    const metadataOnly = newResumes.map(resume => ({
      id: resume.id,
      name: resume.name,
      title: resume.title,
      uploadDate: resume.uploadDate,
      type: resume.type,
      size: resume.size,
      // Don't store the File object
      hasFile: !!resume.file
    }));
    localStorage.setItem('jobo-resumes', JSON.stringify(metadataOnly));
  };

  const saveCoverLetters = (newCoverLetters) => {
    setCoverLetters(newCoverLetters);
    // Only store metadata, not File objects
    const metadataOnly = newCoverLetters.map(letter => ({
      id: letter.id,
      title: letter.title,
      content: letter.content,
      generatedFor: letter.generatedFor,
      uploadDate: letter.uploadDate,
      type: letter.type,
      // Don't store File objects or large data
      hasData: !!letter.data
    }));
    localStorage.setItem('jobo-cover-letters', JSON.stringify(metadataOnly));
  };

  const handleFileUpload = async (file, type) => {
    if (file && file.type === 'application/pdf') {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      const fileData = {
        id: Date.now().toString(),
        name: file.name,
        title: file.name.replace('.pdf', ''),
        file: file, // Store actual File object instead of base64
        uploadDate: new Date().toISOString(),
        type: type,
        size: file.size
      };

      if (type === 'resume') {
        saveResumes([...resumes, fileData]);
      } else {
        saveCoverLetters([...coverLetters, fileData]);
      }
    }
  };

  const handleDeleteResume = (id) => {
    saveResumes(resumes.filter(r => r.id !== id));
  };

  const handleDeleteCoverLetter = (id) => {
    saveCoverLetters(coverLetters.filter(c => c.id !== id));
  };

  const handleEditTitle = (id, newTitle, type) => {
    if (type === 'resume') {
      saveResumes(resumes.map(r => r.id === id ? { ...r, title: newTitle } : r));
    } else {
      saveCoverLetters(coverLetters.map(c => c.id === id ? { ...c, title: newTitle } : c));
    }
  };

  const handleDownload = (fileData) => {
    if (fileData.file instanceof File) {
      // Create download link for File object
      const url = URL.createObjectURL(fileData.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileData.title + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (fileData.data) {
      // Handle legacy base64 data
      const link = document.createElement('a');
      link.href = fileData.data;
      link.download = fileData.title + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateCoverLetter = async (resumeId, jobDescription, jobRole) => {
    setIsGenerating(true);
    try {
      const resume = resumes.find(r => r.id === resumeId);
      if (!resume) return;

      // Create FormData for file upload
      const formData = new FormData();
      if (resume.file instanceof File) {
        formData.append('resume', resume.file);
      } else if (resume.data) {
        // Convert base64 back to blob for legacy files
        const response = await fetch(resume.data);
        const blob = await response.blob();
        formData.append('resume', blob, resume.name);
      }
      formData.append('jobDescription', jobDescription || '');
      formData.append('jobRole', jobRole || '');

      // Use FormData API call for cover letter generation
      const result = await dispatch(generateCoverLetter({
        resumeData: formData,
        jobDescription: jobDescription || '',
        jobRole: jobRole || ''
      }));
      
      if (result.payload) {
        const newCoverLetter = {
          id: Date.now().toString(),
          title: `Cover Letter - ${jobRole || 'Position'}`,
          content: result.payload.content || result.payload,
          generatedFor: {
            resumeId,
            jobDescription: jobDescription || '',
            jobRole: jobRole || '',
            generatedDate: new Date().toISOString()
          },
          data: result.payload.pdfData || result.payload,
          uploadDate: new Date().toISOString(),
          type: 'cover-letter'
        };
        
        saveCoverLetters([...coverLetters, newCoverLetter]);
      }
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeResume = async (resumeId, jobDescription, jobRole) => {
    setIsGenerating(true);
    try {
      const resume = resumes.find(r => r.id === resumeId);
      if (!resume) return;

      // Create FormData for file upload
      const formData = new FormData();
      if (resume.file instanceof File) {
        formData.append('resume', resume.file);
      } else if (resume.data) {
        // Convert base64 back to blob for legacy files
        const response = await fetch(resume.data);
        const blob = await response.blob();
        formData.append('resume', blob, resume.name);
      }
      formData.append('jobDescription', jobDescription || '');
      formData.append('jobRole', jobRole || '');

      // Use FormData API call
      const result = await dispatch(analyzeResumePDF({
        file: formData.get('resume'),
        jobDescription: jobDescription || '',
        targetRole: jobRole || ''
      }));
      
      if (result.payload) {
        setAnalysisResult(result.payload);
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Resume & Cover Letter Manager
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'resumes'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Resumes ({resumes.length})
              </button>
              <button
                onClick={() => setActiveTab('cover-letters')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'cover-letters'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cover Letters ({coverLetters.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'resumes' ? (
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-300 mb-2">Upload Resume PDF</p>
                    <p className="text-xs text-slate-500 mb-4">
                      Upload multiple resumes for different roles (ML, Frontend, Backend, etc.)
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      multiple
                      onChange={(e) => {
                        Array.from(e.target.files).forEach(file => {
                          handleFileUpload(file, 'resume');
                        });
                      }}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Files
                    </label>
                  </div>

                  {/* Resume List */}
                  <div className="space-y-3">
                    {resumes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No resumes uploaded yet</p>
                        <p className="text-sm">Upload your first resume to get started</p>
                      </div>
                    ) : (
                      resumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-5 h-5 text-emerald-400" />
                                <div>
                                  <input
                                    type="text"
                                    value={resume.title}
                                    onChange={(e) => handleEditTitle(resume.id, e.target.value, 'resume')}
                                    className="bg-transparent border-b border-slate-600 text-white focus:border-cyan-400 outline-none px-1 py-0.5 text-sm"
                                  />
                                  <p className="text-xs text-slate-500">
                                    {resume.size ? `Size: ${(resume.size / 1024 / 1024).toFixed(2)}MB • ` : ''}
                                    Uploaded {new Date(resume.uploadDate).toLocaleDateString()}
                                  </p>
                                  {!resume.file && !resume.data && (
                                    <p className="text-xs text-amber-400 mt-1">
                                      ⚠️ File needs to be re-uploaded after page refresh
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {resume.file || resume.data ? (
                                <>
                                  <button
                                    onClick={() => handleDownload(resume)}
                                    className="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleAnalyzeResume(resume.id, '', '')}
                                    className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                                    title="Analyze"
                                  >
                                    <Brain className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-amber-400 px-2">Re-upload needed</span>
                              )}
                              <button
                                onClick={() => handleDeleteResume(resume.id)}
                                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cover Letter List */}
                  <div className="space-y-3">
                    {coverLetters.map((coverLetter) => (
                      <div
                        key={coverLetter.id}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-purple-400" />
                              <div>
                                <p className="text-white font-medium">{coverLetter.title}</p>
                                <p className="text-xs text-slate-500">
                                  {coverLetter.generatedFor ? 
                                    `Generated for: ${coverLetter.generatedFor.jobRole}` 
                                    : `Uploaded ${new Date(coverLetter.uploadDate).toLocaleDateString()}`
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownload(coverLetter)}
                              className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCoverLetter(coverLetter.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Modal */}
            <AnimatePresence>
              {showAnalysis && analysisResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                  onClick={() => setShowAnalysis(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        Resume Analysis
                      </h3>
                      <button
                        onClick={() => setShowAnalysis(false)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                        {analysisResult}
                      </pre>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
                  <p className="text-white">
                    {activeTab === 'cover-letters' ? 'Generating Cover Letter...' : 'Analyzing Resume...'}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
