import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("ring-tracker.db");

export function initDatabase(db: SQLite.Database) {
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS insertions(
                id INTEGER PRIMARY KEY,
                inserted BOOLEAN,
                date TEXT
            );
            CREATE TABLE IF NOT EXISTS insertion_detail (
                id INTEGER PRIMARY KEY,
                insertionId INTEGER,
                description TEXT,
                rating REAL
            );
            `,
        );
    });
}

export const setup_functions = () => {
    const remove = false;
    const seed = true;
    db.transaction((tx) => {
        if (remove) tx.executeSql(`DELETE FROM insertions WHERE  1;`);
        if (seed) {
            console.log("seeding");
            let date = new Date();
            for (let i = 0; i < 10; i++) {
                date.setDate(date.getDate() - Math.floor(Math.random() * 10));
                tx.executeSql(
                    `INSERT INTO insertions (inserted, date) VALUES (?,?);`,
                    [i % 2, date.toISOString()],
                );
            }
        }
    });
};

export default db;
