import { Router } from 'express';
import { db } from "../common/db-knex";

const router = Router();
let sortByMap = ['clientName', 'amount', 'provider', 'fileName', 'inputDate'];

router.get("", (req, res, next) => {

    let sortBy = req.query.sortby;
    let direction = +req.query.sort_direction ? "asc" : "desc";

    let filters = {
        clientName : req.query.clientName,
        provider : req.query.provider,
        fileName : req.query.fileName
    }
    let whereFilters = JSON.parse(JSON.stringify(filters));

    let offset = req.query.offset || 0;

    let query = db('requirement as r')
        .join('client as c', 'r.clientId', '=', 'c.clientId')
        .join('fileMetaData as f', 'r.fileMetaDataId', "=", 'f.fileMetaDataId')
        .select('r.clientId', 'clientName', 'amount', 'provider', 'fileName', 'inputDate')
        .limit(50).offset(+offset * 50);

    sortBy ? query.orderBy(sortByMap[sortBy], direction) : query.orderBy('r.id');
    if (Object.keys(whereFilters).length > 0) { 
        Object.keys(whereFilters).forEach((key, i) => {
            if (i === 0) query.where(key, 'like', `%${whereFilters[key]}%`)
            else query.orWhere(key, 'like', `%${whereFilters[key]}%`)
        });
    }

    query.then(results => res.send(results));
});


router.post("/single", (req, res, next) => {

    let clientId = req.body.id;

    let query = db('requirement as r')
        .join('client as c', 'r.clientId', '=', 'c.clientId')
        .join('fileMetaData as f', 'r.fileMetaDataId', "=", 'f.fileMetaDataId')
        .select('clientName', 'r.createdOn', 'amount', 'fileName')
        .where('r.clientId', '=', clientId)

    query.then(result => {
        
        let clientName = result[0].clientName;
        let createdOn = result[0].createdOn;
        let totalRecords = result.length;
        let fileNameList = result.map(r => r.fileName);
        let saldo = 0;
        result.map(r => saldo += r.amount);
        
        res.send({
            clientName: clientName,
            createdOn : createdOn,
            totalRecords : totalRecords,
            fileNameList : fileNameList,
            totalAmount : saldo
        });
    });
})

export const dataRoutes: Router = router;