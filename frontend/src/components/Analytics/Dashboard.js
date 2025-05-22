import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import analyticsService from "../../services/analyticsService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
  Sankey
} from "recharts";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Container,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip as MuiTooltip,
  Tabs,
  Tab,
  Paper,
  Badge,
  Avatar,
  Skeleton,
  Box,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  Button,
  TextField,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import {
  PeopleAlt,
  Event,
  CheckCircle,
  Business,
  TrendingUp,
  Equalizer,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Refresh,
  Notifications,
  HelpOutline,
  Settings,
  CalendarToday,
  GroupWork,
  VolunteerActivism,
  ExpandMore,
  Email,
  Chat,
  Warning,
  Download,
  FilterList,
  DateRange,
  Dashboard as DashboardIcon,
  Timeline,
  Map,
  TableChart,
  InsertChart,
  MoreVert
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "./Dashboard.css";

// Custom theme with enhanced palette
const theme = createTheme({
  palette: {
    primary: {
      main: "#4e73df",
      light: "#e0e6ff",
      dark: "#2a56c6"
    },
    secondary: {
      main: "#1cc88a",
      light: "#d1f3e5",
      dark: "#17a673"
    },
    error: {
      main: "#e74a3b",
      light: "#fbe8e6",
      dark: "#be2617"
    },
    warning: {
      main: "#f6c23e",
      light: "#fef5e0",
      dark: "#d4a123"
    },
    info: {
      main: "#36b9cc",
      light: "#e0f7fa",
      dark: "#258391"
    },
    background: {
      default: "#f8f9fc",
      paper: "#ffffff"
    },
    text: {
      primary: "#5a5c69",
      secondary: "#858796"
    }
  },
  typography: {
    fontFamily: [
      'Nunito',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#2e3a4d"
    },
    h2: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#2e3a4d"
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#2e3a4d"
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: "1rem",
      color: "#6c757d"
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          boxShadow: '0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 0.5rem 2rem 0 rgba(58, 59, 69, 0.2)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.35rem',
          padding: '0.375rem 0.75rem'
        }
      }
    }
  }
});

// Chart color schemes
const COLORS = ["#4e73df", "#1cc88a", "#f6c23e", "#e74a3b", "#36b9cc", "#858796", "#6f42c1", "#fd7e14"];
const CHART_COLORS = {
  bar: "#4e73df",
  line: "#1cc88a",
  area: "#36b9cc",
  pie: COLORS,
  radial: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b']
};

// Sample data for demonstration
const sampleEventData = [
  { name: 'Jan', events: 12, volunteers: 45 },
  { name: 'Feb', events: 19, volunteers: 62 },
  { name: 'Mar', events: 15, volunteers: 58 },
  { name: 'Apr', events: 24, volunteers: 78 },
  { name: 'May', events: 18, volunteers: 65 },
  { name: 'Jun', events: 29, volunteers: 92 }
];


const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [volunteerData, setVolunteerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartType, setChartType] = useState('bar');
  const [filter, setFilter] = useState('monthly');
  
  const open = Boolean(anchorEl);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const dashboardStats = await analyticsService.getDashboardStats(token);

      setStats(dashboardStats.data);

      if (user && user.role === "Admin") {
        const volunteerAnalytics = await analyticsService.getVolunteerAnalytics(token);
        setVolunteerData(volunteerAnalytics.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (newValue, index) => {
    const newDateRange = [...dateRange];
    newDateRange[index] = newValue;
    setDateRange(newDateRange);
  };

  const handleNotificationClick = () => {
    setNotifications(0);
  };

  if (loading && !stats) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" className="dashboard-container">
          <Skeleton variant="rectangular" width="100%" height={400} animation="wave" />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" width="100%" height={150} animation="wave" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl" className="dashboard-container">
          <Paper elevation={3} sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            borderLeft: `4px solid ${theme.palette.error.main}`
          }}>
            <Typography variant="h4" gutterBottom color="error">
              Error Loading Dashboard
            </Typography>
            <Typography variant="body1" gutterBottom>
              {error}
            </Typography>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="contained" 
                color="error" 
                onClick={fetchData}
                startIcon={<Refresh />}
                sx={{ mt: 2 }}
              >
                Try Again
              </Button>
            </motion.div>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="xl" className="dashboard-container">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
              <Grid item>
                <Typography variant="h1" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DashboardIcon fontSize="large" color="primary" />
                  Volunteer Analytics Dashboard
                </Typography>
              
              </Grid>
              </Grid>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Volunteers" 
                  value={stats?.totalVolunteers || 1245} 
                  icon={<PeopleAlt fontSize="large" />}
                  color="primary"
                  trend="up"
                  trendValue="12%"
                  chartData={sampleEventData.map(item => item.volunteers)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Active Volunteers" 
                  value={stats?.activeVolunteers || 845} 
                  icon={<VolunteerActivism fontSize="large" />}
                  color="secondary"
                  trend="up"
                  trendValue="8%"
                  chartData={[45, 62, 58, 78, 65, 92]}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Total Events" 
                  value={stats?.totalEvents || 289} 
                  icon={<Event fontSize="large" />}
                  color="info"
                  trend="up"
                  trendValue="24%"
                  chartData={sampleEventData.map(item => item.events)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  title="Approved Events" 
                  value={stats?.approvedEvents || 245} 
                  icon={<CheckCircle fontSize="large" />}
                  color="success"
                  trend="up"
                  trendValue="18%"
                  chartData={[10, 15, 12, 24, 18, 29]}
                />
              </Grid>
              
            
              
              {user?.role === "Admin" && (
                <>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      title="Total NGOs" 
                      value={stats?.totalNGOs || 87} 
                      icon={<Business fontSize="large" />}
                      color="primary"
                      trend="up"
                      trendValue="7%"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <StatCard 
                      title="Active NGOs" 
                      value={stats?.activeNGOs || 72} 
                      icon={<Business fontSize="large" />}
                      color="secondary"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </motion.div>

          {/* Bottom Section */}
          {user?.role === "Admin" && (
            <Grid container spacing={4} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                      <Typography variant="h5" component="h2">
                        Volunteer Geographic Distribution
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        startIcon={<Map />}
                      >
                        View Map
                      </Button>
                    </Box>
                    
                    <ResponsiveContainer width="100%" height={400}>
                      <ScatterChart
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 20,
                          left: 20,
                        }}
                      >
                        <CartesianGrid />
                        <XAxis type="number" dataKey="x" name="Longitude" />
                        <YAxis type="number" dataKey="y" name="Latitude" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Scatter name="Volunteers" data={[
                          { x: 100, y: 200, z: 200 },
                          { x: 120, y: 100, z: 260 },
                          { x: 170, y: 300, z: 400 },
                          { x: 140, y: 250, z: 280 },
                          { x: 150, y: 400, z: 500 },
                          { x: 110, y: 280, z: 200 },
                        ]} fill={theme.palette.primary.main} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

// Enhanced Stat Card Component with Mini Chart
const StatCard = ({ title, value, icon, color = "primary", trend, trendValue, chartData }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `4px solid ${theme.palette[color].main}`,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[6]
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  textTransform: 'uppercase', 
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}
              >
                {title}
              </Typography>
              <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                {value || 0}
              </Typography>
              
              {trend && (
                <Typography 
                  variant="caption" 
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    mt: 1
                  }}
                >
                  {trend === 'up' ? (
                    <TrendingUp fontSize="inherit" sx={{ color: theme.palette.success.main }} />
                  ) : (
                    <TrendingUp fontSize="inherit" sx={{ color: theme.palette.error.main, transform: 'rotate(180deg)' }} />
                  )}
                  {trendValue}
                  <span style={{ color: theme.palette.text.secondary }}>
                    vs last period
                  </span>
                </Typography>
              )}
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Avatar
                sx={{
                  backgroundColor: alpha(theme.palette[color].main, 0.1),
                  color: theme.palette[color].main,
                  width: 56,
                  height: 56
                }}
              >
                {icon}
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
        
        {chartData && (
          <Box sx={{ height: 60, width: '100%', mt: 'auto' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData.map((value, index) => ({ value, index }))}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={theme.palette[color].main} 
                  fill={alpha(theme.palette[color].main, 0.1)} 
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Card>
    </motion.div>
  );
};

export default Dashboard;