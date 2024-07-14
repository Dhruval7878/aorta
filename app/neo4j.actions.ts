"use server"

import { driver } from "@/db";
import { Neo4JUser } from "@/types";

export const getUserByID = async (id: string) => {
    const result = await driver.executeQuery(`MATCH (u:User {applicationID: $applicationID}) RETURN u`, { applicationID: id });
    const users = result.records.map((record) => record.get("u").properties);
    if (users.length === 0) return null;
    return users[0] as Neo4JUser;
}

export const createUser = async (user: Neo4JUser) => {
    const { applicationID, email, firstname, lastname, collegeName, gender, preference } = user;

    await driver.executeQuery(`
        MERGE (college:College {name: $collegeName})
        CREATE (u:User { applicationID : $applicationID, email: $email, firstname: $firstname, lastname: $lastname, gender: 2, preference: 2 })
        MERGE (u)-[:BELONGS_TO]->(college)
    `, { applicationID, email, firstname, lastname, gender, preference, collegeName });
}

export const getUsersWithNoConnection = async (id: string) => {
    const result = await driver.executeQuery(`
        MATCH (cu:User {applicationID: $applicationID})-[:BELONGS_TO]->(college:College)
        MATCH (ou:User)-[:BELONGS_TO]->(college)
        WHERE NOT (cu)-[:LIKE|:DISLIKE]->(ou) AND cu <> ou AND
        ((cu.gender = 0 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 0) OR
         (cu.gender = 0 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 0) OR
         (cu.gender = 1 AND cu.preference = 0 AND ou.gender = 0 AND ou.preference = 1) OR
         (cu.gender = 1 AND cu.preference = 1 AND ou.gender = 1 AND ou.preference = 1))
        RETURN ou
    `, { applicationID: id });
    const users = result.records.map((record) => record.get("ou").properties);
    return users as Neo4JUser[];
}

export const neo4jSwipe = async (id: string, swipe: string, userId: string) => {
    const type = swipe === "left" ? "DISLIKE" : "LIKE";
    await driver.executeQuery(`MATCH (cu:User {applicationID: $id}),(ou: User {applicationID: $userId}) CREATE (cu)-[:${type}]->(ou)`, { id, userId })
    if (type === "LIKE") {
        const result = await driver.executeQuery(`MATCH (cu:User {applicationID: $id}), (ou: User {applicationID: $userId}) WHERE (ou)-[:LIKE]->(cu) RETURN ou as match`, { id, userId });
        const matches = result.records.map((record) => record.get("match").properties);
        return Boolean(matches.length > 0);
    };
};

export const getMatches = async (currentUserId: string) => {
    const result = await driver.executeQuery(`
        MATCH (cu:User {applicationID: $id})-[:LIKE]->(ou:User)
        MATCH (ou)-[:LIKE]->(cu)
        RETURN DISTINCT ou AS match
    `, { id: currentUserId });

    const matches = result.records.map((record) => record.get("match").properties);
    return matches;
}

export const updateUser = async (user: Neo4JUser) => {
    const { applicationID, email, firstname, lastname, collegeName, gender, preference } = user;

    await driver.executeQuery(`
        MATCH (u:User { applicationID : $applicationID })
        SET u.firstname = $firstname,
            u.lastname = $lastname,
            u.gender = $gender,
            u.preference = $preference
    `, { applicationID, firstname, lastname, gender, preference });
};