import { test, expect } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

test('should be able to login user', async () => {
    const response = await request(app)
        .post('/sessions')
        .send(({
            register: '30008650',
            password: '35579',
        }))
    expect(response.statusCode).toEqual(200)
    console.log(response.body.token)

})



