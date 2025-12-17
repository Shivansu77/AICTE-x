import React, { useEffect, useState } from 'react';
import { Book, Clock, Edit3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CourseCard = ({ _id, title, code, credits, color, icon: Icon, description }) => {
    const colorClasses = {
        blue: "bg-accent-blue",
        peach: "bg-accent-peach",
        green: "bg-accent-green",
        yellow: "bg-accent-yellow"
    };

    const bgClass = colorClasses[color] || colorClasses.blue;

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-black/5 hover:translate-y-[-4px] transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${bgClass}`}>
                    {code}
                </span>
                <span className="text-secondary text-sm font-bold flex items-center gap-1">
                    <Clock size={14} /> {credits} Credits
                </span>
            </div>

            <div className="flex gap-6 items-center mb-6">
                <div className={`shrink-0 w-24 h-24 ${bgClass}/20 rounded-3xl flex items-center justify-center`}>
                    <div className={`w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm text-${color}-600`}>
                        <Icon size={24} className={`text-gray-700`} />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-extrabold text-primary mb-2 group-hover:text-accent-blue transition-colors">
                        {title}
                    </h3>
                    <p className="text-secondary text-sm font-medium leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-auto">
                <Link to={`/curriculum/${code}`} className={`flex-1 py-1 px-2 rounded-full border-2 border-transparent hover:bg-gray-50 text-secondary font-bold text-sm transition-colors flex items-center justify-center gap-2`}>
                    View Details
                </Link>
                <button className={`flex-1 py-3 px-6 rounded-full ${bgClass} text-white font-bold text-sm shadow-md hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2`}>
                    <Edit3 size={16} /> Manage
                </button>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const [curricula, setCurricula] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurricula = async () => {
            try {
                // Try fetching actual data
                const response = await api.get('/api/curriculum');
                setCurricula(response.data);
            } catch (error) {
                console.error("Failed to fetch curriculum", error);
                // Fallback or empty state could be handled here
            } finally {
                setLoading(false);
            }
        };

        fetchCurricula();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-secondary font-bold">Loading Courses...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Filtering Pills */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                {["All Semesters", "Semester 3", "Semester 4", "Semester 5"].map((label, idx) => (
                    <button
                        key={label}
                        className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${idx === 0
                                ? "bg-accent-peach text-white shadow-md"
                                : "bg-white text-secondary hover:bg-white/80"
                            }`}
                    >
                        {label}
                    </button>
                ))}
                {/* Seed Button for Demo */}
                <button
                    onClick={async () => {
                        await api.get('/api/curriculum/seed');
                        window.location.reload();
                    }}
                    className="px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20"
                >
                    Reset/Seed Data
                </button>
            </div>

            {/* Course Grid */}
            {curricula.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {curricula.map((course) => (
                        <CourseCard key={course._id || course.code} {...course} icon={Book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold text-secondary">No courses found.</h3>
                    <p className="text-secondary/70">Try seeding data using the button above.</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
