import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  WorkOutline,
  Description,
  Article,
  Psychology,
  Person,
  Logout,
  Menu as MenuIcon,
  Add,
  Notifications,
  Settings,
  Analytics,
  TrendingUp,
} from '@mui/icons-material';
import { logout } from '../store/authSlice';

const drawerWidth = 280;

const ProfessionalLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', badge: null },
    { text: 'Applications', icon: <WorkOutline />, path: '/applications', badge: null },
    { text: 'Resumes', icon: <Description />, path: '/resumes', badge: null },
    { text: 'Resume Analyzer', icon: <Analytics />, path: '/resume-analyzer', badge: 'AI' },
    { text: 'Cover Letters', icon: <Article />, path: '/cover-letters', badge: 'AI' },
    { text: 'Interview Prep', icon: <Psychology />, path: '/interview-prep', badge: 'AI' },
    { text: 'Success Analyzer', icon: <TrendingUp />, path: '/success-analyzer', badge: 'AI' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#020617' }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
            }}
          >
            J
          </Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 800, 
            background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em' 
          }}>
            JobO
          </Typography>
        </Box>
      </Box>

      {/* Quick Add */}
      <Box sx={{ px: 3, mb: 3 }}>
        <ListItemButton
          onClick={() => navigate('/applications/add')}
          sx={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
            color: '#fff',
            borderRadius: 2.5,
            py: 1.5,
            transition: 'all 0.25s ease',
            '&:hover': { 
              background: 'linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 10px 20px -8px rgba(6, 182, 212, 0.5)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
            <Add />
          </ListItemIcon>
          <ListItemText 
            primary="New Application" 
            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }} 
          />
        </ListItemButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 2.5 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.text} title={item.text} placement="right" disableHoverListener={!isMobile}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2.5,
                mb: 1,
                py: 1.5,
                bgcolor: isActive(item.path) ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                color: isActive(item.path) ? '#22d3ee' : '#94a3b8',
                borderLeft: isActive(item.path) ? '3px solid #06b6d4' : '3px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: isActive(item.path) ? 'rgba(6, 182, 212, 0.15)' : 'rgba(148, 163, 184, 0.08)',
                  transform: 'translateX(4px)',
                  color: '#22d3ee',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive(item.path) ? '#22d3ee' : '#64748b',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path) ? 700 : 500,
                  fontSize: '0.9375rem',
                }}
              />
              {item.badge && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    color: '#fff',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ mx: 2.5, borderColor: 'rgba(148, 163, 184, 0.1)' }} />

      {/* Profile */}
      <Box sx={{ p: 2.5 }}>
        <ListItemButton
          onClick={() => navigate('/profile')}
          sx={{
            borderRadius: 2.5,
            py: 1.5,
            bgcolor: isActive('/profile') ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: isActive('/profile') ? 'rgba(6, 182, 212, 0.15)' : 'rgba(148, 163, 184, 0.08)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
              fontSize: '1rem',
              fontWeight: 700,
              mr: 1.5,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#f8fafc' }} noWrap>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8125rem' }} noWrap>
              {user?.email}
            </Typography>
          </Box>
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'rgba(2, 6, 23, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ color: '#f8fafc' }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
                  }}
                >
                  J
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.01em' 
                }}>
                  JobO
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#22d3ee' } }}>
                <Badge badgeContent={0} color="error">
                  <Notifications sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              borderRight: '1px solid rgba(148, 163, 184, 0.1)',
              bgcolor: '#020617',
              boxShadow: isMobile ? '0 10px 40px -10px rgb(0 0 0 / 0.5)' : 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: '64px', md: 0 },
          minHeight: '100vh',
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
        }}
      >
        {children}
      </Box>

      {/* Mobile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ 
          sx: { 
            minWidth: 200, 
            mt: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 10px 40px -10px rgb(0 0 0 / 0.5)',
          } 
        }}
      >
        <MenuItem 
          onClick={() => { navigate('/profile'); setAnchorEl(null); }}
          sx={{ py: 1.5, px: 2, borderRadius: 2, mx: 1, fontWeight: 500, color: '#f8fafc' }}
        >
          <Person sx={{ mr: 2, fontSize: 20, color: '#94a3b8' }} /> Profile
        </MenuItem>
        <MenuItem 
          onClick={() => { navigate('/profile'); setAnchorEl(null); }}
          sx={{ py: 1.5, px: 2, borderRadius: 2, mx: 1, fontWeight: 500, color: '#f8fafc' }}
        >
          <Settings sx={{ mr: 2, fontSize: 20, color: '#94a3b8' }} /> Settings
        </MenuItem>
        <Divider sx={{ my: 1, borderColor: 'rgba(148, 163, 184, 0.1)' }} />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ py: 1.5, px: 2, borderRadius: 2, mx: 1, color: '#f87171', fontWeight: 600 }}
        >
          <Logout sx={{ mr: 2, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfessionalLayout;
