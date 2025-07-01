export interface Note {
    id?: string;
    type: "notes" | "trash";
    title:string;
    content:string;
    marked: boolean;
}
