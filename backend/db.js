// const mysql = require("mysql2");

// // Create connection
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",  
//     database: "klkexp2504"
// });

// // Connect to DB
// db.connect((err) => {
//     if (err) {
//         console.log("DB Connection Failed:", err);
//     } else {
//         console.log("MySQL Connected...");
//     }
// });

// module.exports = db;


const mysql = require("mysql2");

// ============================
// MAIN APP DATABASE (existing)
// ============================
const mainDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "klkexp2504"
});

mainDB.connect((err) => {
    if (err) {
        console.log("Main DB Connection Failed:", err);
    } else {
        console.log("Main DB (klkexp2504) Connected...");
    }
});

// ============================
// TALLY DATABASE (new)
// ============================
const tallyDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "klkexp2504_tally"   // <-- apna tally database naam yahan daalein
});

tallyDB.connect((err) => {
    if (err) {
        console.log("Tally DB Connection Failed:", err);
    } else {
        console.log("Tally DB Connected...");
    }
});

module.exports = { mainDB, tallyDB };