import { Author } from '../generated/graphql';
import {getDb} from './index';

export const createAuthor = (author: Author) => {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO AUTHOR (ID, NAME, RATING) VALUES (?, ?, ?)", [author.id, author.name, author.rating], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

export const getAuthors = async ():Promise<Author[]> => {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM AUTHOR", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows as Author[]);
            }
        });
    });
}

export const updateAuthor = (author: Author) => { 
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.run("UPDATE AUTHOR SET NAME = ?, RATING = ? WHERE ID = ?", [author.name, author.rating, author.id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });    
}

export const deleteAuthor = (id: string) => {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM AUTHOR WHERE ID = ?", [id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}