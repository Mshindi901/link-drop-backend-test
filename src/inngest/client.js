import {Inngest} from 'inngest'
import dotenv from 'dotenv';
dotenv.config();

export const client = new Inngest({id: 'my-app', eventKey: process.env.INNGEST_EVENT_KEY });