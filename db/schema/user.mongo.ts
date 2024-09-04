import mongoose, { Schema, Document, model, Model, models } from "mongoose";

export interface User {
    clerk_id: string;
    email: string;
    firstName: string;
    lastName: string;
    collegeName: string;
    gender: number;
    preference: number;
    dob: Date;
    user_desc?: string;
    user_matches?: string[];
    user_media?: string[];
}

export interface IUser extends Document {
    clerk_id: string;
    email: string;
    firstName: string;
    lastName: string;
    collegeId: mongoose.Types.ObjectId;
    gender: number;
    preference: number;
    dob: Date;
    user_desc?: string;
    user_matches?: string[];
    user_media?: string[];
}

const userSchema: Schema = new Schema({
    clerk_id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    collegeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collegeList',
        required: true
    },
    gender: {
        type: Number,
        enum: [0, 1],
        required: true
    },
    preference: {
        type: Number,
        enum: [0, 1],
        required: true
    },
    user_desc: {
        type: String
    },
    dob: {
        type: Date,
        required: true
    },
    user_matches: {
        type: [String]
    },
    user_media: {
        type: [String]
    }
}, { timestamps: true });

let UserModel: Model<IUser>;
try {
    if (mongoose.models && mongoose.models.UserModel) UserModel = mongoose.models.UserModel as Model<IUser>;
    else UserModel = model<IUser>('UserModel', userSchema);
} catch (error) {
    console.error("Error accessing or creating UserModel model:", error);
    UserModel = model<IUser>('UserModel', userSchema);
}
export default UserModel;