import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert,
  Download,
  Delete,
  Star,
  StarBorder,
  CloudUpload,
  InsertDriveFile,
  PictureAsPdf,
} from '@mui/icons-material';
import ProfessionalLayout from '../components/ProfessionalLayout';

const Resumes = () => {
  const fileInputRef = useRef(null);
  const [resumes, setResumes] = useState([
    {
      id: 1,
      name: 'Software Engineer Resume',
      fileName: 'resume_swe.pdf',
      fileType: 'pdf',
      fileSize: '245 KB',
      targetRole: 'Software Engineer',
      uploadDate: '2026-01-15',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Frontend Developer Resume',
      fileName: 'frontend_resume.docx',
      fileType: 'docx',
      fileSize: '189 KB',
      targetRole: 'Frontend Developer',
      uploadDate: '2026-01-10',
      isDefault: false,
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setResumeName(file.name.replace(/\.[^/.]+$/, ''));
        setOpenDialog(true);
      } else {
        alert('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !resumeName) return;

    setUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newResume = {
      id: Date.now(),
      name: resumeName,
      fileName: selectedFile.name,
      fileType: selectedFile.name.endsWith('.pdf') ? 'pdf' : 'docx',
      fileSize: `${Math.round(selectedFile.size / 1024)} KB`,
      targetRole: targetRole || 'General',
      uploadDate: new Date().toISOString().split('T')[0],
      isDefault: resumes.length === 0,
    };

    setResumes([newResume, ...resumes]);
    setUploading(false);
    setOpenDialog(false);
    setSelectedFile(null);
    setResumeName('');
    setTargetRole('');
  };

  const handleMenuOpen = (e, resume) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedResume(resume);
  };

  const handleSetDefault = () => {
    setResumes(resumes.map((r) => ({ ...r, isDefault: r.id === selectedResume?.id })));
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setResumes(resumes.filter((r) => r.id !== selectedResume?.id));
    setAnchorEl(null);
  };

  const getFileIcon = (type) => {
    if (type === 'pdf') {
      return <PictureAsPdf sx={{ fontSize: 32, color: '#ef4444' }} />;
    }
    return <InsertDriveFile sx={{ fontSize: 32, color: '#3b82f6' }} />;
  };

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl" disableGutters>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 0.5 }}>
                My Resumes
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                Upload and manage your resume files (PDF, DOCX)
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                },
              }}
            >
              Upload Resume
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf,.docx"
              onChange={handleFileSelect}
            />
          </Box>

          {/* Resume Grid */}
          <Grid container spacing={3}>
            {resumes.map((resume) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={resume.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.3)',
                      borderColor: 'rgba(6, 182, 212, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: resume.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getFileIcon(resume.fileType)}
                      </Box>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, resume)} sx={{ color: '#94a3b8' }}>
                        <MoreVert />
                      </IconButton>
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#f8fafc' }} noWrap>
                      {resume.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }} noWrap>
                      {resume.fileName}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip
                        label={resume.fileType.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: resume.fileType === 'pdf' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                          color: resume.fileType === 'pdf' ? '#f87171' : '#60a5fa',
                          fontWeight: 500,
                        }}
                      />
                      <Chip 
                        label={resume.fileSize} 
                        size="small" 
                        variant="outlined" 
                        sx={{ 
                          borderColor: 'rgba(148, 163, 184, 0.3)', 
                          color: '#94a3b8' 
                        }} 
                      />
                      {resume.isDefault && (
                        <Chip
                          icon={<Star sx={{ fontSize: 14 }} />}
                          label="Default"
                          size="small"
                          sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}
                        />
                      )}
                    </Box>

                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 2 }}>
                      Target: {resume.targetRole} • {resume.uploadDate}
                    </Typography>

                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download />}
                      size="small"
                      sx={{
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        '&:hover': {
                          borderColor: '#06b6d4',
                          color: '#22d3ee',
                          bgcolor: 'rgba(6, 182, 212, 0.1)',
                        },
                      }}
                    >
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {/* Upload Card */}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  height: '100%',
                  minHeight: 280,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed rgba(148, 163, 184, 0.3)',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: '#06b6d4',
                    bgcolor: 'rgba(6, 182, 212, 0.05)',
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <CloudUpload sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500, color: '#94a3b8', mb: 0.5 }}>
                    Upload Resume
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    PDF or DOCX (Max 5MB)
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleSetDefault}>
              <StarBorder sx={{ mr: 1.5, fontSize: 20 }} /> Set as Default
            </MenuItem>
            <MenuItem onClick={() => setAnchorEl(null)}>
              <Download sx={{ mr: 1.5, fontSize: 20 }} /> Download
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1.5, fontSize: 20 }} /> Delete
            </MenuItem>
          </Menu>

          {/* Upload Dialog */}
          <Dialog open={openDialog} onClose={() => !uploading && setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogContent>
              {uploading && <LinearProgress sx={{ mb: 2 }} />}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: 2,
                  mb: 3,
                  mt: 1,
                }}
              >
                {selectedFile?.name.endsWith('.pdf') ? (
                  <PictureAsPdf sx={{ fontSize: 40, color: '#f87171' }} />
                ) : (
                  <InsertDriveFile sx={{ fontSize: 40, color: '#60a5fa' }} />
                )}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                    {selectedFile?.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                    {selectedFile && `${Math.round(selectedFile.size / 1024)} KB`}
                  </Typography>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Resume Name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="e.g., Software Engineer Resume"
              />

              <TextField
                fullWidth
                label="Target Role (Optional)"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Frontend Developer"
              />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => setOpenDialog(false)} 
                disabled={uploading}
                sx={{ color: '#94a3b8' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading || !resumeName}
                sx={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                  },
                }}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default Resumes;
