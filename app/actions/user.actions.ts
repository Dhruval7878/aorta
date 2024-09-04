"use server"

import { driver } from "@/db/neo";
import collegeList from "@/db/schema/college.mongo";
import UserModel, { User } from "@/db/schema/user.mongo";
import { Neo4JUser } from "@/db/schema/user.neo";
import connectDB from "@/lib/dbConnect";
import mongoose from "mongoose";
import { int } from "neo4j-driver";

export const getUserByID = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (u:User {userId: $userId}) RETURN u`, { userId: id });
    const users = result.records.map((record) => record.get("u").properties);
    if (users.length === 0) return null;
    return users[0] as Neo4JUser;
}

export const createUser = async (userData: User): Promise<{ message: string }> => {
    await connectDB();
    const { email, firstName, lastName, collegeName, gender, preference, dob, user_desc, clerk_id } = userData;
    try {
        let collegeRecord = await collegeList.findOne({ domainName: collegeName });

        if (!collegeRecord) {
            collegeRecord = new collegeList({
                domainName: collegeName,
                status: 'pending'
            });
            await collegeRecord.save();
        }

        if (collegeRecord.status === 'rejected') {
            return { message: "College is rejected, user creation aborted" };
        }

        const newUser = new UserModel({
            email,
            firstName,
            lastName,
            collegeId: collegeRecord._id,
            gender,
            preference,
            dob: new Date(dob),
            user_desc,
            clerk_id,
            user_matches: [],
            user_media: []
        });

        const savedUser = await newUser.save();

        if (collegeRecord.status === 'approved') {
            const neo4jUser: Neo4JUser = {
                userId: savedUser!._id.toString(),
                email,
                firstName,
                lastName,
                collegeName,
                gender,
                preference
            };
            await createUserInNeo4j(neo4jUser);
        }
        return { message: "User created successfully" };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error("ERRORRR");
    }
};

// *this is a function which is not going to be used outside mostly
const createUserInNeo4j = async (user: Neo4JUser) => {
    const { userId, email, firstName, lastName, collegeName, gender, preference } = user;
    await driver.executeQuery(`
    MERGE (college:College {name: $collegeName})
    CREATE (u:User { userId: $userId, email: $email, firstName: $firstName, lastName: $lastName, gender: $gender, preference: $preference })
    MERGE (u)-[:BELONGS_TO]->(college)
  `, { userId, email, firstName, lastName, gender, preference, collegeName });
};

export const getUsersWithNoConnection = async (
    id: string, 
    page: number = 1, 
    pageSize: number = 10
) => {
    const skip = (page - 1) * pageSize;
    const result = await driver.executeQuery(`
        MATCH (cu:User {userId: $userId})-[:BELONGS_TO]->(college:College)
        MATCH (ou:User)-[:BELONGS_TO]->(college)
        WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou AND
        ((cu.gender = 0 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 0) OR
         (cu.gender = 0 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 0) OR
         (cu.gender = 1 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 1) OR
         (cu.gender = 1 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 1))
        RETURN ou
        SKIP $skip
        LIMIT $pageSize
    `, { 
        userId: id,
        skip: int(skip),
        pageSize: int(pageSize)
    });

    const users = result.records.map((record) => new mongoose.Types.ObjectId(record.get("ou").userId));
    console.log(users);

    const countResult = await driver.executeQuery(`
        MATCH (cu:User {userId: $userId})-[:BELONGS_TO]->(college:College)
        MATCH (ou:User)-[:BELONGS_TO]->(college)
        WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou AND
        ((cu.gender = 0 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 0) OR
         (cu.gender = 0 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 0) OR
         (cu.gender = 1 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 1) OR
         (cu.gender = 1 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 1))
        RETURN count(ou) as total
    `, { userId: id });

    const totalCount = countResult.records[0].get("total").toNumber();

    return {
        users,
        pagination: {
            currentPage: page,
            pageSize,
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize)
        }
    };
}

export const neo4jSwipe = async (id: string, swipe: string, userId: string) => {
    const type = swipe === "left" ? "DISLIKE" : "LIKE";
    await driver.executeQuery(`MATCH (cu:User {userId: $id}),(ou: User {userId: $userId}) CREATE (cu)-[:${type}]->(ou)`, { id, userId })
    if (type === "LIKE") {
        const result = await driver.executeQuery(`MATCH (cu:User {userId: $id}), (ou: User {userId: $userId}) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`, { id, userId });
        const matches = result.records.map((record) => record.get("match").properties);
        return Boolean(matches.length > 0);
    };
};

export const getMatches = async (currentUserId: string) => {
    const result = await driver.executeQuery(`
        MATCH (cu:User {userId: $id})-[:LIKE]->(ou:User)
        MATCH (ou)-[:LIKE]->(cu)
        RETURN DISTINCT ou AS match
    `, { id: currentUserId });

    const matches = result.records.map((record) => record.get("match").properties);
    return matches;
}

export const updateUserInDB = async (userData: any) => {
    await connectDB();
    try {
        const { userId, firstName, lastName, gender, preference, user_desc } = userData;
        let objId = new mongoose.Types.ObjectId(userId);
        let userRecord = await UserModel.findByIdAndUpdate({ _id: objId }, { firstName, lastName, gender, preference, user_desc }, { runValidators: true });
        if (!userRecord) {
            throw new Error('User not found in MongoDB');
        }
        await driver.executeQuery(`
        MATCH (u:User { userId : $userId })
        SET u.firstName = $firstName,
            u.lastName = $lastName,
            u.gender = $gender,
            u.preference = $preference
    `, { userId, firstName, lastName, gender, preference });
        return { message: 'User updated successfully.' };
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

export const getUserData = async (userMail: string): Promise<{ message: string, data: any }> => {
    await connectDB();
    try {
        let userData = await UserModel.findOne({ email: userMail }).populate('collegeId');
        if (!userData) return { message: 'User not found.', data: null };
        const plainUserData = userData.toObject();
        const resData = {
            email: plainUserData.email,
            firstName: plainUserData.firstName,
            lastName: plainUserData.lastName,
            gender: plainUserData.gender,
            preference: plainUserData.preference,
            collegeName: plainUserData.collegeId ? plainUserData.collegeId.domainName : 'Unknown',
            dob: plainUserData.dob ? plainUserData.dob.toISOString() : null,
            user_desc: plainUserData.user_desc,
            user_matches: plainUserData.user_matches,
            user_media: plainUserData.user_media,
            userId: plainUserData._id.toString()
        };
        return { message: 'User data retrieved successfully.', data: resData };
    } catch (error) {
        return { message: 'Error retrieving user data.', data: null };
    }
}

export const totalUsersInACollege = async (userId: string): Promise<number> => {
    await connectDB();
    try {
        let objId = new mongoose.Types.ObjectId(userId);
        let userRecord = await UserModel.findById({ _id: objId }).populate('collegeId');
        if (!userRecord) return 0;
        const collegeName = userRecord.collegeId.domainName;
        let collegeRecord = await collegeList.findOne({ domainName: collegeName });
        if (!collegeRecord) return 0;
        const totalUsers = await UserModel.countDocuments({ collegeId: collegeRecord._id });
        return totalUsers;
    } catch (error) {
        console.error('Error getting total users:', error);
        return 0;
    }
}