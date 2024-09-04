'use server';

import connectDB from "@/lib/dbConnect";
import { driver } from "@/db/neo";
import collegeList from "@/db/schema/college.mongo";
import UserModel, { User } from "@/db/schema/user.mongo";
import { Neo4JUser } from "@/db/schema/user.neo";
import mongoose from "mongoose";

