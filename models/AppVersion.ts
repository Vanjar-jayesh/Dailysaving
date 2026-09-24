import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAppVersion extends Document {
  versionName: string; // e.g., "1.0.5"
  versionCode: number; // e.g., 5
  apkUrl: string; // Path or URL to download the APK
  releaseNotes?: string;
  isMandatory: boolean;
}

const AppVersionSchema: Schema = new Schema(
  {
    versionName: {
      type: String,
      required: true,
    },
    versionCode: {
      type: Number,
      required: true,
    },
    apkUrl: {
      type: String,
      required: true,
    },
    releaseNotes: {
      type: String,
    },
    isMandatory: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.AppVersion) {
  delete mongoose.models.AppVersion;
}

const AppVersion: Model<IAppVersion> = mongoose.model<IAppVersion>('AppVersion', AppVersionSchema);

export default AppVersion;
