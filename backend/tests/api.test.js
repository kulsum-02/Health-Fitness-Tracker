import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { Health } from '../src/models/Health.js';
import { Goal } from '../src/models/Goal.js';
import { User } from '../src/models/User.js';
import { runSeed } from '../scripts/seed.js';

let app;

test.before(async () => {
  process.env.NODE_ENV = 'test';
  await connectDatabase();
  await runSeed();
  app = createApp();
});

test.after(async () => {
  await disconnectDatabase();
});

test('GET /api/status returns operational status and db status', async () => {
  const res = await request(app).get('/api/status');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.status, 'operational');
  assert.equal(res.body.database, 'connected');
});

test('POST /api/health/bmi calculates BMI accurately with clinical category', async () => {
  const res = await request(app)
    .post('/api/health/bmi')
    .send({ weight: 68.4, height: 170 });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.bmi, 23.7);
  assert.equal(res.body.data.category, 'Normal');
  assert.ok(res.body.data.healthyWeightRange);
});

test('POST /api/health rejects invalid or out-of-bounds measurements', async () => {
  const res = await request(app)
    .post('/api/health')
    .send({
      date: '2026-10-10',
      weight: -5, // invalid negative weight
      waterIntake: 25, // impossible > 15L
      sleepDuration: 30, // impossible > 24h
      steps: -100, // negative steps
      calories: 100 // below minimum daily metabolic needs
    });

  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.errors.length >= 4);
});

test('POST /api/health successfully saves valid record and calculates BMI', async () => {
  const res = await request(app)
    .post('/api/health')
    .send({
      userId: 'usr_alex_01',
      date: '2026-10-09',
      weight: 68.0,
      waterIntake: 2.8,
      sleepDuration: 8.0,
      steps: 10500,
      calories: 2100
    });

  assert.ok(res.status === 200 || res.status === 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.weight, 68.0);
  assert.equal(res.body.data.bmi, 23.5); // 68 / 1.7^2
});

test('GET /api/health returns sorted health history', async () => {
  const res = await request(app).get('/api/health?userId=usr_alex_01');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.data.length >= 10);
});

test('GET /api/goals returns active fitness goals', async () => {
  const res = await request(app).get('/api/goals?userId=usr_alex_01');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.stepGoal, 10000);
  assert.equal(res.body.data.weightGoal, 65.0);
});

test('PUT /api/goals updates targets and validates bounds', async () => {
  const res = await request(app)
    .put('/api/goals')
    .send({
      userId: 'usr_alex_01',
      stepGoal: 12000,
      calorieGoal: 2000,
      weightGoal: 64.0
    });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.stepGoal, 12000);
  assert.equal(res.body.data.weightGoal, 64.0);
});

test('GET /api/progress calculates dynamic completion percentages and achievements', async () => {
  const res = await request(app).get('/api/progress?userId=usr_alex_01');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.weight);
  assert.ok(res.body.data.steps);
  assert.ok(res.body.data.water);
  assert.ok(res.body.data.sleep);
  assert.ok(res.body.data.calories);
  assert.ok(Array.isArray(res.body.data.achievements));
});

test('GET /api/reports/weekly generates comprehensive clinical report', async () => {
  const res = await request(app).get('/api/reports/weekly?userId=usr_alex_01');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.type, 'weekly');
  assert.ok(res.body.data.metrics.avgSteps);
  assert.ok(res.body.data.metrics.avgWater);
  assert.ok(res.body.data.recommendations.length > 0);
});

test('GET /api/recommendations evaluates rules and returns targeted advice', async () => {
  const res = await request(app).get('/api/recommendations?userId=usr_alex_01');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(Array.isArray(res.body.data.workoutRecommendations));
  assert.ok(Array.isArray(res.body.data.goalRecommendations));
  assert.ok(Array.isArray(res.body.data.exerciseSuggestions));
});