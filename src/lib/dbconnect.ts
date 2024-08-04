import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?:number;
}

const connection : ConnectionObject= {};

async function dbConnect() : Promise<void>{
    //if database is connected no need to connect again
    if(connection.isConnected){
        //console.log("Already connected to database");
        return ;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URL || "",{});

        connection.isConnected = db.connections[0].readyState;

        console.log("DB connected successfully");
    }
    catch(error){

        console.log("Database connection failed ",error);

        process.exit(1);
    }

}

export default dbConnect;