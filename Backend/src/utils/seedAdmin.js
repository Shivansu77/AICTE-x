const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminEmail = "admin@gmail.com";
        const adminPass = "@Shark77";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            return;
        }

        const admin = new User({
            firstName: "AICTE",
            lastName: "Admin",
            email: adminEmail,
            password: adminPass,
            role: "admin",
            isActive: true
        });

        await admin.save();
        console.log("Admin user seeded successfully.");
    } catch (error) {
        console.error("Error seeding admin:", error);
    }
};

module.exports = seedAdmin;
