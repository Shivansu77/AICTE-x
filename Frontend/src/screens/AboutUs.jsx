import React, { useState, useEffect } from 'react';
import { Github, MapPin, Building, ExternalLink, Heart, Sparkles, Globe, BookOpen, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

import iitLogo from '../assets/iit_logo.png';
import annaLogo from '../assets/anna_logo.png';
import nitLogo from '../assets/nit_logo.png';
import bitsLogo from '../assets/bits_logo.png';
import lpuLogo from '../assets/lpu_logo.png';
import cuLogo from '../assets/cu_logo.png';

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

  const handleMagicClick = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 pt-4">

      {/* Hero Section - Clean Text No Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mx-auto px-4"
      >
        <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-green">
          Empowering India's Digital Campus
        </h1>

        <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          The AICTE Unified Curriculum Portal is a revolutionary platform designed to <span className="text-gray-900 font-bold">standardize</span>, <span className="text-gray-900 font-bold">streamline</span>, and <span className="text-gray-900 font-bold">elevate</span> the quality of technical education across the nation.
        </p>
      </motion.div>

      {/* Grid Layout - More Compact */}
      {/* University Marquee Section */}
      <div className="py-10 overflow-hidden relative">
        <h2 className="text-2xl font-black text-center text-gray-900 mb-8">Trusted by Top Institutions</h2>
        <div className="relative w-full flex overflow-x-hidden group">
          <motion.div
            className="flex gap-12 items-center whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 25
            }}
          >
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  { name: "IIT Delhi", img: iitLogo, color: "bg-red-50" },
                  { name: "Anna University", img: annaLogo, color: "bg-blue-50" },
                  { name: "NIT Trichy", img: nitLogo, color: "bg-green-50" },
                  { name: "BITS Pilani", img: bitsLogo, color: "bg-purple-50" },
                  { name: "LPU", img: lpuLogo, color: "bg-orange-50" },
                  { name: "Chandigarh University", img: cuLogo, color: "bg-rose-50" },
                  { name: "IIT Delhi", img: iitLogo, color: "bg-red-50" }, // Repeat for fullness
                  { name: "Anna University", img: annaLogo, color: "bg-blue-50" },
                  { name: "NIT Trichy", img: nitLogo, color: "bg-green-50" },
                  { name: "BITS Pilani", img: bitsLogo, color: "bg-purple-50" },
                  { name: "LPU", img: lpuLogo, color: "bg-orange-50" },
                  { name: "Chandigarh University", img: cuLogo, color: "bg-rose-50" },
                ].map((uni, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-3 mx-6 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-110 cursor-pointer">
                    <div className={`w-28 h-28 rounded-full ${uni.color} flex items-center justify-center shadow-sm border-4 border-white overflow-hidden p-2`}>
                      <img src={uni.img} alt={uni.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <span className="font-bold text-gray-700">{uni.name}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
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
