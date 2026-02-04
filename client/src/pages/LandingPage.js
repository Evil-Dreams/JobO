import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  Zap,
  BarChart3
} from 'lucide-react';
import { siteStatsService } from '../services/siteStatsService';

const LandingPage = () => {
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);
  const [jobsTracked, setJobsTracked] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  const onGetStarted = () => {
    navigate('/login');
  };

  useEffect(() => {
    const fetchAndUpdateStats = async () => {
      try {
        // Increment user count first
        await siteStatsService.incrementUserCount();
        
        // Get updated statistics
        const stats = await siteStatsService.getSiteStats();
        
        // Animate counters from 0 to real values
        const targetUsers = stats.userCount;
        const targetJobs = stats.jobsTracked;
        const targetSuccess = stats.successRate;
        
        let currentStep = 0;
        const steps = 60; // Animation steps
        const timer = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          
          setUserCount(Math.floor(targetUsers * easeOutQuart));
          setJobsTracked(Math.floor(targetJobs * easeOutQuart));
          setSuccessRate(Math.floor(targetSuccess * easeOutQuart));
          
          if (currentStep >= steps) {
            clearInterval(timer);
            setUserCount(targetUsers);
            setJobsTracked(targetJobs);
            setSuccessRate(targetSuccess);
          }
        }, 30);
      } catch (error) {
        console.error('Error fetching site statistics:', error);
        // Set fallback values
        setUserCount(0);
        setJobsTracked(0);
        setSuccessRate(0);
      }
    };

    fetchAndUpdateStats();
  }, []);

  const features = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Track Applications',
      description: 'Keep all your job applications organized in one place'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'AI-Powered Matching',
      description: 'Get intelligent job recommendations based on your profile'
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics & Insights',
      description: 'Visualize your job search progress with detailed analytics'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smart Notifications',
      description: 'Never miss an opportunity with timely reminders'
    }
  ];

  const stats = [
    { number: userCount.toLocaleString(), label: 'Users' },
    { number: jobsTracked.toLocaleString(), label: 'Jobs Tracked' },
    { number: `${successRate}%`, label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-40">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 overflow-hidden">
                <img 
                  src="/iblis_logo.png" 
                  alt="JobO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                JobO
              </span>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onGetStarted}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              Get Started
            </motion.button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full"
                >
                  <span className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Job Tracking
                  </span>
                </motion.div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    Land Your Dream Job
                  </span>
                  <br />
                  <span className="text-slate-300">Faster & Smarter</span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed">
                  JobO helps you manage your job search with AI-powered insights, intelligent matching, and comprehensive analytics. Get organized, stay motivated, and land that perfect role.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Track/Manage Your Applications
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p className="text-3xl font-bold text-cyan-400">{stat.number}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Animated cards background */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-3xl blur-2xl" />

                <div className="relative bg-slate-900/80 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl overflow-hidden">
                  <div className="relative h-96 overflow-hidden">
                    {/* Simple Slow Conveyor Belt */}
                    <div className="animate-slow-conveyor space-y-4">
                      {/* Job cards */}
                      {[
                        { title: "Senior ML Engineer", company: "OpenAI", days: "1 day ago", status: "interview" },
                        { title: "Full Stack Developer", company: "Stripe", days: "2 days ago", status: "applied" },
                        { title: "GenAI Engineer", company: "Anthropic", days: "3 days ago", status: "offer" },
                        { title: "AI Research Scientist", company: "Google DeepMind", days: "1 day ago", status: "applied" },
                        { title: "DevOps Engineer", company: "Netflix", days: "4 days ago", status: "interview" },
                        { title: "Data Scientist", company: "Meta", days: "2 days ago", status: "applied" },
                        { title: "Cloud Architect", company: "AWS", days: "5 days ago", status: "offer" },
                        { title: "Backend Engineer", company: "Spotify", days: "1 day ago", status: "applied" },
                        { title: "Frontend Engineer", company: "Figma", days: "3 days ago", status: "interview" },
                        { title: "Product Manager", company: "Microsoft", days: "2 days ago", status: "applied" },
                        { title: "Security Engineer", company: "Cloudflare", days: "4 days ago", status: "offer" },
                        { title: "Mobile Developer", company: "Uber", days: "1 day ago", status: "applied" },
                        { title: "Blockchain Developer", company: "Coinbase", days: "3 days ago", status: "interview" },
                        { title: "QA Engineer", company: "Apple", days: "2 days ago", status: "applied" },
                        { title: "Solutions Architect", company: "Oracle", days: "5 days ago", status: "offer" },
                        { title: "ML Research Engineer", company: "Tesla", days: "1 day ago", status: "interview" },
                        { title: "React Developer", company: "Airbnb", days: "2 days ago", status: "applied" },
                        { title: "Python Developer", company: "GitHub", days: "3 days ago", status: "offer" },
                        { title: "Kubernetes Engineer", company: "Red Hat", days: "1 day ago", status: "applied" },
                        { title: "Database Administrator", company: "MongoDB", days: "4 days ago", status: "interview" },
                        { title: "Site Reliability Engineer", company: "Google", days: "2 days ago", status: "applied" },
                        { title: "Machine Learning Engineer", company: "NVIDIA", days: "3 days ago", status: "offer" },
                        { title: "Software Architect", company: "Adobe", days: "1 day ago", status: "interview" },
                        { title: "Data Engineer", company: "Snowflake", days: "2 days ago", status: "applied" },
                        // Duplicate for seamless looping
                        { title: "Senior ML Engineer", company: "OpenAI", days: "1 day ago", status: "interview" },
                        { title: "Full Stack Developer", company: "Stripe", days: "2 days ago", status: "applied" },
                        { title: "GenAI Engineer", company: "Anthropic", days: "3 days ago", status: "offer" },
                        { title: "AI Research Scientist", company: "Google DeepMind", days: "1 day ago", status: "applied" },
                        { title: "DevOps Engineer", company: "Netflix", days: "4 days ago", status: "interview" },
                        { title: "Data Scientist", company: "Meta", days: "2 days ago", status: "applied" },
                        { title: "Cloud Architect", company: "AWS", days: "5 days ago", status: "offer" },
                        { title: "Backend Engineer", company: "Spotify", days: "1 day ago", status: "applied" },
                        { title: "Frontend Engineer", company: "Figma", days: "3 days ago", status: "interview" },
                        { title: "Product Manager", company: "Microsoft", days: "2 days ago", status: "applied" },
                        { title: "Security Engineer", company: "Cloudflare", days: "4 days ago", status: "offer" },
                        { title: "Mobile Developer", company: "Uber", days: "1 day ago", status: "applied" },
                        { title: "Blockchain Developer", company: "Coinbase", days: "3 days ago", status: "interview" },
                        { title: "QA Engineer", company: "Apple", days: "2 days ago", status: "applied" },
                        { title: "Solutions Architect", company: "Oracle", days: "5 days ago", status: "offer" },
                        { title: "ML Research Engineer", company: "Tesla", days: "1 day ago", status: "interview" },
                        { title: "React Developer", company: "Airbnb", days: "2 days ago", status: "applied" },
                        { title: "Python Developer", company: "GitHub", days: "3 days ago", status: "offer" },
                        { title: "Kubernetes Engineer", company: "Red Hat", days: "1 day ago", status: "applied" },
                        { title: "Database Administrator", company: "MongoDB", days: "4 days ago", status: "interview" },
                        { title: "Site Reliability Engineer", company: "Google", days: "2 days ago", status: "applied" },
                        { title: "Machine Learning Engineer", company: "NVIDIA", days: "3 days ago", status: "offer" },
                        { title: "Software Architect", company: "Adobe", days: "1 day ago", status: "interview" },
                        { title: "Data Engineer", company: "Snowflake", days: "2 days ago", status: "applied" },
                      ].map((job, index) => (
                        <motion.div
                          key={`${job.title}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + (index % 12) * 0.05 }}
                          className="flex items-center gap-4 p-4 mx-4 bg-slate-950/80 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all backdrop-blur-sm shadow-lg"
                        >
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                            <span className="text-white font-bold text-sm">
                              {job.company.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{job.title}</p>
                            <p className="text-xs text-slate-400">{job.company} • {job.days}</p>
                          </div>
                          {job.status === 'offer' && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          )}
                          {job.status === 'interview' && (
                            <div className="w-5 h-5 rounded-full bg-amber-500 flex-shrink-0" />
                          )}
                          {job.status === 'applied' && (
                            <div className="w-5 h-5 rounded-full bg-slate-500 flex-shrink-0" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Floating element */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl opacity-20 blur-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-400">Everything you need to master your job search</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all hover:bg-slate-900/70"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 rounded-3xl p-12 text-center overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Job Search?</h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are already using JobO to land their dream jobs
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-slate-400">Have questions? We'd love to hear from you</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-sm text-slate-400 mb-4">Send us a mail anytime</p>
              <button 
                type="button"
                onClick={() => window.location.href = 'mailto:vibishan.anandhan.m@gmail.com'}
                className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                vibishan.anandhan.m@gmail.com
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Response</h3>
              <p className="text-sm text-slate-400 mb-4">We typically respond within 24 hours</p>
              <p className="text-cyan-400 font-medium">Fast Support</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Feedback</h3>
              <p className="text-sm text-slate-400 mb-4">Help us improve JobO</p>
              <p className="text-cyan-400 font-medium">Your Ideas Matter</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-slate-400 mb-4">Ready to start tracking your job applications?</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white rounded-xl font-semibold inline-flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 backdrop-blur-md mt-20 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>&copy; 2026 Evil Dreams. All rights reserved.</p>
            <div className="flex gap-6">
              <button type="button" className="hover:text-slate-300 transition-colors">Privacy</button>
              <button type="button" className="hover:text-slate-300 transition-colors">Terms</button>
              <button 
                type="button" 
                className="hover:text-slate-300 transition-colors"
                onClick={() => window.location.href = 'mailto:vibishan.anandhan.m@gmail.com'}
              >
                Contact
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
