import * as SQLite from "expo-sqlite";
import { useState } from "react";

import { InsertionDetail } from "./types";

export function useDetails() {
    const [detail, setDetail] = useState<InsertionDetail | null>(null);

    /**
     * Whenever the todos table has mutated, we need to fetch the data set again order to sync DB -> UI State
     */
    const fetchDetails = (tx: SQLite.SQLTransaction, insertionId: number) => {
        tx.executeSql(
            "SELECT * FROM insertion_detail WHERE insertionId = ? ORDER BY date DESC;",
            [insertionId],
            (_, { rows: { _array } }) => setDetail(_array[0]),
        );
    };

    const getDetail = (db: SQLite.Database, insertionId: number) => {
        db.readTransaction((tx) => fetchDetails(tx, insertionId));
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
            fetchDetails(tx, insertionId);
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
            fetchDetails(tx, insertionId);
        });
    };

    const deleteDetail = (
        db: SQLite.Database,
        id: number,
        insertionId: number,
    ) => {
        db.transaction((tx) => {
            tx.executeSql("DELETE FROM insertion_detail WHERE id = ?;", [id]);
            fetchDetails(tx, insertionId);
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
