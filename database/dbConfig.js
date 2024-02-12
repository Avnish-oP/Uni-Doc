import pg from "pg";

const db = new pg.Client({
    connectionString:"postgresql://postgres:Avnish@1245&@localhost:5432/Users"
});

const connectDB = async () => {
    try {
        await db.connect();
        console.log("Database connected successfully");
    } catch (err) {
        console.log("error in connecting to db",err);
    }
}

export { db, connectDB };