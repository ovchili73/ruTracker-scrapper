import mongoose, { Schema, Document } from "mongoose";
import { ITorrent, IUser, IThank } from "../types";

export interface ITorrentDocument extends ITorrent, Document {}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    profileUrl: { type: String },
  },
  { _id: false }
);

const ThankSchema = new Schema<IThank>(
  {
    user: { type: UserSchema, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const TorrentSchema = new Schema<ITorrentDocument>(
  {
    topicId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: UserSchema, required: true },
    releaseDate: { type: Date, required: true },
    magnetLink: { type: String },
    torrentFileUrl: { type: String },
    thanks: [ThankSchema],
    subcategoryId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Torrent = mongoose.model<ITorrentDocument>(
  "Torrent",
  TorrentSchema
);
