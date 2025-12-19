import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'student' | 'teacher';
    department: string;
    // Student only fields
    usn?: string;
    semester?: string;
    // Profile
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['student', 'teacher'], required: true },
        department: { type: String, required: true },
        // Student specific
        usn: {
            type: String,
            required: function (this: IUser) { return this.role === 'student'; },
            unique: true,
            sparse: true // sparse allows null/undefined to not conflict uniqueness
        },
        semester: {
            type: String,
            required: function (this: IUser) { return this.role === 'student'; }
        },
        profilePicture: { type: String },
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
