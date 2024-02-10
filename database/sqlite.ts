import * as SQLite from "expo-sqlite";
import { formatDate } from "./insertions";

const db = SQLite.openDatabase("ring-tracker.db");
const remove = false;
const seed = true;
const seedCount = 10;

export function initDatabase(db: SQLite.Database) {
    db.transaction((tx) => {
        if (remove) {
            console.log("removing all tables");
            tx.executeSql(`
                DROP TABLE IF EXISTS insertions;
                DROP TABLE IF EXISTS insertion_detail;
            `);
        }
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS insertions(
                id INTEGER PRIMARY KEY,
                inserted BOOLEAN,
                date TEXT UNIQUE
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
    db.transaction((tx) => {
        if (seed) {
            console.log("seeding");
            let date = new Date();
            for (let i = 0; i < seedCount; i++) {
                date.setDate(
                    date.getDate() - Math.floor(Math.random() * seedCount),
                );
                tx.executeSql(
                    `INSERT INTO insertions (inserted, date) VALUES (?,?);`,
                    [i % 2, formatDate(date)],
                );
            }
        }
    });
};

export default db;
