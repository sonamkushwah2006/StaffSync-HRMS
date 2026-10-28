
import mongoose, { Schema, type Document } from 'mongoose'

export interface IEmployee extends Document {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern'
  status: 'Active' | 'On Leave' | 'Inactive'
  joiningDate: Date
}

const employeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
      default: 'Full-time',
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    joiningDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<IEmployee>('Employee', employeeSchema)
