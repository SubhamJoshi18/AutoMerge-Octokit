import cors from 'cors';
export const corsConfig = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
};
