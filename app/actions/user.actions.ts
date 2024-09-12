"use server"

import { driver } from "@/db/neo";
import collegeList from "@/db/schema/college.mongo";
import { Neo4JUser, UserWithDocument, UserWithNoDocument } from "@/db/schema/types";
import UserModel from "@/db/schema/user.mongo";
import connectDB from "@/db/mongo";
import mongoose from "mongoose";
import { int } from "neo4j-driver";

export const createUser = async (userData: UserWithNoDocument): Promise<{ message: string }> => {
    await connectDB();
    const { email, firstName, lastName, gender, preference, dob, user_desc, clerk_id } = userData;
    const collegeName = email.split('@')[1].split('.')[0];
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
            user_media: [],
            pendingUserActions: []
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
            return { message: "User created successfully" }
        }
        return { message: "User created successfully , wait for college to get approved" };
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error("ERRORRR");
    }
};

export const createUserInNeo4j = async (user: Neo4JUser) => {
    const { userId, email, firstName, lastName, collegeName, gender, preference } = user;
    await driver.executeQuery(`
    MERGE (college:College {name: $collegeName})
    CREATE (u:User { userId: $userId, email: $email, firstName: $firstName, lastName: $lastName, gender: $gender, preference: $preference })
    MERGE (u)-[:BELONGS_TO]->(college)
  `, { userId, email, firstName, lastName, gender, preference, collegeName });
};

export const getUsersWithNoConnection = async (
    id: string,
) => {
    const limit = 10
    await connectDB();
    const result = await driver.executeQuery(`
        MATCH (cu:User {userId: $userId})-[:BELONGS_TO]->(college:College)
        MATCH (ou:User)-[:BELONGS_TO]->(college)
        WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) 
        AND NOT (ou)-[:LIKE|:DISLIKE]->(cu) AND cu <> ou AND 
        ((cu.gender = 0 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 0) OR
         (cu.gender = 0 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 0) OR
         (cu.gender = 1 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 1) OR
         (cu.gender = 1 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 1))
        RETURN ou.userId
        LIMIT $limit
    `, {
        userId: id,
        limit: int(limit)
    });

    const userIds = result.records.map((record) => record.get("ou.userId"));
    const users = await UserModel.find({ _id: { $in: userIds } }).select('firstName lastName user_media.img_link user_media.total_likes user_media.total_likes user_desc dob').lean();

    const simplifiedUsers = users.map((user) => ({
        ...user,
        _id: user._id.toString(),
    }));

    return simplifiedUsers;
}

export const neo4jSwipe = async (id: string, swipe: string, userId: string, idx?: number) => { // TODO : test this function with some id , although it is working fine well according to me , but need to test it as well
    try {
        const type = swipe === "left" ? "DISLIKE" : "LIKE";

        await driver.executeQuery(
            `MATCH (cu:User {userId: $id}), (ou: User {userId: $userId}) 
             CREATE (cu)-[:${type}]->(ou)`,
            { id, userId }
        );

        await connectDB();
        if (type === "LIKE") {
            await connectDB();
            const cUserId = new mongoose.Types.ObjectId(id);
            const oUserId = new mongoose.Types.ObjectId(userId);

            let updateQuery = {};
            if (idx !== undefined) {
                updateQuery = {
                    $push: {
                        [`user_media.${idx}.pendingUserActions`]: cUserId,
                        [`user_media.${idx}.total_likes`]: { $add: [`$user_media.${idx}.total_likes`, 1] }
                    }
                };
            } else {
                updateQuery = {
                    $push: { pendingUserActions: cUserId }
                };
            }

            await UserModel.updateOne({ _id: oUserId }, updateQuery);
        }
        return { message: "Swiped successfully" };
    } catch (error) {
        console.error('Error swiping:', error);
    }
};


export const getMatches = async (currentUserId: string) => { // TODO : test this function with multiple users not only one as a match
    try {
        await connectDB();

        const userRecord = await UserModel.findById(currentUserId);
        if (!userRecord || !userRecord.user_matches || userRecord.user_matches.length === 0) {
            console.log('No matches found');
            return [];
        }
        const userMatches = userRecord.user_matches;
        let matchesData = await UserModel.find({ _id: { $in: userMatches } })
            .select('firstName lastName email user_desc dob user_media')
            .lean();
        matchesData = matchesData.map((match) => ({
            ...match,
            // _id: match._id.toString(),
        }));

        return matchesData;
    } catch (error) {
        console.error('Error getting matches:', error);
    }
};

export const updateUserInDB = async (userData: any) => {
    await connectDB();
    try {
        const { userId, firstName, lastName, gender, preference, user_desc, user_media } = userData;
        let objId = new mongoose.Types.ObjectId(userId);
        let updateObj: mongoose.UpdateQuery<UserWithDocument> = {};

        if (firstName !== undefined) updateObj.firstName = firstName;
        if (lastName !== undefined) updateObj.lastName = lastName;
        if (gender !== undefined) updateObj.gender = gender;
        if (preference !== undefined) updateObj.preference = preference;
        if (user_desc !== undefined) updateObj.user_desc = user_desc;

        if (user_media && Array.isArray(user_media)) {
            let formattedUserMedia;
            if (typeof user_media[0] === 'string') {
                formattedUserMedia = user_media.map(url => ({
                    img_link: url,
                    total_likes: 0
                }));
            } else {
                formattedUserMedia = user_media as { img_link: string; total_likes: number }[];
            }
            updateObj['$set'] = { user_media: formattedUserMedia };
        }
        let userRecord = await UserModel.findByIdAndUpdate(
            objId,
            updateObj,
            { new: true, runValidators: true }
        );

        if (!userRecord) {
            throw new Error('User not found in MongoDB');
        }
        await driver.executeQuery(`
        MATCH (u:User { userId : $userId })
        SET u.firstName = $firstName,
            u.lastName = $lastName,
            u.gender = $gender,
            u.preference = $preference
    `, {
            userId,
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            gender: userRecord.gender,
            preference: userRecord.preference
        });
        return { message: 'User updated successfully.' };
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

export const getUserData = async (userMail: string): Promise<{ message: string, data: any }> => {
    await connectDB();
    try {
        let userData = await UserModel.findOne({ email: userMail }).populate('collegeId').select('-user_media.pendingUserActions -user_media._id');
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

export const connectionWithLikes = async (userId: string) => {
    try {
        await connectDB();

        const user = await UserModel.findById(new mongoose.Types.ObjectId(userId))
            .select('user_media.pendingUserActions pendingUserActions').lean();

        if (!user) {
            console.log('User not found');
            return [];
        }

        const pendingUserIds = new Set<string>();
        if (user.pendingUserActions) {
            user.pendingUserActions.forEach((id) => pendingUserIds.add(id.toString()));
        }
        user.user_media?.forEach((media) => {
            media.pendingUserActions?.forEach((id) => pendingUserIds.add(id.toString()));
        });

        if (pendingUserIds.size === 0) {
            console.log('No pending user actions found');
            return [];
        }

        const users = await UserModel.find({ _id: { $in: Array.from(pendingUserIds) } })
            .select('firstName lastName user_media user_desc dob').lean();

        if (users.length === 0) {
            console.log('No matching users found in MongoDB');
            return [];
        }

        return users.map((user) => ({
            ...user,
            _id: user._id.toString(),
            dob: user.dob instanceof Date ? user.dob.toISOString() : user.dob,
        }));
    } catch (error) {
        console.error('Error in connectionWithLikes:', error);
        return [];
    }
};

export const handleLikesPageAction = async (userId: string, action: string, targetUserId: string, idx?: number) => {
    try {
        await connectDB();

        const type = (action === "left" ? "DISLIKE" : "LIKE");
        const cUserId = new mongoose.Types.ObjectId(userId);
        const oUserId = new mongoose.Types.ObjectId(targetUserId);

        if (type === "LIKE") {
            if (idx !== undefined) { // ! idx is only defined when the action is for a media item
                await UserModel.updateOne(
                    { _id: cUserId },
                    { $pull: { [`user_media.${idx}.pendingUserActions`]: oUserId }, }
                );
            }
            else { // ! this runs when ou just liked cu , nothing else
                await UserModel.updateOne(
                    { _id: cUserId },
                    { $pull: { pendingUserActions: oUserId }, $push: { user_matches: oUserId } }
                );
            }
            await UserModel.updateOne(
                { _id: oUserId },
                { $push: { user_matches: cUserId } }
            );
        } else {
            await UserModel.updateOne(
                { _id: cUserId },
                {
                    $pull: { pendingUserActions: oUserId }
                }
            );
        }
        await driver.executeQuery(`
            MATCH (cu:User {userId: $userId}), (ou: User {userId: $targetUserId}) 
            CREATE (cu)-[:${type}]->(ou)
            `, { userId, targetUserId });
        return { message: 'Action performed successfully' };
    } catch (error) {
        console.error('Error in handleLikesPageAction:', error);
        return { message: 'Error performing action' };
    }
}
