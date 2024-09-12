import mongoose, { Schema, model, Model } from "mongoose";
import { IUser } from "./types";

const media: Schema = new Schema({
    img_link: {
        type: String,
        required: true
    },
    total_likes: {
        type: Number,
        default: 0
    },
    pendingUserActions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'UserModel',
        default: []
    }
});

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
        type: [mongoose.Schema.Types.ObjectId]
    },
    user_media: {
        type: [media]
    },
    pendingUserActions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'UserModel',
        default: []
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