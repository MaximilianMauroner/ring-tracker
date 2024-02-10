import { useState } from "react";
import * as SQLite from "expo-sqlite";
import { Insertion } from "./types";
import moment from "moment";

export function useInsertion() {
    const [insertions, setInsertions] = useState<Insertion[]>([]);

    const fetchInsertions = (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
            "SELECT * FROM insertions ORDER BY date DESC;",
            [],
            (_, { rows: { _array } }) => {
                console.log("len", _array.length), setInsertions(_array);
            },
        );
    };

    const getInsertions = (db: SQLite.Database) => {
        db.readTransaction(fetchInsertions);
    };

    const addInsertion = (
        db: SQLite.Database,
        date: Date,
        inserted: boolean,
    ) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO insertions (date, inserted) VALUES (?,?);",
                [formatDate(date), inserted ? 1 : 0],
            );
            console.log("inserted");

            fetchInsertions(tx);
        });
    };

    const updateInsertion = (
        db: SQLite.Database,
        id: number,
        inserted: boolean,
    ) => {
        db.transaction((tx) => {
            tx.executeSql("UPDATE insertions SET inserted = ? WHERE id = ?;", [
                inserted ? 1 : 0,
                id,
            ]);
            fetchInsertions(tx);
        });
    };

    const deleteInsertion = (db: SQLite.Database, id: number) => {
        db.transaction((tx) => {
            tx.executeSql("DELETE FROM insertions WHERE id = ?;", [id]);

            fetchInsertions(tx);
        });
    };

    return {
        insertions,
        getInsertions,
        addInsertion,
        updateInsertion,
        deleteInsertion,
    };
}
export function formatDate(date: Date) {
    return moment(date).format("YYYY-MM-DD");
}
