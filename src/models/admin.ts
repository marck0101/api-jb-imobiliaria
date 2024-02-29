import { IAdmin } from '@/@types/admin';
import { model, Schema } from 'mongoose';

export const schema = new Schema<IAdmin>({

    archivedAt: Date,

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'PENDING', 'BLOCKED'],
        default: 'ACTIVE'
    }

}, { timestamps: true });

export const Admins = model('Admins', schema);

