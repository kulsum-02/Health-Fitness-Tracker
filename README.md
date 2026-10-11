# FitPulse Pro — Health, Goals, Progress & Recommendations (Person 3 Module)

A complete, production-grade React.js frontend built for **PERSON 3: Goals + Health + Progress + Recommendations** in a comprehensive health and fitness management platform.

---

## 🌟 Key Features & Implementation

### 1. Goal Setting & Management (`/goals`)
- **Configurable Milestones**: Set Daily Step Goal (10k), Daily Calorie Budget (2.2k kcal), Target Weight (kg), Daily Water Goal (L), Sleep Duration (hrs), and Workout Frequency (days/wk).
- **Goal Presets**: One-click configuration for *Fat Loss*, *Muscle Gain*, and *Maintenance*.
- **Dynamic Goal Status**: Dynamic calculation of achievement stage:
  - `Not Started` (< 10%)
  - `In Progress` (10% - 74%)
  - `Almost Achieved` (75% - 99%)
  - `Achieved` (100% - 110%)
  - `Exceeded` (> 110%)
- **Real-Time Synchronous Updates**: Updating any goal immediately recalculates dashboard summary cards, chart reference lines, progress percentages, and recommendation algorithms without refreshing the browser.

### 2. Daily Health Tracking & Dynamic BMI (`/health`)
- **Biometric Logging Form**: Entry for Weight (kg), Water Intake (L), Sleep Duration (hrs), Steps Completed, Calories Consumed, and Date.
- **Strict Validation Layer**:
  - Validates positive numerical values and non-negative integers.
  - Guards against physiologically impossible records (e.g. sleep > 24h, weight < 20kg or > 350kg, water > 15L, calories > 10,000).
  - Prevents future dates and missing fields with clear, context-specific error prompts.
- **Interactive BMI Calculator**:
  - Live mathematical formula: $\text{BMI} = \frac{\text{Weight (kg)}}{(\text{Height (m)})^2}$.
  - Segmented visual color scale (*Underweight < 18.5*, *Normal 18.5–24.9*, *Overweight 25.0–29.9*, *Obese $\ge$ 30.0*).
  - Floating needle indicator showing exact position.
  - Clinical guidance and calculated healthy weight target range for the user's specific height.
- **Health History Data Table**:
  - Interactive table displaying Date, Weight, Water, Sleep, Steps, Calories, and computed BMI.
  - Quick filters for: **Today**, **Last 7 Days (Week)**, **Last 30 Days (Month)**, and **All Records**.
  - One-click **Export to CSV**.
  - Individual record deletion with instant state re-calculation.

### 3. Comprehensive Progress Analytics (`/progress`)
- **Interactive Responsive Charts (Recharts)**:
  - **Weight Trajectory**: Starting weight line, historical data points, and target weight reference line.
  - **Daily Steps**: Bar chart with goal reference threshold and color changes when surpassed.
  - **Hydration Tracking**: Daily water intake vs 2.5L target.
  - **Sleep Duration**: Area chart with 7.0–9.0 hour optimal recovery zone.
  - **Caloric Intake**: Consumption vs daily budget.
  - **Weekly Composite Performance**: Combined dual-axis chart (Steps and Weight).
- **Weekly & Monthly Progress Aggregations**:
  - Rolling averages for weight, steps, water, sleep, and calories.
  - Net delta indicators (e.g., $\downarrow 0.8\text{ kg}$).
  - Multi-vector overall goal adherence percentage.
- **Dynamic Achievement System**:
  - Unlocked based on real data evaluations:
    - 🏆 *Step Goal Achieved* (Daily 10k+)
    - 💧 *Hydration Hero* (Hit water goal)
    - 😴 *Rest & Recovery* (Hit sleep goal)
    - ⚖️ *Weight Milestone* (Progressed $\ge 50\%$ towards target)
    - 🔥 *7-Day Consistency Streak* (Logged data 7+ consecutive days)
    - ⚡ *Step Master Streak* (Hit step goal 3 days in a row)

### 4. Executive Health & Progress Reports (`/reports`)
- **Weekly & Monthly Report Generations**:
  - Executive KPI summary cards.
  - Trajectory trend graphs.
  - Dynamic achievements earned in the selected period.
  - Algorithmic detection of **Areas Needing Attention** (e.g., hydration dips, sleep debt).
  - Actionable clinical and behavioral recommendations.
- **Real Export Capabilities**:
  - **Download Report (.txt / summary)**.
  - **Export Dataset (.csv)**.
  - **Print / Save PDF**: Custom `@media print` stylesheets to cleanly print or save as PDF without sidebars/navigation bars.

### 5. Intelligent Frontend Recommendation Engine (`/recommendations`)
- **Modular Rule-Based Analyzer (`src/utils/recommendationEngine.js`)**:
  - Analyzes current weight, target weight, BMI, recent 7-day average steps vs goal, water vs goal, sleep averages, and selected goal strategy.
- **Workout Recommendations**: Low step count triggers brisk walking recommendation; high step consistency recommends 3x weekly strength sessions; sleep debt triggers restorative mobility stretches.
- **Goal-Based Recommendations**: Specific nutritional and activity guidelines for *Weight Loss*, *Muscle Gain*, and *General Fitness*.
- **Progress-Based Suggestions**: Dynamic alerts informing user of hydration deficits, sleep trends, or positive weight trajectory.
- **Filterable Exercise Catalog**: Interactive directory (Walking, Interval Jogging, Cycling, Squats, Push-ups, Planks, Lunges, Full-body Stretching, Dumbbell Rows) filterable by difficulty and category.

---

## 🛠️ Architecture & Backend Readiness

```
src/
├── components/          # Reusable UI components
│   ├── AchievementBadge.jsx
│   ├── BMIWidget.jsx
│   ├── EmptyState.jsx
│   ├── GoalCard.jsx
│   ├── GoalForm.jsx
│   ├── HealthCard.jsx
│   ├── HealthForm.jsx
│   ├── HealthHistoryTable.jsx
│   ├── LoadingSpinner.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   ├── ProgressBar.jsx
│   ├── ProgressRing.jsx
│   ├── RecommendationCard.jsx
│   ├── Sidebar.jsx
│   └── ToastContainer.jsx
├── pages/               # Top-level route pages
│   ├── DashboardPage.jsx
│   ├── GoalsPage.jsx
│   ├── HealthPage.jsx
│   ├── ProgressPage.jsx
│   ├── RecommendationsPage.jsx
│   └── ReportsPage.jsx
├── layouts/             # DashboardLayout with responsive sidebar & mobile drawer
│   └── DashboardLayout.jsx
├── charts/              # Recharts responsive chart modules
│   ├── CalorieChart.jsx
│   ├── SleepChart.jsx
│   ├── StepsChart.jsx
│   ├── WaterChart.jsx
│   ├── WeeklyPerformanceChart.jsx
│   └── WeightChart.jsx
├── context/             # Centralized reactive state
│   ├── GoalContext.jsx
│   ├── HealthContext.jsx
│   └── ToastContext.jsx
├── services/            # Centralized API & fallback layer
│   ├── apiClient.js
│   ├── goalService.js
│   ├── healthService.js
│   ├── recommendationService.js
│   ├── reportService.js
│   └── storageService.js
├── data/                # Initial seed data & exercise catalog
│   ├── exerciseCatalog.js
│   └── mockData.js
├── utils/               # Pure business logic & calculation functions
│   ├── bmiCalculator.js
│   ├── dateUtils.js
│   ├── exportUtils.js
│   ├── progressCalculators.js
│   ├── recommendationEngine.js
│   └── validationUtils.js
├── styles/              # Global styles & Tailwind CSS
│   └── index.css
├── App.jsx              # Main routing & Provider composition
└── main.jsx             # React DOM entry point
```

### Backend Integration
When an Express.js server is ready:
1. Set `VITE_API_URL=http://localhost:5000/api` in `.env`.
2. The `apiClient.js` automatically routes calls to your live backend.
3. If the backend is offline or `VITE_API_URL` is empty, the application seamlessly runs on its intelligent local fallback layer with LocalStorage persistence and an instant "Reset Demo Data" option.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
cd health-fitness-person3
npm install
```

### Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port Vite outputs).

### Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Demonstration Flow (Section 31)

1. **Open Dashboard** (`/dashboard`): Observe Health Summary cards (Weight: 68.4 kg / 72% progress, Water: 1.8 L / 72%, Sleep: 7.1 hrs / 89%, Steps: 7,842 / 78%).
2. **Go to Goals** (`/goals`):
   - Set Step Goal = 12,000, Calorie Goal = 2,000, Target Weight = 64 kg.
   - Click **Save Goals & Update Dashboard**.
   - Notice the immediate success toast.
3. **Go to Health Tracking** (`/health`):
   - Fill in today's entry (e.g. Weight: 67.8 kg, Water: 2.8 L, Sleep: 8.2 hrs, Steps: 12,500, Calories: 1,980).
   - Watch the live BMI calculation update to **23.5 (Normal)** as you type the weight.
   - Click **Save Health Record**.
4. **Return to Dashboard** (`/dashboard`):
   - All summary cards reflect the updated numbers (Weight: 67.8 kg, Water: 2.8 L, Steps: 12,500).
5. **View Progress** (`/progress`):
   - See all 5 charts update with the newly recorded data point.
   - Inspect the **Achievement Badges** section—notice *Step Goal Achieved* and *Hydration Hero* unlock!
6. **Generate Reports** (`/reports`):
   - Click **Generate Report**.
   - Switch between **Weekly Report** and **Monthly Report**.
   - Test **Download Report** and **Print / PDF**.
7. **View Recommendations** (`/recommendations`):
   - Notice recommendations change dynamically based on the updated step count and hydration achievements.
   - Filter the Exercise Catalog by difficulty and category.