# Web App timeTrackingApp

Overview
This web application is a time tracking app designed to help users clock in and out, manually enter work hours, and allow admins to set and manage working hours. As a software engineer, this project helped me deepen my understanding of full-stack development, including localStorage, routing with Express.js, and dynamic rendering using EJS templates. The app runs on a Node.js server and dynamically handles user and admin workflows.

To start the test server on your computer:

Run node server.js to start the server.
Open http://localhost:3000 in your browser to access the app.
The purpose of writing this software was to learn how to build user-driven apps that save and retrieve data dynamically while understanding core web technologies like backend routing and frontend templating.

[Software Demo Video](https://youtu.be/ILplMP0hYqg?si=qqN6UyAJ808Yn7BD)

Web Pages
Login Page:
The first page of the app allows users to log in as either an admin or a standard user.

Dashboard (User):
This page displays clock-in/clock-out buttons and a manual time entry form. Manual time entries are saved dynamically in localStorage.

Admin Dashboard:
This page displays all user-submitted time logs with a column to indicate if the logs are within set working hours. 

Set Working Hours Page:
Admins can set working hours for specific days, displayed dynamically in a table. They can also delete hours they no longer need.

Edit Time Page:
Users can view and edit their submitted time logs. Approved logs are locked and cannot be edited.

Development Environment
Tools:
Developed using Node.js, Express.js, EJS templates, and localStorage for data handling.
CSS was used for styling, and the app was tested in Chrome.

Programming Languages:
JavaScript (Node.js and frontend), HTML, and CSS.

Useful Websites
MDN Web Docs "https://developer.mozilla.org/en-US/"
freeCodeCamp "https://www.freecodecamp.org/"
Node.js Documentation
EJS Documentation "https://ejs.co/"

Future Work
Replace localStorage with a CLOUD database like Firebase or MongoDB for persistent data storage.
Add more user roles and permissions (e.g., manager role).
Implement user authentication with password encryption.
Add email notifications for admin approvals.