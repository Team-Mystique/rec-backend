# Rise Edu consult WebApp



This is the official academic project for Rise Edu Consult, developed by Team Mystique as part of the DCIT 208 Software Engineering course at the University of Ghana.

##  Project Stack

- **Frontend**: React.js (HTML, CSS, JavaScript)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Hosting**: GitHub Pages (Frontend), Render/Fly.io (for backend API)
- **Version Control**: Git + GitHub
- **Design**: Figma
- **Project Management**: Trello (Agile/Scrum)
  

## Project Structure

```
rec-webApp/
├── frontend/              # React app
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json

├── backend/               # Node.js + Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env.example
│   └── server.js

├── README.md
├── .gitignore
└── LICENSE
```

##  Setup Instructions

### 1. Clone the repository

#### Frontend
```bash
git clone https://github.com/Team-Mystique/REC-WebApp-frontend.git
cd REC-webapp
```


#### Backend
```bash
git clone https://github.com/Team-Mystique/REC-WebApp-backend.git
cd REC-webapp
```

### 2. Set up the frontend (React)

```bash
cd frontend
npm install
npm start
```

### 3. Set up the backend (Node.js + Express)

```bash
cd ../backend
npm install
node server.js
```

Create a `.env` file with the following:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## Deployment Plan

- **Frontend**: GitHub Pages / Netlify
- **Backend**: Render or Fly.io (free tiers)
- **Database**: MongoDB Atlas (Free Cluster)

##  Team Mystique 

| Name             | Role                    |
| ---------------- | ----------------------- |
| Ebenezer Fuachie | Project Lead(Scrum Master) / Backend Dev  |
| Assah Francis Yeboah       | Frontend Dev/Designer     |
| Farrash Osman       | Frontend Dev/Designer      |
| David Boafo Adjei      | Frontend Dev/QA & Testing Lead/Designer       |
| Roselyn Francis       | Database Admin/Backend Dev      |
| Kingslla Gyan        | Backend Developer      |
| Prince Kwaku Enam Ametefe       | Backend Developer |

---

© 2025 Team Mystique — UG Legon

<div align="center">
  <img src="Team Logo.png" alt="Team Logo" width="250"/>
</div>


