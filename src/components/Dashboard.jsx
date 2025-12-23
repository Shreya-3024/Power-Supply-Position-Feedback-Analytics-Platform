import { motion } from 'motion/react';
import { Star, TrendingUp, Users, Award, Zap, Shield, DollarSign, Activity, CheckCircle, AlertCircle, Clock, Thermometer, Battery, Power } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { useState, useEffect } from 'react';

export function Dashboard({ isDarkMode = true }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Theme helper functions
  const getThemeColors = () => ({
    bgPrimary: isDarkMode ? '#000000' : '#f8f9fa',
    bgSecondary: isDarkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
    textPrimary: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
    borderColor: isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.3)',
    cardBg: isDarkMode ? 'linear-gradient(135deg, rgba(249, 168, 212, 0.2) 0%, rgba(251, 207, 232, 0.12) 100%)' : 'linear-gradient(135deg, rgba(249, 168, 212, 0.15) 0%, rgba(251, 207, 232, 0.2) 100%)',
    cardBg2: isDarkMode ? 'linear-gradient(135deg, rgba(251, 207, 232, 0.15) 0%, rgba(249, 168, 212, 0.08) 100%)' : 'linear-gradient(135deg, rgba(251, 207, 232, 0.18) 0%, rgba(249, 168, 212, 0.1) 100%)'
  });

  const colors = getThemeColors();
  
  // Real-time monitoring stats with dynamic updates
  const [monitoringStats, setMonitoringStats] = useState({
    totalPowerDraw: 834.1,
    powerChange: 2.5,
    voltage: 25.6,
    current: 16.5,
    avgTemperature: 39.3,
    tempChange: -0.4,
    systemEfficiency: 98.2,
    efficiencyChange: 0.1
  });

  // Power consumption history with real-time updates
  const [powerConsumptionData, setPowerConsumptionData] = useState([]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize power consumption data with current time
  useEffect(() => {
    const now = new Date();
    const initialData = [];
    for (let i = 4; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5000); // 5 seconds apart
      initialData.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        power: 780 + Math.random() * 50
      });
    }
    setPowerConsumptionData(initialData);
  }, []);

  // Update power consumption data every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerConsumptionData(prev => {
        const now = new Date();
        const newEntry = {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          power: parseFloat((800 + Math.random() * 80).toFixed(1))
        };
        
        // Keep only last 20 data points for better visualization
        const updated = [...prev, newEntry];
        return updated.slice(-20);
      });

      // Update monitoring stats with slight variations
      setMonitoringStats(prev => ({
        totalPowerDraw: parseFloat((800 + Math.random() * 80).toFixed(1)),
        powerChange: parseFloat((Math.random() * 5 - 2.5).toFixed(1)),
        voltage: parseFloat((25 + Math.random() * 2).toFixed(1)),
        current: parseFloat((15 + Math.random() * 3).toFixed(1)),
        avgTemperature: parseFloat((38 + Math.random() * 4).toFixed(1)),
        tempChange: parseFloat((Math.random() * 2 - 1).toFixed(1)),
        systemEfficiency: parseFloat((97 + Math.random() * 2).toFixed(1)),
        efficiencyChange: parseFloat((Math.random() * 0.5 - 0.2).toFixed(1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mock data for power supply reviews
  const powerSupplies = [
    {
      id: 1,
      brand: 'Corsair',
      model: 'RM850x',
      wattage: 850,
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      price: '$139.99',
      rating: 4.8,
      reviews: 2847,
      performance: 95,
      noise: 88,
      value: 92,
      position: 'Excellent'
    },
    {
      id: 2,
      brand: 'Seasonic',
      model: 'FOCUS GX-750',
      wattage: 750,
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      price: '$119.99',
      rating: 4.9,
      reviews: 1923,
      performance: 97,
      noise: 90,
      value: 94,
      position: 'Excellent'
    },
    {
      id: 3,
      brand: 'EVGA',
      model: 'SuperNOVA 1000 G6',
      wattage: 1000,
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      price: '$179.99',
      rating: 4.7,
      reviews: 1456,
      performance: 94,
      noise: 85,
      value: 89,
      position: 'Very Good'
    },
    {
      id: 4,
      brand: 'be quiet!',
      model: 'Dark Power Pro 12',
      wattage: 1200,
      efficiency: '80+ Titanium',
      modular: 'Fully Modular',
      price: '$329.99',
      rating: 4.9,
      reviews: 876,
      performance: 98,
      noise: 95,
      value: 85,
      position: 'Excellent'
    },
    {
      id: 5,
      brand: 'Thermaltake',
      model: 'Toughpower GF1',
      wattage: 650,
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      price: '$99.99',
      rating: 4.6,
      reviews: 2134,
      performance: 91,
      noise: 87,
      value: 95,
      position: 'Good'
    },
    {
      id: 6,
      brand: 'Cooler Master',
      model: 'V850 SFX Gold',
      wattage: 850,
      efficiency: '80+ Gold',
      modular: 'Fully Modular',
      price: '$159.99',
      rating: 4.5,
      reviews: 1087,
      performance: 90,
      noise: 83,
      value: 88,
      position: 'Good'
    }
  ];

  const efficiencyData = [
    { name: '80+ Bronze', count: 145, color: '#CD7F32' },
    { name: '80+ Silver', count: 89, color: '#C0C0C0' },
    { name: '80+ Gold', count: 312, color: '#FFD700' },
    { name: '80+ Platinum', count: 156, color: '#E5E4E2' },
    { name: '80+ Titanium', count: 67, color: '#878681' }
  ];

  const wattageData = [
    { name: '450-550W', reviews: 187 },
    { name: '650-750W', reviews: 423 },
    { name: '850-1000W', reviews: 298 },
    { name: '1200W+', reviews: 123 }
  ];

  const brandRatings = [
    { brand: 'Seasonic', rating: 4.8 },
    { brand: 'be quiet!', rating: 4.7 },
    { brand: 'Corsair', rating: 4.6 },
    { brand: 'EVGA', rating: 4.5 },
    { brand: 'Thermaltake', rating: 4.3 },
    { brand: 'Cooler Master', rating: 4.2 }
  ];

  const positionData = [
    { position: 'Excellent', count: 342 },
    { position: 'Very Good', count: 267 },
    { position: 'Good', count: 189 },
    { position: 'Fair', count: 87 },
    { position: 'Poor', count: 34 }
  ];

  const performanceMetrics = [
    { metric: 'Performance', value: 92 },
    { metric: 'Noise Level', value: 88 },
    { metric: 'Build Quality', value: 90 },
    { metric: 'Value', value: 85 },
    { metric: 'Reliability', value: 94 }
  ];

  const stats = [
    {
      icon: Star,
      label: 'Total Reviews',
      value: '10,323',
      trend: '+12%',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50'
    },
    {
      icon: Zap,
      label: 'PSU Models',
      value: '769',
      trend: '+24',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: '8,547',
      trend: '+18%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50'
    },
    {
      icon: Award,
      label: 'Top Rated',
      value: '156',
      trend: '4.5+ ★',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50'
    }
  ];

  const getPositionColor = (position) => {
    switch (position) {
      case 'Excellent':
        return 'text-green-500 bg-green-500/20 border-green-500/50';
      case 'Very Good':
        return 'text-blue-500 bg-blue-500/20 border-blue-500/50';
      case 'Good':
        return 'text-cyan-500 bg-cyan-500/20 border-cyan-500/50';
      case 'Fair':
        return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'Poor':
        return 'text-red-500 bg-red-500/20 border-red-500/50';
      default:
        return 'text-gray-500 bg-gray-500/20 border-gray-500/50';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bgPrimary, paddingTop: '5rem', paddingBottom: '4rem', transition: 'all 0.3s ease', color: colors.textPrimary }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <h1 style={{ fontSize: '2rem', color: colors.textPrimary, marginBottom: '0.5rem' }}>
            Feedback of <span style={{ color: '#22c55e' }}>Power Supply Position</span>
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: '1.125rem' }}>Comprehensive analysis and ratings of power supply units</p>
        </motion.div>

        {/* Top Metrics - 4 Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -8, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)' }}
              style={{
                background: colors.cardBg,
                borderRadius: '1.5rem',
                padding: '1.5rem',
                borderLeft: '5px solid #a855f7',
                boxShadow: isDarkMode ? '0 8px 32px rgba(236, 72, 153, 0.2)' : '0 8px 32px rgba(236, 72, 153, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: `1px solid ${colors.borderColor}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.15) 100%)',
                    color: '#fecdd3',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  <stat.icon className="w-6 h-6" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#fecdd3'
                  }}
                >
                  {stat.trend}
                </motion.span>
              </div>
              <h3 style={{
                color: '#f8a5d9',
                fontSize: '0.875rem',
                marginBottom: '0.5rem',
                fontWeight: '500'
              }}>
                {stat.label}
              </h3>
              <p style={{
                color: colors.textPrimary,
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* NEW: Real-Time Monitoring Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="text-2xl text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              Real-Time Power Monitoring
            </h2>
            <div className="text-green-400 text-sm font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Total Power Draw */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -8, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(249, 168, 212, 0.2) 0%, rgba(251, 207, 232, 0.12) 100%)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                borderLeft: '5px solid #a855f7',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.15) 100%)',
                    color: '#fecdd3',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fecdd3' }}
                >
                  Live
                </motion.span>
              </div>
              <div style={{ color: '#f8a5d9', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Power Draw</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}>{monitoringStats.totalPowerDraw} W</div>
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#f472b6' }}
              >
                <TrendingUp className="w-4 h-4" />
                +{monitoringStats.powerChange}%
              </motion.div>
            </motion.div>

            {/* Voltage */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.75, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -8, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.15) 0%, rgba(249, 168, 212, 0.08) 100%)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                borderLeft: '5px solid #a855f7',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.15) 100%)',
                    color: '#fecdd3',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  <Power className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fecdd3' }}
                >
                  Live
                </motion.span>
              </div>
              <div style={{ color: '#f8a5d9', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Voltage</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}>{monitoringStats.voltage} V</div>
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ fontSize: '0.875rem', color: '#f472b6' }}
              >
                Stable
              </motion.div>
            </motion.div>

            {/* Temperature */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -8, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(249, 168, 212, 0.2) 0%, rgba(251, 207, 232, 0.12) 100%)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                borderLeft: '5px solid #a855f7',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.15) 100%)',
                    color: '#fecdd3',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  <Thermometer className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fecdd3' }}
                >
                  Live
                </motion.span>
              </div>
              <div style={{ color: '#f8a5d9', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Temperature</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}>{monitoringStats.avgTemperature}°C</div>
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#f472b6' }}
              >
                <TrendingUp className="w-4 h-4 rotate-180" />
                {monitoringStats.tempChange}%
              </motion.div>
            </motion.div>

            {/* Efficiency */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.05, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.08, y: -8, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.5)' }}
              style={{
                background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.15) 0%, rgba(249, 168, 212, 0.08) 100%)',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                borderLeft: '5px solid #a855f7',
                boxShadow: '0 8px 32px rgba(236, 72, 153, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(244, 114, 182, 0.15) 100%)',
                    color: '#fecdd3',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  <Battery className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ fontSize: '0.75rem', fontWeight: '600', color: '#fecdd3' }}
                >
                  Live
                </motion.span>
              </div>
              <div style={{ color: '#f8a5d9', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '500' }}>Efficiency</div>
              <div style={{ fontSize: '2rem', color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}>{monitoringStats.systemEfficiency}%</div>
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#f472b6' }}
              >
                <TrendingUp className="w-4 h-4" />
                +{monitoringStats.efficiencyChange}%
              </motion.div>
            </motion.div>
          </div>

          {/* Power Consumption Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/50 border border-green-500/20 rounded-xl p-6 shadow-lg shadow-pink-500/20"
          >
            <h3 className="text-lg text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Power Consumption Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={powerConsumptionData}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPower)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Charts Section - 2x2 Bento Box Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Power Supply Position Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
            style={{
              background: 'linear-gradient(135deg, rgba(249, 168, 212, 0.15) 0%, rgba(251, 207, 232, 0.08) 100%)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield className="w-5 h-5" style={{ color: '#a855f7' }} />
              Power Supply Position Ratings
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="position" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Metrics Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.65, type: 'spring', stiffness: 100 }}
            style={{
              background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.15) 0%, rgba(249, 168, 212, 0.08) 100%)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity className="w-5 h-5" style={{ color: '#a855f7' }} />
              Average Performance Metrics
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={performanceMetrics}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                <Radar name="Performance" dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                  labelStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Efficiency Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
            style={{
              background: 'linear-gradient(135deg, rgba(249, 168, 212, 0.15) 0%, rgba(251, 207, 232, 0.08) 100%)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield className="w-5 h-5" style={{ color: '#a855f7' }} />
              Efficiency Ratings Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Wattage Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.95, type: 'spring', stiffness: 100 }}
            style={{
              background: 'linear-gradient(135deg, rgba(251, 207, 232, 0.15) 0%, rgba(249, 168, 212, 0.08) 100%)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', color: 'white', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity className="w-5 h-5" style={{ color: '#a855f7' }} />
              Reviews by Wattage
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={wattageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #a855f7' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="reviews" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Brand Ratings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 border border-green-500/20 rounded-xl p-6 shadow-lg shadow-pink-500/20 mb-12"
        >
          <h3 className="text-xl text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Rated Brands
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={brandRatings} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" />
              <YAxis dataKey="brand" type="category" stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #10b981' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="rating" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Rated PSUs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h2 style={{ fontSize: '1.875rem', color: 'white', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Star className="w-7 h-7" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
            Top Rated Power Supplies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {powerSupplies.map((psu, index) => {
              const getPositionBadgeStyle = (position) => {
                switch (position) {
                  case 'Excellent':
                    return { color: '#22c55e', borderColor: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)' };
                  case 'Very Good':
                    return { color: '#3b82f6', borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' };
                  case 'Good':
                    return { color: '#06b6d4', borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)' };
                  default:
                    return { color: '#9ca3af', borderColor: '#9ca3af', backgroundColor: 'rgba(156, 163, 175, 0.1)' };
                }
              };

              return (
                <motion.div
                  key={psu.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05, y: -8, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)' }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 168, 212, 0.12) 0%, rgba(251, 207, 232, 0.06) 100%)',
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(236, 72, 153, 0.25)',
                    boxShadow: '0 8px 24px rgba(236, 72, 153, 0.12)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {/* Brand and Model */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: '600', marginBottom: '0.25rem' }}>{psu.brand}</h3>
                    <p style={{ fontSize: '1.125rem', color: 'white' }}>{psu.model}</p>
                  </div>

                  {/* Rating and Position */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Star className="w-5 h-5" style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      <span style={{ color: 'white', fontSize: '1.125rem' }}>{psu.rating}</span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', border: `1px solid ${getPositionBadgeStyle(psu.position).borderColor}`, ...getPositionBadgeStyle(psu.position) }}>
                      <Zap className="w-4 h-4" />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Position: {psu.position}</span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: 'white' }}>{psu.wattage}W</span>
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: 'white' }}>Efficiency: </span>
                      <span style={{ color: '#22c55e', fontWeight: '600' }}>{psu.efficiency}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: 'white', fontWeight: '600' }}>{psu.modular}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <span style={{ color: 'white' }}>Reviews: {psu.reviews.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'white' }}>Performance</span>
                        <span style={{ color: '#22c55e', fontWeight: '500' }}>{psu.performance}%</span>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(71, 85, 105, 0.5)', borderRadius: '9999px', height: '0.625rem' }}>
                        <div 
                          style={{ 
                            background: '#22c55e',
                            height: '0.625rem',
                            borderRadius: '9999px',
                            transition: 'all 0.5s ease',
                            width: `${psu.performance}%`
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'white' }}>Noise Level</span>
                        <span style={{ color: '#3b82f6', fontWeight: '500' }}>{psu.noise}%</span>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(71, 85, 105, 0.5)', borderRadius: '9999px', height: '0.625rem' }}>
                        <div 
                          style={{ 
                            background: '#3b82f6',
                            height: '0.625rem',
                            borderRadius: '9999px',
                            transition: 'all 0.5s ease',
                            width: `${psu.noise}%`
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
                        <span style={{ color: 'white' }}>Value</span>
                        <span style={{ color: '#a855f7', fontWeight: '500' }}>{psu.value}%</span>
                      </div>
                      <div style={{ width: '100%', background: 'rgba(71, 85, 105, 0.5)', borderRadius: '9999px', height: '0.625rem' }}>
                        <div 
                          style={{ 
                            background: '#a855f7',
                            height: '0.625rem',
                            borderRadius: '9999px',
                            transition: 'all 0.5s ease',
                            width: `${psu.value}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price and Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(71, 85, 105, 0.5)' }}>
                    <span style={{ fontSize: '1.5rem', color: '#22c55e', fontWeight: 'bold' }}>{psu.price}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert(`Viewing details for ${psu.brand} ${psu.model}\n\nWattage: ${psu.wattage}W\nEfficiency: ${psu.efficiency}\nRating: ${psu.rating}/5\nReviews: ${psu.reviews}`)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: 'transparent',
                        border: '2px solid #22c55e',
                        color: '#22c55e',
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}