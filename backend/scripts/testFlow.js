async function testFlow() {
  const base = 'http://localhost:5000/api';
  console.log('=== 1. Checking Status ===');
  const s = await fetch(base + '/status').then(r => r.json());
  console.log('Status:', s.status, '| Database:', s.database);

  console.log('=== 2. Updating Goals ===');
  const g = await fetch(base + '/goals', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'usr_alex_01', stepGoal: 12000, weightGoal: 64.5, calorieGoal: 2100, waterGoal: 3.0, sleepGoal: 8.5 })
  }).then(r => r.json());
  console.log('Updated Goals Step Target:', g.data.stepGoal, '| Weight Target:', g.data.weightGoal);

  console.log('=== 3. Logging New Health Data ===');
  const today = new Date().toISOString().split('T')[0];
  const h = await fetch(base + '/health', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'usr_alex_01', date: today, weight: 68.0, height: 170, waterIntake: 2.8, sleepDuration: 8.0, steps: 11500, calories: 2050 })
  }).then(r => r.json());
  console.log('Saved Health Date:', h.data.date, '| BMI:', h.data.bmi);

  console.log('=== 4. Testing Dedicated BMI Calculator Endpoint ===');
  const bmiRes = await fetch(base + '/health/bmi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weight: 68.0, height: 170 })
  }).then(r => r.json());
  console.log('BMI Value:', bmiRes.data.bmi, '| Category:', bmiRes.data.category);

  console.log('=== 5. Fetching Dynamic Progress ===');
  const p = await fetch(base + '/progress?userId=usr_alex_01').then(r => r.json());
  console.log('Overall Completion:', p.data.overall + '%');
  console.log('Step Progress:', p.data.steps.percentage + '%');
  console.log('Unlocked Achievements:', p.data.achievements.map(a => a.title).join(', '));

  console.log('=== 6. Generating Clinical Weekly Report ===');
  const rep = await fetch(base + '/reports/weekly?userId=usr_alex_01').then(r => r.json());
  console.log('Weekly Report Period:', rep.data.period);
  console.log('Weekly Avg Steps:', rep.data.metrics.avgSteps);
  console.log('Weight Progress Status:', rep.data.metrics.weightProgress);

  console.log('=== 7. Fetching Smart Recommendations ===');
  const rec = await fetch(base + '/recommendations?userId=usr_alex_01').then(r => r.json());
  console.log('Workout Recommendations Count:', rec.data.workoutRecommendations.length);
  console.log('Top Workout Advice:', rec.data.workoutRecommendations[0].title);
  console.log('Goal Recommendations Count:', rec.data.goalRecommendations.length);

  console.log('\n=============================================');
  console.log('SUCCESS: Full Demonstration Workflow Verified');
  console.log('=============================================');
}

testFlow().catch(console.error);
