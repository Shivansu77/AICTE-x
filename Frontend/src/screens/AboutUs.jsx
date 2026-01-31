import React, { useState, useEffect } from 'react';
import { Building, Globe, BookOpen, Users, School } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4">

      {/* Hero Section - Clean Text No Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-green dark:from-accent-blue dark:to-accent-green">
          Empowering India's Digital Campus
        </h1>

        <p className="text-lg text-secondary font-medium leading-relaxed max-w-2xl mx-auto">
          The AICTE Unified Curriculum Portal is a revolutionary platform designed to <span className="text-primary font-bold">standardize</span>, <span className="text-primary font-bold">streamline</span>, and <span className="text-primary font-bold">elevate</span> the quality of technical education across the nation.
        </p>
      </motion.div>

      {/* Universities Showcase Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-card dark:bg-card rounded-3xl p-8 mx-4 shadow-lg border border-blue-100/50 dark:border-border-color"
      >
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-secondary/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-blue-100 dark:border-border-color mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Building size={20} className="text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Trusted by India's Premier Institutions</h3>
          </div>
          <p className="text-secondary text-sm max-w-2xl mx-auto">
            Powering the future of education across India's most prestigious universities and technical institutes
          </p>
        </div>

        {/* Featured Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'IIT Kanpur', logo: iitLogo, description: 'Premier Technical Institute' },
            { name: 'IIT Kharagpur', logo: iitLogo, description: 'India\'s Oldest IIT' },
            { name: 'NIT Trichy', logo: nitLogo, description: 'Top NIT Excellence' }
          ].map((uni, index) => (
            <UniversityCard key={uni.name} university={uni} delay={0.3 + (index * 0.1)} />
          ))}
        </div>

        {/* Universities Scrolling Bar */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

          <div className="relative overflow-hidden py-4">
            <div className="flex animate-scroll">
              {/* First set of universities */}
              {[
                'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Roorkee', 'IIT Guwahati',
                'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela', 'NIT Jaipur',
                'CU Delhi', 'DU Delhi', 'JNU Delhi', 'BHU Varanasi', 'AMU Aligarh',
                'LPU Punjab', 'Chandigarh University', 'SRM Chennai', 'VIT Vellore', 'Amrita University',
                'BITS Pilani', 'Manipal University', 'Symbiosis Pune', 'Christ University', 'MS Ramaiah',
                'PES University', 'RV College', 'BMS College', 'Dayananda Sagar', 'Jain University',
                'KIIT Bhubaneswar', 'Kalinga University', 'SOA University', 'XIMB Bhubaneswar', 'ICFAI University'
              ].map((university, index) => {
                // Determine icon for universities
                const getIcon = (uniName) => {
                  if (uniName.includes('IIT')) return <img src={iitLogo} alt="IIT" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('NIT')) return <img src={nitLogo} alt="NIT" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('BITS')) return <img src={bitsLogo} alt="BITS" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('Chandigarh University')) return <img src={cuLogo} alt="CU" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('LPU')) return <img src={lpuLogo} alt="LPU" className="w-6 h-6 object-contain mr-2" />;
                  return <School size={16} className="text-purple-600 mr-2" />;
                };

                return (
                  <div
                    key={`${university}-${index}`}
                    className="flex-shrink-0 mx-3 px-5 py-3 bg-card dark:bg-card rounded-xl shadow-md border border-gray-100 dark:border-border-color hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(university)}
                      <span className="text-sm font-semibold text-primary whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {university}
                      </span>
                    </div>
                  </div>
                );
              })}
              {/* Duplicate set for seamless scrolling */}
              {[
                'IIT Delhi', 'IIT Bombay', 'IIT Madras', 'IIT Roorkee', 'IIT Guwahati',
                'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela', 'NIT Jaipur',
                'CU Delhi', 'DU Delhi', 'JNU Delhi', 'BHU Varanasi', 'AMU Aligarh',
                'LPU Punjab', 'Chandigarh University', 'SRM Chennai', 'VIT Vellore', 'Amrita University',
                'BITS Pilani', 'Manipal University', 'Symbiosis Pune', 'Christ University', 'MS Ramaiah',
                'PES University', 'RV College', 'BMS College', 'Dayananda Sagar', 'Jain University',
                'KIIT Bhubaneswar', 'Kalinga University', 'SOA University', 'XIMB Bhubaneswar', 'ICFAI University'
              ].map((university, index) => {
                // Determine icon for universities
                const getIcon = (uniName) => {
                  if (uniName.includes('IIT')) return <img src={iitLogo} alt="IIT" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('NIT')) return <img src={nitLogo} alt="NIT" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('BITS')) return <img src={bitsLogo} alt="BITS" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('Chandigarh University')) return <img src={cuLogo} alt="CU" className="w-6 h-6 object-contain mr-2" />;
                  if (uniName.includes('LPU')) return <img src={lpuLogo} alt="LPU" className="w-6 h-6 object-contain mr-2" />;
                  return <School size={16} className="text-purple-600 mr-2" />;
                };

                return (
                  <div
                    key={`${university}-duplicate-${index}`}
                    className="flex-shrink-0 mx-3 px-5 py-3 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2">
                      {getIcon(university)}
                      <span className="text-sm font-semibold text-gray-700 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                        {university}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex justify-center items-center gap-8 mt-6 pt-6 border-t border-blue-100 dark:border-border-color">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">1M+</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">500+</div>
            <div className="text-xs text-secondary uppercase tracking-wider">Curricula</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">500+</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">Curricula</div>
          </div>
        </div>
      </motion.div>

      {/* Grid Layout - More Compact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Mission Card - Spans 2 cols */}
        <BentoCard className="md:col-span-2 flex flex-col justify-center bg-card dark:bg-card" delay={0.1}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
              <Globe size={16} className="text-accent-blue" />
            </div>
            <h2 className="text-xl font-bold text-primary">Our Mission</h2>
          </div>

          <p className="text-secondary text-sm leading-relaxed mb-4 font-medium">
            To create a seamless, transparent, and efficient ecosystem where model curricula are easily accessible, adaptable, and implementable for all affiliated institutions.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Standardization', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900' },
              { label: 'Accessibility', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900' },
              { label: 'Innovation', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900' },
              { label: 'Quality', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900' }
            ].map((tag) => (
              <span key={tag.label} className={`px-3 py-1 rounded-lg text-xs font-bold border ${tag.color} cursor-default`}>
                #{tag.label}
              </span>
            ))}
          </div>
        </BentoCard>

        {/* Stats Cards - Compact */}
        <StatCard
          icon={Building}
          value="1000+"
          label="Institutions"
          colorClass={{ bg: 'bg-blue-50/50', iconBg: 'bg-blue-100', text: 'text-accent-blue' }}
          delay={0.2}
        />

        <StatCard
          icon={BookOpen}
          value="500+"
          label="Curricula"
          colorClass={{ bg: 'bg-orange-50/50', iconBg: 'bg-orange-100', text: 'text-accent-peach' }}
          delay={0.3}
        />

        <StatCard
          icon={Users}
          value="1M+"
          label="Students"
          colorClass={{ bg: 'bg-green-50/50', iconBg: 'bg-green-100', text: 'text-accent-green' }}
          delay={0.4}
        />

        <BentoCard className="md:col-span-2 flex items-center gap-4 bg-gray-900 dark:bg-card text-white dark:text-primary" delay={0.6}>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Globe size={20} className="text-accent-yellow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white dark:text-primary leading-tight">Nationwide Reach</h3>
            <p className="text-gray-400 dark:text-secondary text-xs mt-1">Connecting campuses from Kashmir to Kanyakumari.</p>
          </div>
        </BentoCard>
      </div>

      {/* Developers Section */}
      <h2 className="text-2xl font-black text-primary mt-8 mb-4 px-2 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-accent-blue rounded-full"></span>
        Meet the Architects
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((dev, idx) => (
            <DeveloperCard key={dev.id || idx} developer={dev} delay={0.7 + (idx * 0.1)} />
          ))}
        </div>
      )}

      {/* Footer / Contact */}
      <BentoCard className="mt-4 bg-gray-50 dark:bg-card border-none p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h3 className="text-sm font-bold text-primary">AICTE Headquarters</h3>
            <p className="text-secondary text-xs">Nelson Mandela Marg, New Delhi</p>
          </div>
          <div className="flex flex-col md:items-end">
            <p className="text-primary text-sm font-bold">+91-11-29581000</p>
            <p className="text-accent-blue text-xs">aicteindia@aicte-india.org</p>
          </div>
        </div>
      </BentoCard>

    </div>
  );
};

export default AboutUs;
