import sqlite3 from 'sqlite3';

const dbPath = "./app.db";
const db = new sqlite3.Database(dbPath, (error: any) => {
    if (error) {
        console.error(error.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`);
    }
});

export default db;