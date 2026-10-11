# FitPulse Pro — Backend REST API (Person 3 Module)

A modular, production-grade Node.js + Express.js + MongoDB backend providing full RESTful capabilities for **PERSON 3: Goals + Health + Progress + Recommendations** in the FitPulse Pro fitness management platform.

---

## 🏗️ Architecture

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js              # MongoDB connection & connection resilience
│   ├── models/
│   │   ├── Health.js                # Health schema (weight, water, sleep, steps, calories, bmi, date)
│   │   ├── Goal.js                  # Goals schema (stepGoal, calorieGoal, weightGoal, waterGoal, sleepGoal)
│   │   └── User.js                  # User profile schema (height, startingWeight, currentWeight, targetWeight)
│   ├── controllers/
│   │   ├── healthController.js      # CRUD & biometrics controller
│   │   ├── goalController.js        # Goal management controller
│   │   ├── progressController.js    # Progress & rolling analytics controller
│   │   ├── reportController.js      # Clinical report generation controller
│   │   └── recommendationController.js # Dynamic rule-based recommendation controller
│   ├── routes/
│   │   ├── healthRoutes.js          # /api/health
│   │   ├── goalRoutes.js            # /api/goals
│   │   ├── progressRoutes.js        # /api/progress
│   │   ├── reportRoutes.js          # /api/reports
│   │   └── recommendationRoutes.js  # /api/recommendations
│   ├── services/
│   │   ├── bmiService.js            # Precise BMI calculation & category mapping
│   │   ├── progressService.js       # Dynamic goal adherence & achievement streak logic
│   │   ├── reportService.js         # Weekly, monthly, and custom period KPI aggregations
│   │   └── recommendationService.js # Intelligent rule-based recommendation engine
│   ├── middleware/
│   │   ├── errorHandler.js          # Centralized error formatter
│   │   └── validateRequest.js       # Strict boundary validation
│   ├── utils/
│   │   ├── dateUtils.js             # ISO date normalization
│   │   └── seedData.js              # 14-day realistic demonstration dataset
│   ├── app.js                       # Express app configuration & middleware
│   └── server.js                    # Server bootstrap & DB connection
├── tests/
│   └── api.test.js                  # Automated API & business logic test suite
├── scripts/
│   └── seed.js                      # Database initialization script
├── .env.example
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/health_fitness
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
USE_IN_MEMORY_DB=auto
```

> **Note on MongoDB**: If a native MongoDB daemon (`mongod`) is running locally, the server connects to it immediately. If not running, the system automatically starts an embedded MongoDB instance via `mongodb-memory-server` so the project can be demonstrated seamlessly with **zero manual database setup**.

### 3. Seed Demonstration Data (Optional)
```bash
npm run seed
```
*(The server also auto-seeds the 14-day history on first startup if the database is empty).*

### 4. Run Development Server
```bash
npm run dev
```
The API will be available at: **`http://localhost:5000`**

### 5. Run Automated Tests
```bash
npm test
```

---

## 📡 API Endpoints Reference

### 1. Health (`/api/health`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Get health history (supports `userId`, `startDate`, `endDate`, `limit`) |
| `POST` | `/api/health` | Create/upsert daily health record (auto-calculates BMI from weight & user height) |
| `GET` | `/api/health/:id` | Get specific health record |
| `PUT` | `/api/health/:id` | Update health record (recalculates BMI) |
| `DELETE`| `/api/health/:id` | Delete health record |
| `PATCH`| `/api/health/:id/weight` | Update weight (recalculates BMI and syncs user `currentWeight`) |
| `PATCH`| `/api/health/:id/water` | Update water intake |
| `PATCH`| `/api/health/:id/sleep` | Update sleep duration |
| `POST` | `/api/health/bmi` | Standalone BMI calculator endpoint (`weight`, `height`) |

### 2. Goals (`/api/goals`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/goals` | Get active fitness goals for user |
| `POST` | `/api/goals` | Create new goal configuration |
| `PUT` | `/api/goals` | Update active goals (syncs targetWeight & goalType with user) |
| `PATCH`| `/api/goals/:id` | Partial update for goal |
| `GET` | `/api/goals/user/profile` | Get user profile (height, starting/current/target weight) |
| `PUT` | `/api/goals/user/profile` | Update user profile |

### 3. Progress (`/api/progress`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/progress` | Compare latest biometrics against active goals with dynamic achievement badges |
| `GET` | `/api/progress/weekly` | Rolling 7-day averages, weight delta, and composite completion % |
| `GET` | `/api/progress/monthly` | Rolling 30-day averages and consistency score |

### 4. Reports (`/api/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/weekly` | Executive 7-day health audit with KPIs, achievements, and improvement areas |
| `GET` | `/api/reports/monthly` | Comprehensive 30-day health audit |
| `GET` | `/api/reports/custom` | Custom period audit with `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` |

### 5. Recommendations (`/api/recommendations`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/recommendations` | Dynamic recommendations (workout tips, goal advice, recovery insights, exercise catalog) |

---

## 🔗 Frontend Connection
In the React frontend (`health-fitness-person3/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```
All goal updates, health logging, progress calculations, reports, and recommendations flow directly through this backend.