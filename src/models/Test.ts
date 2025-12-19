import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion {
    questionText: string;
    options: string[];
    correctAnswer: string;
    marks: number;
    isCompulsory: boolean;
}

export interface ITestSettings {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    requireCamera: boolean;
}

export interface ITest extends Document {
    title: string;
    department: string;
    semester: string;
    duration: number; // in minutes
    startTime?: Date;
    isActive: boolean;
    questions: IQuestion[];
    settings: ITestSettings;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema({
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    marks: { type: Number, default: 1 },
    isCompulsory: { type: Boolean, default: false }
});

const TestSchema: Schema<ITest> = new Schema(
    {
        title: { type: String, required: true },
        department: { type: String, required: true },
        semester: { type: String, required: true },
        duration: { type: Number, required: true }, // minutes
        startTime: { type: Date },
        isActive: { type: Boolean, default: false },
        questions: [QuestionSchema],
        settings: {
            shuffleQuestions: { type: Boolean, default: false },
            shuffleOptions: { type: Boolean, default: false },
            requireCamera: { type: Boolean, default: false }
        },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    { timestamps: true }
);

const Test: Model<ITest> = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);
export default Test;
