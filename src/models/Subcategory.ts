import mongoose, { Schema, Document } from "mongoose";
import { ISubcategory } from "../types";

export interface ISubcategoryDocument extends ISubcategory, Document {}

const SubcategorySchema = new Schema<ISubcategoryDocument>(
  {
    id: { type: String, required: true, unique: true },
    categoryId: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

export const Subcategory = mongoose.model<ISubcategoryDocument>(
  "Subcategory",
  SubcategorySchema
);
