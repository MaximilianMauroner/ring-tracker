import * as SQLite from "expo-sqlite";
import { Insertion } from "./types";
import { create } from "zustand";
import db from "./sqlite";
import { formatDate } from "./helpers";

export type InsertionsStore = {
    insertions: Insertion[];
    add(date: Date, inserted: boolean): void;
    update(item: Insertion, inserted: boolean): void;
    remove: (item: Insertion) => void;
};

const fetchInsertions = (db: SQLite.SQLiteDatabase) => {
    console.log("here");

    let insertedValues: Insertion[] = [];

    db.readTransaction((tx) => {
        tx.executeSql(
            "SELECT * FROM insertions ORDER BY date DESC;",
            [],
            (_, { rows: { _array } }) => {
                insertedValues = _array.map((i: any) => {
                    return {
                        id: i.id,
                        date: new Date(i.date),
                        inserted: i.inserted === 1,
                    };
                });
                insertedValues.push({
                    id: 0,
                    date: new Date(),
                    inserted: false,
                });
            },
        );
    });
    console.log("inserted", insertedValues);

    return insertedValues;
};

const useInsertions = create<InsertionsStore>((set) => ({
    insertions: fetchInsertions(db),
    add: (date: Date, inserted: boolean) => {
        addInsertion(db, date, inserted);
        set((state) => ({
            ...state,
            insertions: fetchInsertions(db),
        }));
    },
    update: (item: Insertion, inserted: boolean) => {
        updateInsertion(db, item.id, inserted);
        set((state) => ({
            ...state,
            insertions: fetchInsertions(db),
        }));
    },
    remove: (item: Insertion) => {
        removeInsertion(db, item.id);
        set((state) => ({
            ...state,
            insertions: fetchInsertions(db),
        }));
    },
}));

const addInsertion = (
    db: SQLite.SQLiteDatabase,
    date: Date,
    inserted: boolean,
) => {
    db.transaction((tx) => {
        tx.executeSql("INSERT INTO insertions (date, inserted) VALUES (?,?);", [
            formatDate(date),
            inserted ? 1 : 0,
        ]);
    });
};

const updateInsertion = (
    db: SQLite.SQLiteDatabase,
    id: number,
    inserted: boolean,
) => {
    db.transaction((tx) => {
        tx.executeSql("UPDATE insertions SET inserted = ? WHERE id = ?;", [
            inserted ? 1 : 0,
            id,
        ]);
    });
};

const removeInsertion = (db: SQLite.SQLiteDatabase, id: number) => {
    db.transaction((tx) => {
        tx.executeSql("DELETE FROM insertions WHERE id = ?;", [id]);
    });
};

export default useInsertions;
