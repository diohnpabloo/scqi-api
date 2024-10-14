import { test, expect } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

test('should be able to create new user', async () => {
    const responseCreateNewUser = await request(app)
    .post('/sessions')
    .send(({
        register: '30008650',
        password: '35579',
    }))

    const token = responseCreateNewUser.body.token

    await request(app)
    .post("/users")
    .set("Authorization", `Bearer ${token}`)
    .send({
        register: '30008634',
        name: 'test',
        password: 'test',
        email: 'test@email.com'
    })
    .expect(201)
})

