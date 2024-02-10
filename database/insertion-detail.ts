import { useState } from "react";
import * as SQLite from "expo-sqlite";
import { InsertionDetail } from "./types";

export function useDetails() {
    const [detail, setDetail] = useState<InsertionDetail | null>(null);

    /**
     * Whenever the todos table has mutated, we need to fetch the data set again order to sync DB -> UI State
     */
    const fetchInsertions = (
        tx: SQLite.SQLTransaction,
        insertionId: number,
    ) => {
        tx.executeSql(
            "SELECT * FROM insertion_detail WHERE insertionId = ? ORDER BY date DESC;",
            [insertionId],
            (_, { rows: { _array } }) => setDetail(_array[0]),
        );
    };

    const getDetail = (db: SQLite.Database, insertionId: number) => {
        db.readTransaction((tx) => fetchInsertions(tx, insertionId));
    };

    const addDetail = (
        db: SQLite.Database,
        insertionId: number,
        description: string,
        rating: number,
    ) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO insertion_detail (insertionId, description, rating) VALUES (?,?,?);",
                [insertionId, description, rating],
            );
            console.log("inserted");

            fetchInsertions(tx, insertionId);
        });
    };

    const updateDetail = (
        db: SQLite.Database,
        id: number,
        insertionId: number,
        description: string,
        rating: number,
    ) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE insertion_detail SET description = ?, rating = ? WHERE id = ?;",
                [description, rating, id],
            );
            fetchInsertions(tx, insertionId);
        });
    };

    const deleteDetail = (
        db: SQLite.Database,
        id: number,
        insertionId: number,
    ) => {
        db.transaction((tx) => {
            tx.executeSql("DELETE FROM insertion_detail WHERE id = ?;", [id]);
            fetchInsertions(tx, insertionId);
        });
    };

    return {
        detail,
        getDetail,
        addDetail,
        updateDetail,
        deleteDetail,
    };
}
