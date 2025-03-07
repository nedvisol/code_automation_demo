import * as sqlite3 from 'sqlite3';

var db:sqlite3.Database = null;

export const getDb = () => {

    if (!db) {
        db = new sqlite3.Database('./dist/database.db', (err) => {
            if (err) {
                console.log('Error oepning database');
            }            
        });
    }

    return db;
};


const tableCreateScripts:string[] = []

export const addCreateScript = (script:string) => {
    tableCreateScripts.push(script);
}

export const initDatabase = () => {    
    
    const db = getDb();
    db.serialize(() => {
        tableCreateScripts.forEach((script) => {
            db.run(script, (err) => {
                if (err) {
                    console.log('Error creating table', err);
                } else {
                    console.log('Table created');
                }
            });
        });

    });
   
    console.log('Database initialized');
}

export const closeDb = () => {
    db.close();
}

// db.serialize(() => {
//     db.run("CREATE TABLE lorem (info TEXT)");

//     const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
//     for (let i = 0; i < 10; i++) {
//         stmt.run("Ipsum " + i);
//     }
//     stmt.finalize();

//     db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
//         console.log(row.id + ": " + row.info);
//     });
// });

