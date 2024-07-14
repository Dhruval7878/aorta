import "server-only";

import neo4j from "neo4j-driver";

export const driver = neo4j.driver(
    process.env.NEO4J_URI as string || "neo4j+s://edf1b305.databases.neo4j.io",
    neo4j.auth.basic(
        process.env.NEO4J_USER as string || "neo4j",
        process.env.NEO4J_PASSWORD as string
    )
)