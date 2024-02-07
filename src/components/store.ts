import { Insertion } from "./types";
import * as SQLite from "expo-sqlite";

export function openDatabase() {
    const db = SQLite.openDatabase("ring-tracker.db");
    createStore(db);
    return db;
}

const createStore = (db: SQLite.SQLiteDatabase) => {
    const remove = false;
    const seed = false;
    db.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS insertions
            (
                id       INTEGER PRIMARY KEY NOT NULL,
                inserted TINYINT,
                date     TEXT,
                value    TEXT
            );`,
        );
        if (remove) tx.executeSql(`DELETE FROM insertions WHERE  1;`);
        if (seed) {
            let date = new Date();
            const count = 10;
            console.log("seeding", count, "insertions");
            for (let i = 0; i < count; i++) {
                date.setDate(
                    date.getDate() - Math.floor(Math.random() * count),
                );
                tx.executeSql(
                    `INSERT INTO insertions (inserted, date, value) VALUES (?,?,?);`,
                    [i % 2, date.toISOString(), `value ${i}`],
                );
            }
        }
    });
};

export function insert(
    db: SQLite.SQLiteDatabase,
    date: Date,
    inserted: boolean,
    value = "",
) {
    db.transaction((tx) => {
        tx.executeSql(
            `insert into insertions (inserted, date, value) values (? , ?, ?);`,
            [inserted ? 1 : 0, date.toISOString(), value],
            () => {},
            errorCallback,
        );
    });
}

export function readInsertions(
    db: SQLite.SQLiteDatabase,
    setInsertions: (insertions: Insertion[]) => void,
) {
    db.transaction((tx) => {
        tx.executeSql(
            `select * from insertions order by date desc;`,
            [],
            (_, { rows: { _array } }) => {
                _array.forEach((insertion) => {
                    insertion.date = new Date(insertion.date);
                    insertion.inserted = insertion.inserted === 1;
                });
                setInsertions(_array as Insertion[]);
            },
            errorCallback,
        );
    });
}

function errorCallback(
    transaction: SQLite.SQLTransaction,
    error: SQLite.SQLError,
) {
    console.log("Error ", error);
    return false;
}
