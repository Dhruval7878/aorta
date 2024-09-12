import mongoose from "mongoose";

export interface Neo4JUser {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    collegeName: string;
    gender: number;
    preference: number;
}

export interface OtherUsersDataForApp {
    _id: string;
    firstName: string;
    lastName: string;
    user_desc?: string;
    user_media?: { img_link: string; total_likes: number }[];
}

export interface UserWithDocument extends Document {
    clerk_id: string;
    email: string;
    firstName: string;
    lastName: string;
    collegeId: mongoose.Types.ObjectId;
    gender: number;
    preference: number;
    dob: Date;
    user_desc?: string;
    user_matches?: mongoose.Types.ObjectId[];
    user_media?: { img_link: string; total_likes: number; pendingUserActions: [mongoose.Types.ObjectId] }[];
    pendingUserActions?: [mongoose.Types.ObjectId];
}

export interface UserWithNoDocument {
    clerk_id: string;
    email: string;
    firstName: string;
    lastName: string;
    collegeId: string;
    gender: number;
    preference: number;
    dob: Date;
    user_desc?: string;
    user_matches?: string[];
    user_media?: { img_link: string; total_likes: number; pendingUserActions: [string] }[];
    pendingUserActions?: [string];
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
    user_matches?: mongoose.Types.ObjectId[];
    user_media?: { img_link: string; total_likes: number; pendingUserActions: [mongoose.Types.ObjectId] }[];
    pendingUserActions?: [mongoose.Types.ObjectId];
}

export interface ICollege extends Document {
    domainName: string;
    status: "pending" | "approved" | "rejected";
}