import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as  logger from 'morgan';
import * as http from "http";
import { join } from 'path';
import { Config } from "./config";
import { ingestorRoutes } from "./routes/ingestor.routes";
import { dataRoutes } from './routes/data.route';

const app: express.Application = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/ingest', ingestorRoutes);
app.use('/data', dataRoutes);
app.use(express.static(join(__dirname, "../public")));
app.get('/*', (req, res, next) => res.sendFile(join(__dirname, "../public", "index.html")));

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ 
        title: err.title ? err.title : "Error",
        message: err.message ? err.message : "Unknown Error"
    });
});

http.createServer(app)
.listen(Config.port, () => console.log("Running on port " + Config.port));