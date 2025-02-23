# Overview

This project aims to enhance my skills as a software engineer by building a dynamic and interactive web application that integrates with a cloud database. The software allows users to search for places using the iNaturalist API, retrieve species identifications for those locations, and display the results in an intuitive format. To make the data dynamic and persistent, I integrated Firebase as the cloud database, ensuring real-time data updates and scalability.

Users can enter a place name and optionally filter results by observation date. Upon searching, the application fetches species data, displays the species name, and shows corresponding images when available. The entire data flow, from user input to cloud database storage and retrieval, is seamless and efficient.

The purpose of writing this software is to develop a deeper understanding of API integrations, cloud database management, and dynamic web applications. This project also provides practical experience in working with modern frontend technologies and cloud services.

[Software Demo Video](https://youtu.be/ILplMP0hYqg?si=MUlAb6abjs9u-deF)

---

# Cloud Database

For this project, I used **Firebase** as the cloud database solution. Firebase was chosen for its real-time capabilities, easy integration with frontend applications, and robust support for dynamic data handling.

## Database Structure
- **Collections:**
  - `places`: Stores information about user-searched places, including place IDs and names.
  - `identifications`: Contains species data fetched from the iNaturalist API, linked to corresponding places.
  - `search_history`: Tracks user searches for analytics and history purposes.
- **Dynamic Data:** All data entries are dynamically updated when users perform new searches, ensuring the application displays the most recent information.

---

# Development Environment

## Tools Used
- **Code Editor:** Visual Studio Code (VS Code)  

## Technologies & Libraries
- **Frontend:** React.js with Vite for fast development and build times
- **Styling:** Tailwind CSS for responsive and modern UI design
- **API Integration:** Axios for handling HTTP requests to the iNaturalist API
- **Cloud Database:** Firebase for real-time data storage and retrieval
- **Linting:** ESLint to ensure code quality and consistency

---

# Useful Websites
- [Firebase Documentation](https://firebase.google.com/docs)
- [Axios GitHub Repository](https://github.com/axios/axios)
---

# Future Work

- **Enhanced UI/UX:** Improve the user interface for a more engaging experience.
- **Pagination:** Implement pagination for better handling of large datasets.
- **Data Visualization:** Incorporate charts or maps to visualize species data geographically.

---

This project has been a valuable learning experience, helping me gain hands-on knowledge in building modern web applications with dynamic data handling and cloud integrations.
