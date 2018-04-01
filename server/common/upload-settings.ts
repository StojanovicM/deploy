import * as multer from 'multer';
import * as path from "path";

export let upload = multer({ 
	storage: multer.diskStorage({
		destination: (req, file, cb) => cb(null, process.cwd() + '/archive'),
		filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now() + ".xls"),
		onError : (err, next) => { next(err); }
	}),
	fileFilter: (req, file, cb) => {
		// File must have extension .xls or mimetype ms-excel
		var ext = path.extname(file.originalname);		
		if (ext !== '.xls' || file.mimetype !== 'application/vnd.ms-excel') { 
			return cb(new Error('Only xls files are allowed'));
		}		
        cb(null, true);
	}
});