import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import projects from './routes/projects.mjs';
import authModel from './models/auth.mjs';

const port = process.env.PORT || 8866;
const app = express();

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/projects", projects);

app.post("/login", (req, res) => authModel.login(req, res));
app.post("/register", (req, res) => authModel.register(req, res));

app.get('/', (req, res) => res.send("docs"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
