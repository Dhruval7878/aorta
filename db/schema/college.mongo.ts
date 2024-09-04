import mongoose, { Document, Model, Schema, model, models } from "mongoose";

export interface ICollege extends Document {
    domainName: string;
    status: "pending" | "approved" | "rejected";
}

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
    if (mongoose.models && mongoose.models.collegeList) {
        collegeList = mongoose.models.collegeList as Model<ICollege>;
    } else {
        collegeList = model<ICollege>('collegeList', collegeSchema);
    }
} catch (error) {
    console.error("Error accessing or creating collegeList model:", error);
    collegeList = model<ICollege>('collegeList', collegeSchema);
}

export default collegeList;