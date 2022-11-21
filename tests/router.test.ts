import { expect, test } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/index';

describe('TESTING of ROUTES', () => {
  test('[Routing]: Registration success', async () => {
    const response = await request(app.callback())
      .post('/api/registration')
      .send({ login: 'user25', password: 'testpass' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: Registration (bad login)', async () => {
    const response = await request(app.callback())
      .post('/api/registration')
      .send({ password: 'testpass' });
    expect(response.status).toBe(406);
    expect(response.text).toBe('"login" is required');
  });

  test('[Routing]: Registration (bad password)', async () => {
    const response = await request(app.callback())
      .post('/api/registration')
      .send({ login: 'user25' });
    expect(response.status).toBe(406);
    expect(response.text).toBe('"password" is required');
  });

  test('[Routing]: Login', async () => {
    const response = await request(app.callback())
      .post('/api/login')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: Login (Unauthorized)', async () => {
    const response = await request(app.callback())
      .post('/api/login')
      .auth('user25', 'testpassf', { type: 'basic' });
    expect(response.status).toBe(401);
  });

  test('[Routing]: Create List ', async () => {
    const response = await request(app.callback())
      .post('/api/list')
      .send({ listName: 'myFirstList' })
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: GET LIST', async () => {
    const response = await request(app.callback())
      .get('/api/list?userName=user25&listName=myFirstList')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: GET ALL LISTs', async () => {
    const response = await request(app.callback())
      .get('/api/list/all/user25')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: ADD RULE', async () => {
    const response = await request(app.callback())
      .put('/api/list/rules/update')
      .send({
        listName: 'myFirstList',
        rule: {
          name: 'allowed_to_read',
          value: true,
        },
      })
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: Create TASK ', async () => {
    const response = await request(app.callback())
      .post('/api/task')
      .send({
        userName: 'user25',
        listName: 'myFirstList',
        taskDescription: 'it is my first task!!',
      })
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: GET TASK', async () => {
    const response = await request(app.callback())
      .get('/api/task/?taskId=1&userName=user25&listName=myFirstList')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: GET ALL TASKS', async () => {
    const response = await request(app.callback())
      .get('/api/task/all?userName=user25&listName=myFirstList')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: UPDATE TASK BY ID', async () => {
    const response = await request(app.callback())
      .put('/api/task')
      .send({
        id: 1,
        userName: 'user25',
        listName: 'myFirstList',
        taskDescription: 'Updated description!',
      })
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: DELETE TASK', async () => {
    const response = await request(app.callback())
      .delete('/api/task?id=1&userName=user25&listName=myFirstList')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });

  test('[Routing]: DELETE LIST', async () => {
    const response = await request(app.callback())
      .delete('/api/list/myFirstList')
      .auth('user25', 'testpass', { type: 'basic' });
    expect(response.status).toBe(200);
  });
});
