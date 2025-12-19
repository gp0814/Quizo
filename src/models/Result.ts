import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
    testId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    studentName: string;
    usn: string;
    department: string;
    semester: string;
    score: number;
    totalMarks: number;
    answers: {
        questionId?: string; // or index
        questionText: string;
        selectedOption: string;
        isCorrect: boolean;
    }[];
    submittedAt: Date;
}

const ResultSchema: Schema<IResult> = new Schema(
    {
        testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        studentName: { type: String, required: true },
        usn: { type: String, required: true },
        department: { type: String, required: true },
        semester: { type: String, required: true },
        score: { type: Number, required: true },
        totalMarks: { type: Number, required: true },
        answers: [{
            questionId: Schema.Types.ObjectId,
            questionText: String,
            selectedOption: String,
            isCorrect: Boolean
        }],
        submittedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
export default Result;
