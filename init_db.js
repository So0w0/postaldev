const sqlite3 = require('sqlite3');
const readline = require('readline');
const fs = require('fs');

const db = new sqlite3.Database('postal.db');

db.serialize(() =>{
    db.run('DROP TABLE IF EXISTS postalcode');
    db.run('CREATE TABLE IF NOT EXISTS postalcode(code TEXT, prefecture, city, address)');

    db.run('BEGIN TRANSACTION');

    const stmt = db.prepare('INSERT INTO postalcode(code, prefecture, city, address) VALUES(?,?,?,?)');

    const rs = fs.createReadStream('postal.csv');
    const rl = readline.createInterface({ input: rs});

    rl.on('line',(line) => {
        const [code, prefecture, city, address] = line.split(',');
        if (code && prefecture && city && address) {
            stmt.run(code, prefecture, city, address)
        }
    });

    rl.on('close',() => {
        stmt.finalize();

        db.run('COMMIT');
    });
});

