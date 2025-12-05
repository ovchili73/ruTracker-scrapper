import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "../types";

export interface ICategoryDocument extends ICategory, Document {}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
    subcategories: [{ type: String }],
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategoryDocument>(
  "Category",
  CategorySchema
);
