import httpStatus from "http-status";
import faker from '@faker-js/faker'
import supertest from "supertest"
import * as jwt from 'jsonwebtoken'
import { TicketStatus } from "@prisma/client";
import {cleanDb, generateValidToken} from '../helpers'
import app, {init} from '@/app'
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketTypeWithHotel, createUser } from "../factories";
import { createFakeBooking } from "../factories/booking-factory";

beforeAll(async () => {
    await init()
})

beforeEach(async () => {
    await cleanDb()
})

const server = supertest(app)

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      describe('when token is valid', () => {
        it('should respond with status 200 when everything is OK', async () => {
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user)
            const ticketType = await createTicketTypeWithHotel()
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
            await createPayment(ticket.id, ticketType.price)

            const createdHotel = await createHotel()
            const createdRoom = await createRoomWithHotelId(createdHotel.id)
            const createdBooking = await createFakeBooking(createdRoom.id, user.id)

            const response = await server.get('/booking').set('Authorization', `Bearer ${token}`)
            expect(response.status).toEqual(httpStatus.OK)
            expect(response.body).toEqual({
                id: createdBooking.id,
                Room: {
                    id: createdRoom.id,
                    name: createdRoom.name,
                    capacity: createdRoom.capacity,
                    hotelId: createdRoom.hotelId,
                    createdAt: createdRoom.createdAt.toISOString(),
                    updatedAt: createdRoom.updatedAt.toISOString()
                }
            })
        })
      })
})

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
      it('should respond with status 200 when everything is OK', async () => {
          const user = await createUser()
          const token = await generateValidToken(user)
          const enrollment = await createEnrollmentWithAddress(user)
          const ticketType = await createTicketTypeWithHotel()
          const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
          await createPayment(ticket.id, ticketType.price)

          const createdHotel = await createHotel()
          const createdRoom = await createRoomWithHotelId(createdHotel.id)

          const body = {roomId: createdRoom.id}
          const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body)
          expect(response.status).toEqual(httpStatus.OK)
          expect(response.body).toEqual({
              bookingId: expect.any(Number)
          })
      })
    })
})

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
      const response = await server.get('/hotels');
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if given token is not valid', async () => {
      const token = faker.lorem.word();
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
  
    it('should respond with status 401 if there is no session for given token', async () => {
      const userWithoutSession = await createUser();
      const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
      it('should respond with status 200 when everything is OK', async () => {
          const user = await createUser()
          const token = await generateValidToken(user)
          const enrollment = await createEnrollmentWithAddress(user)
          const ticketType = await createTicketTypeWithHotel()
          const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID)
          await createPayment(ticket.id, ticketType.price)

          const createdHotel = await createHotel()
          const createdRoom = await createRoomWithHotelId(createdHotel.id)
          const createdRoom2 = await createRoomWithHotelId(createdHotel.id)
          const createdBooking = await createFakeBooking(createdRoom.id, user.id)

          const body = {roomId: createdRoom2.id}
          const response = await server.put(`/booking/${createdBooking.id}`).set('Authorization', `Bearer ${token}`).send(body)
          expect(response.status).toEqual(httpStatus.OK)
          expect(response.body).toEqual({
              bookingId: expect.any(Number)
          })
      })
    })
})