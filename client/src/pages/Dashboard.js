import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [successAnalysis, setSuccessAnalysis] = useState(null);

  useEffect(() => {
    if (!auth.token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [auth.token, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${auth.token}` };

      const [overviewRes, trendsRes, successRes] = await Promise.all([
        axios.get('/api/analytics/dashboard/overview', { headers }),
        axios.get('/api/analytics/trends/data', { headers }),
        axios.get('/api/analytics/success/analysis', { headers })
      ]);

      setDashboardData(overviewRes.data);
      setTrends(trendsRes.data.trends);
      setSuccessAnalysis(successRes.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!dashboardData) {
    return <Typography>Error loading dashboard data</Typography>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6B6B'];

  // Prepare pie chart data
  const statusData = Object.entries(dashboardData.statuses).map(([name, value]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(),
    value
  }));

  // Calculate progress towards goals
  const goalsProgress = {
    applications: dashboardData.goals.targetApplicationsPerWeek
      ? Math.min((dashboardData.thisWeekApplications / dashboardData.goals.targetApplicationsPerWeek) * 100, 100)
      : 0,
    interviews: dashboardData.goals.targetInterviewsPerMonth
      ? Math.min(((dashboardData.statuses['Interview Scheduled'] || 0) / dashboardData.goals.targetInterviewsPerMonth) * 100, 100)
      : 0,
    offers: dashboardData.goals.targetOffers
      ? Math.min(((dashboardData.statuses['Offer Received'] || 0) / dashboardData.goals.targetOffers) * 100, 100)
      : 0
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Job Search Dashboard
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Applications
              </Typography>
              <Typography variant="h4">{dashboardData.totalApplications}</Typography>
              <Typography color="success.main" sx={{ mt: 1 }}>
                +{dashboardData.thisWeekApplications} this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interviews Scheduled
              </Typography>
              <Typography variant="h4">{dashboardData.statuses['Interview Scheduled'] || 0}</Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                {dashboardData.conversionRates.applicationToInterview}% conversion
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Offers Received
              </Typography>
              <Typography variant="h4">{dashboardData.statuses['Offer Received'] || 0}</Typography>
              <Typography color="success.main" sx={{ mt: 1 }}>
                {dashboardData.conversionRates.interviewToOffer}% from interviews
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">{successAnalysis?.averageSuccessProbability || 0}%</Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }}>
                Avg probability
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Goals Progress */}
      {Object.keys(dashboardData.goals).some(key => dashboardData.goals[key]) && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Goals Progress
                </Typography>

                {dashboardData.goals.targetApplicationsPerWeek > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography>Applications per week</Typography>
                      <Typography>
                        {dashboardData.thisWeekApplications}/{dashboardData.goals.targetApplicationsPerWeek}
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={goalsProgress.applications} />
                  </Box>
                )}

                {dashboardData.goals.targetInterviewsPerMonth > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography>Interviews per month</Typography>
                      <Typography>
                        {dashboardData.statuses['Interview Scheduled'] || 0}/{dashboardData.goals.targetInterviewsPerMonth}
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={goalsProgress.interviews} />
                  </Box>
                )}

                {dashboardData.goals.targetOffers > 0 && (
                  <Box>
                    <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography>Offers target</Typography>
                      <Typography>
                        {dashboardData.statuses['Offer Received'] || 0}/{dashboardData.goals.targetOffers}
                      </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={goalsProgress.offers} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Application Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Weekly Activity Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#8884d8" name="Applications" />
                  <Line type="monotone" dataKey="interviews" stroke="#82ca9d" name="Interviews" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Companies */}
      {dashboardData.topCompanies && dashboardData.topCompanies.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Top Companies
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Applications</TableCell>
                        <TableCell align="right">Avg Success Prob.</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.topCompanies.map((company, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{company.company}</TableCell>
                          <TableCell align="right">{company.applicationCount}</TableCell>
                          <TableCell align="right">
                            {(company.avgSuccessProbability || 0).toFixed(0)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Success Probability Analysis */}
      {successAnalysis && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Chip label="High Probability" color="success" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {successAnalysis.highProbabilityApps}
                </Typography>
                <Typography color="textSecondary">75%+</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Chip label="Medium Probability" color="warning" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {successAnalysis.mediumProbabilityApps}
                </Typography>
                <Typography color="textSecondary">50-75%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Chip label="Low Probability" color="error" />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {successAnalysis.lowProbabilityApps}
                </Typography>
                <Typography color="textSecondary">&lt;50%</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary">Analyzed</Typography>
                <Typography variant="h4">{successAnalysis.totalAnalyzed}</Typography>
                <Typography color="textSecondary">applications</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;
