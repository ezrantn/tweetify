import express from "express";
import { publicRouter } from "../router/public-api";
import { privateApi } from "../router/api";

export const web = express()
web.use(express.json());
web.use(publicRouter);
web.use(privateApi);