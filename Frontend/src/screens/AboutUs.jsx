import React, { useState, useEffect } from 'react';
import { Building, Globe, BookOpen, Users, School, Sparkles, Target, Zap, Shield, Award, Heart, Code, Rocket, Star } from 'lucide-react';
import { motion } from 'framer-motion';

import BentoCard from '../components/about/BentoCard';
import StatCard from '../components/about/StatCard';
import DeveloperCard from '../components/about/DeveloperCard';
import UniversityCard from '../components/about/UniversityCard';

import iitLogo from '../assets/iit_logo.png';
import nitLogo from '../assets/nit_logo.png';
import bitsLogo from '../assets/bits_logo.png';
import cuLogo from '../assets/cu_logo.png';
import lpuLogo from '../assets/lpu_logo.png';

const defaultDevelopers = [
  { login: 'Shivansu77', name: 'Shivansu Bisht', avatar_url: 'https://github.com/Shivansu77.png', bio: 'Full Stack Developer', location: 'India' },
  { login: 'Shubh058', name: 'Shubham', avatar_url: 'https://github.com/Shubh058.png', bio: 'Frontend Developer', location: 'India' },
  { login: 'Rohitsingh1302', name: 'Rohit Singh', avatar_url: 'https://github.com/Rohitsingh1302.png', bio: 'Backend Developer', location: 'India' }
];

const AboutUs = () => {
  const [developers, setDevelopers] = useState(defaultDevelopers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const usernames = defaultDevelopers.map((dev) => dev.login);
      try {
        const results = await Promise.allSettled(
          usernames.map(async (username) => {
            const response = await fetch(`https://api.github.com/users/${username}`, {
              headers: {
                Accept: 'application/vnd.github+json'
              }
            });
            if (!response.ok) throw new Error(`Failed to fetch ${username}`);
            return response.json();
          })
        );

        const merged = results.map((result, index) => (
          result.status === 'fulfilled'
            ? { ...defaultDevelopers[index], ...result.value }
            : defaultDevelopers[index]
        ));

        setDevelopers(merged);
      } catch (error) {
        console.warn('Falling back to local developer data:', error);
        setDevelopers(defaultDevelopers);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 pt-4 px-4">

      {/* Hero Section - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-4xl mx-auto py-8"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10"></div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 px-4 py-2 rounded-full mb-6"
        >
          <Sparkles size={16} className="text-blue-500" />
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Transforming Education</span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
          <span className="text-gray-800 dark:text-gray-100">Empowering India's</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">Digital Campus</span>
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
          The AICTE Unified Curriculum Portal revolutionizes technical education with 
          <span className="text-blue-600 dark:text-blue-400 font-bold"> AI-powered</span> curriculum management,
          <span className="text-purple-600 dark:text-purple-400 font-bold"> real-time</span> collaboration, and
          <span className="text-pink-600 dark:text-pink-400 font-bold"> seamless</span> integration.
        </p>

        {/* Quick Stats Row */}
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { value: '1000+', label: 'Institutions', icon: Building, color: 'blue' },
            { value: '1M+', label: 'Students', icon: Users, color: 'purple' },
            { value: '500+', label: 'Curricula', icon: BookOpen, color: 'pink' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center"
            >
              <div className={`text-3xl font-black text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { icon: Target, title: 'Standardized', desc: 'Unified curriculum across all institutions', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
          { icon: Zap, title: 'AI-Powered', desc: 'Smart recommendations & analysis', color: 'purple', gradient: 'from-purple-500 to-pink-500' },
          { icon: Shield, title: 'Secure', desc: 'Enterprise-grade security & privacy', color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
          { icon: Rocket, title: 'Fast', desc: 'Real-time updates & collaboration', color: 'orange', gradient: 'from-orange-500 to-red-500' },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
              <feature.icon size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Universities Showcase Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 shadow-lg border border-blue-100/50 dark:border-gray-700 overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl"></div>

        {/* Section Header */}
        <div className="relative text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-700 px-5 py-2.5 rounded-full shadow-md border border-gray-100 dark:border-gray-600 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Building size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-black text-gray-800 dark:text-gray-100">Trusted by India's Premier Institutions</h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl mx-auto">
            Powering education across India's most prestigious universities
          </p>
        </div>

        {/* Featured Universities Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { name: 'IIT Kanpur', logo: iitLogo, description: 'Premier Technical Institute' },
            { name: 'IIT Kharagpur', logo: iitLogo, description: 'India\'s Oldest IIT' },
            { name: 'NIT Trichy', logo: nitLogo, description: 'Top NIT Excellence' }
          ].map((uni, index) => (
            <UniversityCard key={uni.name} university={uni} delay={0.5 + (index * 0.1)} />
          ))}
        </div>

        {/* Universities Scrolling Bar */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 dark:from-gray-800 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 dark:from-gray-800 to-transparent z-10"></div>

          <div className="relative overflow-hidden py-3">
            <div className="flex animate-scroll">
              {[
                'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Roorkee', 'IIT Guwahati',
                'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela', 'NIT Jaipur',
                'CU Delhi', 'DU Delhi', 'JNU Delhi', 'BHU Varanasi', 'AMU Aligarh',
                'LPU Punjab', 'Chandigarh University', 'SRM Chennai', 'VIT Vellore', 'Amrita University',
                'BITS Pilani', 'Manipal University', 'Symbiosis Pune', 'Christ University', 'MS Ramaiah'
              ].map((university, index) => {
                const getIcon = (uniName) => {
                  if (uniName.includes('IIT')) return <img src={iitLogo} alt="IIT" className="w-5 h-5 object-contain" />;
                  if (uniName.includes('NIT')) return <img src={nitLogo} alt="NIT" className="w-5 h-5 object-contain" />;
                  if (uniName.includes('BITS')) return <img src={bitsLogo} alt="BITS" className="w-5 h-5 object-contain" />;
                  if (uniName.includes('Chandigarh University')) return <img src={cuLogo} alt="CU" className="w-5 h-5 object-contain" />;
                  if (uniName.includes('LPU')) return <img src={lpuLogo} alt="LPU" className="w-5 h-5 object-contain" />;
                  return <School size={14} className="text-blue-500" />;
                };

                return (
                  <div
                    key={`${university}-${index}`}
                    className="flex-shrink-0 mx-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(university)}
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {university}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* Duplicate for seamless scroll */}
              {[
                'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Roorkee', 'IIT Guwahati',
                'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela', 'NIT Jaipur'
              ].map((university, index) => {
                const getIcon = (uniName) => {
                  if (uniName.includes('IIT')) return <img src={iitLogo} alt="IIT" className="w-5 h-5 object-contain" />;
                  if (uniName.includes('NIT')) return <img src={nitLogo} alt="NIT" className="w-5 h-5 object-contain" />;
                  return <School size={14} className="text-blue-500" />;
                };

                return (
                  <div
                    key={`${university}-dup-${index}`}
                    className="flex-shrink-0 mx-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(university)}
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {university}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Mission Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Target size={20} />
              </div>
              <h2 className="text-2xl font-black">Our Mission</h2>
            </div>
            <p className="text-blue-100 leading-relaxed mb-6">
              To create a seamless, transparent, and efficient ecosystem where model curricula are easily accessible, adaptable, and implementable for all affiliated institutions across India.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Standardization', 'Accessibility', 'Innovation', 'Quality'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Star size={20} />
              </div>
              <h2 className="text-2xl font-black">Our Vision</h2>
            </div>
            <p className="text-purple-100 leading-relaxed mb-6">
              To become the definitive platform for curriculum standardization in India, fostering innovation in education through technology while maintaining the highest standards of academic excellence.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Excellence', 'Technology', 'Future', 'Growth'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Developers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Code size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">Meet the Architects</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">The brilliant minds behind this platform</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 dark:border-gray-700 rounded-full border-t-blue-500 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev, idx) => (
              <DeveloperCard key={dev.id || idx} developer={dev} delay={0.7 + (idx * 0.1)} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Footer / Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-900 dark:bg-gray-800 rounded-3xl p-8 text-white"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Building size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">AICTE Headquarters</h3>
              <p className="text-gray-400 text-sm">Nelson Mandela Marg, New Delhi</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center md:text-right">
              <p className="font-bold">+91-11-29581000</p>
              <p className="text-blue-400 text-sm">aicteindia@aicte-india.org</p>
            </div>
            <div className="flex items-center gap-2">
              <Heart size={16} className="text-red-400" />
              <span className="text-sm text-gray-400">Made in India</span>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default AboutUs;
