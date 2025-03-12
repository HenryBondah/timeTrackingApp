# Overview
This project integrates GIS (Geographic Information System) functionality into a Time Tracking Application to enable location-based clock-in and clock-out verification. The goal is to improve accuracy in employee attendance tracking by ensuring that users can only log their work hours within a predefined geographical area.

# Features
Admin Dashboard: Allows administrators to set a clock-in area on a map.
Real-Time Location Validation: Users must be within the predefined radius to successfully clock in.
Geolocation Capture: Automatically captures and stores the latitude and longitude of clock-in and clock-out events.
Within Range & Within Time Tracking: Admins can review whether users clocked in within the designated location and working hours.

# How It Works
Admin Sets a Clock-In Zone:
Admin selects a location on the map.
A radius (in meters) is defined for the allowed clock-in area.
The coordinates are stored in Firestore for future reference.
User Clock-In Validation:
When a user attempts to clock in, their current GPS location is retrieved.
The system checks if the user is within the predefined area using the Haversine formula.
If within range, the clock-in time and location are stored in Firestore.
# Admin Dashboard Monitoring:

Admins can view clock-in times and locations for each user.
The dashboard displays whether the clock-in was inside or outside the defined area.
Software Demo Video
Software Demo Video

# Development Environment
Tools Used
Node.js & Express.js – Backend API for managing clock-in data.
Firebase Firestore – Database to store clock-in records and geofence settings.
Leaflet.js – Open-source mapping library for setting the demarcation area.
EJS (Embedded JavaScript) – Template engine for rendering dynamic frontend pages.
CSS & Bootstrap – Styling for frontend UI components.
Programming Languages & Libraries
JavaScript (Node.js, Express.js, and frontend logic)
HTML, CSS, EJS (for dynamic frontend rendering)
Firebase Firestore SDK (for database interactions)
Leaflet.js (for interactive maps and geolocation tracking)
Useful Websites
Leaflet.js Documentation
Google Maps Geolocation API
Firebase Firestore Docs
MDN Web Docs - Geolocation API
# Future Work
Mobile App Integration: Develop a mobile app with GPS tracking for better accuracy.
Improve Offline Mode: Allow clock-in attempts even without internet and sync data when online.
Add Map Display for Users: Let users view the designated clock-in zone in their dashboard.
Real-Time Notifications: Alert users if they are trying to clock in outside the permitted range.
This GIS-powered clock-in system enhances workplace accountability by ensuring employees are present at the correct location before logging their work hours. 🚀