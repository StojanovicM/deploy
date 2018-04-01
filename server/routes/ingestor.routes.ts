import { Router } from 'express';
import * as multer from 'multer';
import * as xlsx from 'xlsx';
import { db } from "../common/db-knex";
import { migrateTables } from "../common/table-migrations";
import { upload } from '../common/upload-settings';
import { IRecord } from './../common/interfaces';

const router = Router();

// Accept datasheet file, and inject data in DB
router.post('', upload.single('datasheet'), (req, res, next) => {

	// Read file, loop through sheet list and convert it to json format
	let uploadedFileName = (req['file'].filename);
	let workBook = xlsx.readFile(process.cwd() + '/archive/' + uploadedFileName);
	let jsonWB :IRecord[]= xlsx.utils.sheet_to_json(workBook.Sheets['Ingest data']);
	
	// Create tables and populate them
	migrateTables()
	.then(() => {

		let insertRow = async (record :IRecord) => {
			await db('client').insert({
				"clientId" : record.clientId,
				"clientName" : record.clientName
			}).catch(err => { if (err.code !== "ER_DUP_ENTRY") { console.log(err); } });

			await db('fileMetaData').insert({
				"fileMetaDataId": record.fileMetaDataId,
				"fileName": record.fileName,
				"sourceId": record.source.split(":")[0],
				"provider": record.source.split(":")[1],
			}).catch(err => { if (err.code !== "ER_DUP_ENTRY") { console.log(err); } });
			
			await db('requirement').insert({
				"clientId" : record.clientId,
				"amount":  +record.amount.replace("$", "").replace(",", "").split(".")[0],
				"inputDate": record.inputDate,					
				"fileMetaDataId": record.fileMetaDataId,
			}).catch(err => { if (err.code !== "ER_DUP_ENTRY") { console.log(err); } });
		}

		let insertData = async (record) => {
			await insertRow(record)
		}

		/*--------------INSERT DATA INTO DATABASE IN SYNC WAY-----------------
		async function populateTable (array :IRecord[]) {
			for (let record of jsonWB) { await insertData(record); }
			res.status(200).json({message: 'file uploaded'});			
		}
		---------------(slower but does preserve data order)---------------*/

		/*--------------INSERT DATA INTO DATABASE IN ASYNC WAY-----------------*/
		async function populateTable (array :IRecord[]) {
			const promises = array.map(insertData);
			await Promise.all(promises);
			res.status(200).json({message: 'file uploaded'});
		}
		/*---------------(faster but does not preserve data order)---------------*/

		populateTable(jsonWB);

	})
	.catch(e => console.log(e));
});


export const ingestorRoutes: Router = router;