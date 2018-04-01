import { db } from "./db-knex";

export const migrateTables = async () => {
    
    await db.schema.dropTableIfExists('requirement');
    await db.schema.dropTableIfExists('client');
    await db.schema.dropTableIfExists('fileMetaData');

    await db.schema.createTable('client', (table) => {
        table.increments().unsigned().primary();
        table.string('clientId').unique().index();
        table.string('clientName');
        table.timestamp('createdOn');
    });

    await db.schema.createTable('fileMetaData', (table) => {
        table.increments().unsigned().primary();
        table.string('fileMetaDataId').unique().index();
        table.string('fileName');
        table.string('sourceId');
        table.string('provider');
        table.timestamp('createdOn');
    });

    await db.schema.createTable('requirement', (table) => {
        table.increments().unsigned().primary();
        table.string('clientId').references('clientId').inTable('client');
        table.integer('amount');
        table.dateTime('inputDate');
        table.string('fileMetaDataId').references('fileMetaDataId').inTable('fileMetaData');
        table.timestamp('createdOn');
    });
}