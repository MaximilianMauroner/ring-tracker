export type Insertion = {
    id: number;
    inserted: boolean;
    date: Date;
};

export type InsertionDetail = {
    id: number;
    insertionId: number;
    description: string;
    rating: number;
};
