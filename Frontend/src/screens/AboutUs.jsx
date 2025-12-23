import React, { useState, useEffect } from 'react';
import { Github, MapPin, Building, ExternalLink, Globe, BookOpen, Users, GraduationCap, Building2, School } from 'lucide-react';
import { motion } from 'framer-motion';

const BentoCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white rounded-[1.5rem] p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-accent-blue/20 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({ icon: Icon, value, label, colorClass, delay }) => (
  <BentoCard className={`flex flex-col items-center justify-center text-center group hover:scale-[1.02] ${colorClass.bg}`} delay={delay}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${colorClass.iconBg} group-hover:scale-110 transition-transform`}>
      <Icon size={20} className={colorClass.text} />
    </div>
    <h3 className={`text-2xl font-black ${colorClass.text} mb-0.5`}>{value}</h3>
    <p className="text-secondary font-bold text-xs">{label}</p>
  </BentoCard>
);

const AboutUs = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const usernames = ['Shivansu77', 'Shubh058', 'Rohitsingh1302']; // Add more if needed
      try {
        const developerData = await Promise.all(
          usernames.map(async (username) => {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) throw new Error(`Failed to fetch ${username}`);
            return response.json();
          })
        );
        setDevelopers(developerData);
      } catch (error) {
        console.error('Error fetching developers:', error);
        setDevelopers([
          { login: 'Shivansu77', name: 'Shivansu Bisht', avatar_url: 'https://github.com/Shivansu77.png', bio: 'Full Stack Developer', location: 'India' },
          { login: 'Shubh058', name: 'Shubham', avatar_url: 'https://github.com/Shubh058.png', bio: 'Frontend Developer', location: 'India' },
          { login: 'Rohitsingh1302', name: 'Rohit Singh', avatar_url: 'https://github.com/Rohitsingh1302.png', bio: 'Backend Developer', location: 'India' }
        ]);
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
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-blue-500 to-cyan-500">
          Empowering India's Digital Campus
        </h1>

        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          The AICTE Unified Curriculum Portal is a revolutionary platform designed to <span className="text-gray-900 font-bold">standardize</span>, <span className="text-gray-900 font-bold">streamline</span>, and <span className="text-gray-900 font-bold">elevate</span> the quality of technical education across the nation.
        </p>
      </motion.div>

      {/* Universities Showcase Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-8 mx-4 shadow-lg border border-blue-100/50"
      >
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-blue-100 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <Building size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Trusted by India's Premier Institutions</h3>
          </div>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Powering the future of education across India's most prestigious universities and technical institutes
          </p>
        </div>

        {/* Featured Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'IIT Kanpur', logo: <GraduationCap size={32} className="text-blue-600" />, description: 'Premier Technical Institute' },
            { name: 'IIT Kharagpur', logo: <Building2 size={32} className="text-indigo-600" />, description: 'India\'s Oldest IIT' },
            { name: 'NIT Trichy', logo: <GraduationCap size={32} className="text-green-600" />, description: 'Top NIT Excellence' }
          ].map((uni, index) => (
            <motion.div
              key={uni.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  {uni.logo}
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{uni.name}</h4>
                <p className="text-sm text-gray-600">{uni.description}</p>
              </div>
            </motion.div>
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
                  if (uniName.includes('IIT')) return <GraduationCap size={16} className="text-blue-600 mr-2" />;
                  if (uniName.includes('NIT')) return <Building2 size={16} className="text-green-600 mr-2" />;
                  return <School size={16} className="text-purple-600 mr-2" />;
                };

                return (
                  <div
                    key={`${university}-${index}`}
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
                  if (uniName.includes('IIT')) return <GraduationCap size={16} className="text-blue-600 mr-2" />;
                  if (uniName.includes('NIT')) return <Building2 size={16} className="text-green-600 mr-2" />;
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
        <div className="flex justify-center items-center gap-8 mt-6 pt-6 border-t border-blue-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1000+</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">1M+</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider">Students</div>
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
        <BentoCard className="md:col-span-2 flex flex-col justify-center bg-white" delay={0.1}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center">
              <Globe size={16} className="text-accent-blue" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium">
            To create a seamless, transparent, and efficient ecosystem where model curricula are easily accessible, adaptable, and implementable for all affiliated institutions.
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Standardization', color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { label: 'Accessibility', color: 'bg-purple-50 text-purple-600 border-purple-100' },
              { label: 'Innovation', color: 'bg-orange-50 text-orange-600 border-orange-100' },
              { label: 'Quality', color: 'bg-green-50 text-green-600 border-green-100' }
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


        <BentoCard className="md:col-span-2 flex items-center gap-4 bg-gray-900 text-white" delay={0.6}>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Globe size={20} className="text-accent-yellow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">Nationwide Reach</h3>
            <p className="text-gray-400 text-xs mt-1">Connecting campuses from Kashmir to Kanyakumari.</p>
          </div>
        </BentoCard>
      </div>

      {/* Developers Section */}
      <h2 className="text-2xl font-black text-gray-900 mt-8 mb-4 px-2 flex items-center gap-2">
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
            <BentoCard key={dev.id || idx} delay={0.7 + (idx * 0.1)} className="group hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50">
              <div className="flex items-start gap-4">
                <img
                  src={dev.avatar_url || `https://ui-avatars.com/api/?name=${dev.name || dev.login}&background=random`}
                  alt={dev.login}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow border-2 border-white"
                />
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{dev.name || dev.login}</h3>
                  <a href={`https://github.com/${dev.login}`} target="_blank" rel="noreferrer" className="text-accent-blue text-xs font-bold hover:underline flex items-center gap-1 mb-1">
                    @{dev.login} <ExternalLink size={10} />
                  </a>
                  {dev.location && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                      <MapPin size={10} /> {dev.location}
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-4 text-gray-600 text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">
                {dev.bio || "Passionate developer contributing to the future of education technology."}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex gap-1.5 opacity-60">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                </div>
                <a
                  href={`https://github.com/${dev.login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-primary transition-all shadow-sm hover:shadow"
                >
                  <Github size={16} />
                </a>
              </div>
            </BentoCard>
          ))}
        </div>
      )}

      {/* Footer / Contact */}
      <BentoCard className="mt-4 bg-gray-50 border-none p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <h3 className="text-sm font-bold text-gray-900">AICTE Headquarters</h3>
            <p className="text-gray-500 text-xs">Nelson Mandela Marg, New Delhi</p>
          </div>
          <div className="flex flex-col md:items-end">
            <p className="text-gray-900 text-sm font-bold">+91-11-29581000</p>
            <p className="text-accent-blue text-xs">aicteindia@aicte-india.org</p>
          </div>
        </div>
      </BentoCard>

    </div>
  );
};

export default AboutUs;
