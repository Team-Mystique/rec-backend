# Rise Edu consult WebApp-Backend



This is the official academic project for Rise Edu Consult, developed by Team Mystique as part of the DCIT 208 Software Engineering course at the University of Ghana.

#  Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Cloud)
- **Hosting**: Render/Fly.io (for backend API)
- **Version Control**: Git + GitHub
- **Project Management**: Trello (Agile/Scrum)
  

## Project | Backend Structure

```


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


#### Backend
```bash
git clone https://github.com/Team-Mystique/rec-backend.git
cd rec-backend 
```


### 2. Set up the backend (Node.js + Express)

```bash
cd ../rec-backend
npm install
node server.js 0r npm run dev
```

Create a `.env` file with the following:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

## Deployment Plan

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


