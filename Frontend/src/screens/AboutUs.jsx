import React, { useState, useEffect } from 'react';
import { Github, MapPin, Building, ExternalLink } from 'lucide-react';

const AboutUs = () => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      const usernames = ['Shivansu77', 'Shubh058', 'Rohitsingh1302'];
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
        // Fallback data in case of API failure
        setDevelopers([
          { login: 'Shivansu77', name: 'Shivansu Bisht', avatar_url: '', bio: 'Full Stack Developer' },
          { login: 'Shubh058', name: 'Shubh', avatar_url: '', bio: 'Frontend Developer' },
          { login: 'Rohitsingh1302', name: 'Rohit Singh', avatar_url: '', bio: 'Backend Developer' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About AICTE Unified Portal</h1>
        <p className="text-lg text-gray-600">Empowering Education Through Unified Curriculum Management</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          The AICTE Unified Portal is designed to revolutionize curriculum management across India's higher education institutions.
          We provide a centralized platform that ensures consistency, quality, and accessibility in educational content delivery.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Do</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Develop and standardize model curricula
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Facilitate collaboration between institutions
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Ensure quality education delivery
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Provide unified access to educational resources
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Impact</h3>
            <div className="space-y-4">
              <div className="bg-accent-blue/10 p-4 rounded-lg border border-accent-blue/20">
                <div className="text-2xl font-bold text-accent-blue">1000+</div>
                <div className="text-sm text-gray-600">Institutions Connected</div>
              </div>
              <div className="bg-accent-peach/10 p-4 rounded-lg border border-accent-peach/20">
                <div className="text-2xl font-bold text-accent-peach">500+</div>
                <div className="text-sm text-gray-600">Model Curricula</div>
              </div>
              <div className="bg-accent-green/10 p-4 rounded-lg border border-accent-green/20">
                <div className="text-2xl font-bold text-accent-green">1M+</div>
                <div className="text-sm text-gray-600">Students Benefited</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developers Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Meet Our Developers</h2>
        <p className="text-gray-600 text-center mb-8">The talented team behind AICTE Unified Portal</p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {developers.map((dev, index) => (
              <div key={dev.login} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
                <div className="text-center mb-4">
                  <div className="relative inline-block">
                    <img
                      src={dev.avatar_url || `https://ui-avatars.com/api/?name=${dev.name || dev.login}&background=random&color=fff&size=120`}
                      alt={dev.name || dev.login}
                      className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <a
                      href={`https://github.com/${dev.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute -bottom-2 -right-2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                    >
                      <Github size={16} />
                    </a>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{dev.name || dev.login}</h3>
                  <p className="text-accent-blue font-medium mb-2">@{dev.login}</p>
                  {dev.bio && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dev.bio}</p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  {dev.location && (
                    <div className="flex items-center justify-center gap-2">
                      <MapPin size={14} className="text-accent-peach" />
                      <span>{dev.location}</span>
                    </div>
                  )}
                  {dev.company && (
                    <div className="flex items-center justify-center gap-2">
                      <Building size={14} className="text-accent-green" />
                      <span>{dev.company}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-center">
                    <a
                      href={`https://github.com/${dev.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <ExternalLink size={14} />
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">AICTE Headquarters</h3>
            <div className="text-gray-700 space-y-2">
              <p>Nelson Mandela Marg</p>
              <p>Vasant Kunj, New Delhi - 110070</p>
              <p>India</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Get in Touch</h3>
            <div className="text-gray-700 space-y-2">
              <p>Phone: +91-11-29581000</p>
              <p>Email: aicteindia@aicte-india.org</p>
              <p>Website: www.aicte-india.org</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-accent-blue via-accent-peach to-accent-green rounded-lg p-8 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Join the Education Revolution</h2>
          <p className="text-white/90">
            Be part of India's journey towards standardized, quality education through technology and collaboration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
