import type, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import express from 'express';
import morgan from 'morgan';
import { corsConfig } from '../config/corsConfig.js';

const initalizeMiddleware = (expressApplication: Application) => {
  expressApplication.use(cors(corsConfig as CorsOptions));
  expressApplication.use(express.json());
  expressApplication.use(express.urlencoded({ extended: true }));
  expressApplication.use(morgan('dev'));
};

export { initalizeMiddleware };
