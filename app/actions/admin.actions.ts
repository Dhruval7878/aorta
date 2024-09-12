'use server';

import connectDB from "@/db/mongo";
import { driver } from "@/db/neo";
import UserModel from "@/db/schema/user.mongo";
import mongoose from "mongoose";
import { clerkClient } from "@clerk/nextjs/server";
import { createUserInNeo4j } from "./user.actions";
import collegeList from "@/db/schema/college.mongo";
import { Neo4JUser, UserWithNoDocument } from "@/db/schema/types";
import { v2 as cloudinary } from 'cloudinary';

const deleteCloudinaryResources = async (userId: string) => {
    try {
        const deleteResult = await cloudinary.api.delete_resources_by_prefix(`user_uploads/${userId}`);
        try {
            await cloudinary.api.delete_folder(`user_uploads/${userId}`);
        } catch (folderError: any) {
            if (folderError.http_code !== 404) {
                console.error(`Error deleting Cloudinary folder for user ${userId}:`, folderError);
            }
        }
    } catch (error) {
        console.error(`Error deleting Cloudinary resources for user ${userId}:`, error);
    }
};

export const deleteUserByUserId = async (userId: string) => {
    await connectDB();
    try {
        if (userId === "DELETEALL") {
            await driver.executeQuery(`MATCH (u:User) DETACH DELETE u`);
            const allUsers = await UserModel.find({}, { clerk_id: 1, _id: 1 }).lean();
            await UserModel.deleteMany({});

            if (allUsers.length > 0) {
                for (const user of allUsers) {
                    if (user.clerk_id) {
                        await clerkClient.users.deleteUser(user.clerk_id);
                    }
                    if (user._id) {
                        await deleteCloudinaryResources(user._id.toString());
                    }
                }
            }

            return { success: true, message: "All users deleted successfully" };
        } else {
            await driver.executeQuery(`MATCH (u:User {userId: $userId}) DETACH DELETE u`, { userId });
            const objId = new mongoose.Types.ObjectId(userId);
            const deletedUser = await UserModel.findOneAndDelete(
                { _id: objId },
                { projection: { clerk_id: 1, _id: 1 } }
            ).lean();

            if (deletedUser && deletedUser.clerk_id) {
                await clerkClient.users.deleteUser(deletedUser.clerk_id);
                await deleteCloudinaryResources(userId);
                return { success: true, message: "User deleted successfully" };
            } else {
                return { success: false, message: "User not found" };
            }
        }
    } catch (error: any) {
        console.error('Error deleting user:', error);
        return { success: false, message: error.message || "An error occurred while deleting the user(s)" };
    }
};


export const createUser = async (userData: UserWithNoDocument) => {
    await connectDB();
    try {
        const clerkUser = await clerkClient.users.createUser({
            emailAddress: [userData.email],
            // TODO : should we store passwords coz it is explicitly mentioned in the clerk docs that we should not store passwords and we don't even require it in our app, welp atleast in our db
            password: userData.password,
        });

        if (!clerkUser) {
            return { success: false, message: "Error creating user in Clerk" };
        }

        const { email, firstName, lastName, dob, gender, preference, user_desc } = userData;
        const clgId = userData.collegeId;
        const clerk_id = clerkUser.id;
        const collegeId = new mongoose.Types.ObjectId(clgId);
        const college = await collegeList.findById(collegeId);

        if (!college) {
            await clerkClient.users.deleteUser(clerk_id);
            return { success: false, message: "Invalid college ID" };
        }

        const newUser = new UserModel({
            clerk_id,
            email,
            firstName,
            lastName,
            collegeId,
            gender,
            preference,
            dob: new Date(dob),
            user_desc,
            user_matches: [],
            user_media: [],
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            const neo4jUser: Neo4JUser = {
                userId: savedUser._id.toString(),
                email,
                firstName,
                lastName,
                collegeName: college.domainName,
                gender: savedUser.gender,
                preference: savedUser.preference
            };
            await createUserInNeo4j(neo4jUser);
            return {
                success: true, message: `User created successfully for ${savedUser.firstName}`
            };
        } else {
            await clerkClient.users.deleteUser(clerk_id);
            return { success: false, message: "Error saving user to database" };
        }
    } catch (error: any) {
        console.error('Error creating user:', error);
        return { success: false, message: error.message || "An error occurred while creating the user" };
    }
}