import { Author, AuthorAddInput } from '../generated/graphql';
import {getDb} from './index';
import crypto from 'crypto';

export const initAuthorTable = () => {
    const db = getDb();
    db.run("CREATE TABLE AUTHOR (ID VARCHAR(50), NAME VARCHAR(200), RATING NUMBER(2,1));");
}

export const getAuthors = async ():Promise<Author[]> => {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.all<Author>("SELECT * FROM AUTHOR", (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export const getAuthorById = async (id: string):Promise<Author> => {
    const db = getDb();
    return new Promise((resolve, reject) => {
        db.all<Author>("SELECT * FROM AUTHOR WHERE ID=?", [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
}

export const createAuthor = (author: AuthorAddInput):Promise<string> => {
    const db = getDb();
    const generatedId = crypto.randomUUID();
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO AUTHOR (ID, NAME, RATING) VALUES (?, ?, ?)", [generatedId, author.name, author.rating], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(generatedId);
            }
        });
    });
}

export const updateAuthor = (author: AuthorAddInput) => { 
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