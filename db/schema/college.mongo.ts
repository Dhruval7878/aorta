import mongoose, { Model, Schema, model, models } from "mongoose";
import { ICollege } from "./types";

const collegeSchema: Schema = new Schema({
    domainName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true
    }
}, { timestamps: true });

let collegeList: Model<ICollege>;

try {
    if (models && models.collegeList) {
        collegeList = models.collegeList as Model<ICollege>;
    } else {
        collegeList = model<ICollege>('collegeList', collegeSchema);
    }
} catch (error) {
    console.error("Error accessing or creating collegeList model:", error);
    collegeList = model<ICollege>('collegeList', collegeSchema);
}

export default collegeList;