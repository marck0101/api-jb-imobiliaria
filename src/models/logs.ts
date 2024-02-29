import { ILogs } from '@/@types/logs';
import { model, Schema } from 'mongoose';


export const schema = new Schema<ILogs>({
    level: String,
    message: String,
    data: Object,
    path: String,
    timestamp: {
        type: Date,
        default: Date.now
    },

}, { timestamps: true });

export const Logs = model('Logs', schema);

