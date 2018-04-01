import * as knex from "knex";
import { Config } from "../config";

export const db :knex = knex(Config.db);