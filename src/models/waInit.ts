import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWaInit extends Document {
  instance_id: string;
  access_token: string;
}

const WaInitSchema = new Schema<IWaInit>({
  instance_id: { type: String, required: true },
  access_token: { type: String, required: true },
});

export const WaInit: Model<IWaInit> =
  mongoose.models.WaInit || mongoose.model<IWaInit>('WaInit', WaInitSchema);
export default WaInit;
