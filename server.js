process.title = 'node_mvc';

const express = require('express');
const bodyparser = require('body-parser');
const sqlite3 = require('sqlite3');

const app = express();
app.use(bodyparser.json());
app.use(express.static('public'));

const db = new sqlite3.Database('students.sqlite');

app.get('/students/',(req,res)=>{
	const q = `select * from students`;
	db.all(q,(err,rows)=>{
		if(err){
			res.json({'message':'failure','code':err});
			console.error(err);
			return;
		}
		res.json(rows);
	});
});

app.post('/students/',(req,res)=>{
	if(req.body && req.body.fname && req.body.lname && req.body.id && req.body.admission_year){
		const q = `insert into students values ('${req.body.fname}','${req.body.lname}','${req.body.id}','${req.body.admission_year}')`;
		db.run(q,(err)=>{
			if(err){
				res.json({'message':'failure','code':err});
				console.error(err);
				return;
			}
			res.json({'message':'success'});
		});
	} else {
		res.sendStatus(404);
	}
});

app.get('/students/cumulative/',(req,res)=>{
	let q = 'select count(*) as count from students';
	db.all(q,(err,rows)=>{
		if(err){
			res.json({'message':'failure','code':err});
			return;
		}
		const count = rows[0].count;
		q = 'select avg(admission_year) as average from students';
		db.all(q,(err,rows)=>{
			if(err){
				res.json({'message':'failure','code':err});
				console.error(err);
				return;
			}
			const average = rows[0].average;
			res.json({'count':count,'average':average});
		});
	});
});

const SERVER_PORT = 80;
app.listen(SERVER_PORT, ()=>{
	console.log(`Server running on port ${SERVER_PORT}`);
});