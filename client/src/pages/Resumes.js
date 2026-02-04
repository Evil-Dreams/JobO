import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Alert,
  Snackbar,
} from '@mui/material';
import {
  MoreVert,
  Download,
  Delete,
  Star,
  CloudUpload,
  PictureAsPdf,
} from '@mui/icons-material';
import ProfessionalLayout from '../components/ProfessionalLayout';
import { uploadResume, getResumes, deleteResume } from '../store/userSlice';

const Resumes = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { resumes, isLoading } = useSelector(state => state.user);

  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeName, setResumeName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(getResumes());
  }, [dispatch]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setResumeName(file.name.replace(/\.[^/.]+$/, ''));
        setOpenDialog(true);
      } else {
        setErrorMessage('Please upload a PDF or DOCX file');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !resumeName) {
      setErrorMessage('Resume name is required');
      return;
    }

    setUploading(true);
    try {
      await dispatch(uploadResume({
        resumeFile: selectedFile,
        metadata: {
          title: resumeName,
          targetRole: targetRole || 'General',
          isPrimary: isPrimary
        }
      })).unwrap();

      setSuccessMessage('Resume uploaded successfully!');
      setOpenDialog(false);
      setResumeName('');
      setTargetRole('');
      setIsPrimary(false);
      setSelectedFile(null);
    } catch (err) {
      setErrorMessage(err || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await dispatch(deleteResume(resumeId)).unwrap();
      setSuccessMessage('Resume deleted successfully!');
      setAnchorEl(null);
    } catch (err) {
      setErrorMessage(err || 'Failed to delete resume');
    }
  };

  const handleDownload = (resume) => {
    const link = document.createElement('a');
    link.href = resume.filePath;
    link.download = resume.fileName;
    link.click();
  };

  const handleMenuOpen = (event, resume) => {
    setAnchorEl(event.currentTarget);
    setSelectedResume(resume);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedResume(null);
  };

  if (isLoading && resumes.length === 0) {
    return (
      <ProfessionalLayout>
        <Box sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <PictureAsPdf sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                  Resumes
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Manage your resumes for different job roles
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Upload Button */}
          <Box sx={{ mb: 4, display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                {resumes?.length || 0} resume(s) uploaded
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }
              }}
            >
              Upload Resume
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf,.docx"
              onChange={handleFileSelect}
            />
          </Box>

          {/* Resumes Grid */}
          <Grid container spacing={3}>
            {resumes && resumes.length > 0 ? (
              resumes.map((resume) => (
                <Grid item xs={12} sm={6} md={4} key={resume._id}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(15, 23, 42, 0.5)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 1 }}>
                            {resume.title}
                          </Typography>
                          <Chip
                            label={resume.targetRole}
                            size="small"
                            sx={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              color: '#3b82f6',
                              mb: 2
                            }}
                          />
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, resume)}
                          sx={{ color: '#64748b' }}
                        >
                          <MoreVert fontSize="small" />
                        </IconButton>
                      </Box>

                      <Box sx={{ space: 'y-2' }}>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                          <strong>File:</strong> {resume.fileName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                          <strong>Size:</strong> {resume.fileSize}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                          <strong>Uploaded:</strong> {new Date(resume.uploadedAt).toLocaleDateString()}
                        </Typography>
                      </Box>

                      {resume.isPrimary && (
                        <Box sx={{ mb: 2 }}>
                          <Chip
                            icon={<Star />}
                            label="Primary"
                            size="small"
                            sx={{
                              background: 'rgba(251, 191, 36, 0.1)',
                              color: '#fbbf24'
                            }}
                          />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          fullWidth
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownload(resume)}
                          sx={{
                            color: '#3b82f6',
                            borderColor: '#3b82f6',
                            '&:hover': { background: 'rgba(59, 130, 246, 0.05)' }
                          }}
                          variant="outlined"
                        >
                          Download
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Card
                  sx={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    p: 4,
                    textAlign: 'center'
                  }}
                >
                  <PictureAsPdf sx={{ fontSize: 64, color: '#64748b', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1 }}>
                    No resumes yet
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Upload your first resume to get started
                  </Typography>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Upload Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Upload Resume</DialogTitle>
            <DialogContent sx={{ pt: 3, space: 'y-3' }}>
              <TextField
                fullWidth
                label="Resume Name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="e.g., Frontend Engineer Resume"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Target Role"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Frontend Developer"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <input
                  type="checkbox"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  id="setPrimary"
                />
                <label htmlFor="setPrimary" style={{ color: '#64748b', cursor: 'pointer' }}>
                  Set as primary resume
                </label>
              </Box>
              {selectedFile && (
                <Alert severity="info">
                  Selected: {selectedFile.name}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                variant="contained"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleDelete(selectedResume._id);
                handleMenuClose();
              }}
            >
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>

          {/* Snackbars */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={4000}
            onClose={() => setSuccessMessage('')}
            message={successMessage}
          />
          <Snackbar
            open={!!errorMessage}
            autoHideDuration={4000}
            onClose={() => setErrorMessage('')}
          >
            <Alert severity="error">{errorMessage}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default Resumes;
