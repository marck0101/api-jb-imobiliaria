import { ITrip } from '@/@types/trips';
import { model, Schema } from 'mongoose';

export const schema = new Schema<ITrip>(
  {
    name: String,
    description: String,

    startAddress: {
      postalCode: String,
      city: String,
      number: String,
      state: String,
      street: String,
      country: String,
    },
    endAddress: {
      postalCode: String,
      city: String,
      number: String,
      state: String,
      street: String,
      country: String,
    },

    startDate: Date,
    endDate: Date,

    type: {
      type: String,
      enum: ['SCHEDULED', 'CHARTER', 'UNIVERSITY'],
    },

    vehicle: String,

    passengers: [
      {
        customer: String,
        seat: String,
      },
    ],

    archivedAt: Date,
  },
  { timestamps: true },
);

export const Trips = model('Trips', schema);
