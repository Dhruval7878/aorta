import { connect } from 'mongoose';

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function connectDB(): Promise<void> {
    if (connection.isConnected) {
        return;
    }
    try {
        const db = await connect(process.env.MONGO_STRING || '', {});
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

export default connectDB;