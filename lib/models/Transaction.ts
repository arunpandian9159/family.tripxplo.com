import mongoose, { Document, Model } from "mongoose";

interface IPaymentInstrument {
  type: string;
  pgTransactionId: string;
  pgServiceTransactionId: string;
  bankTransactionId: string;
  bankId: string;
  arn: string;
}

export interface ITransaction extends Document {
  transactionId: string;
  merchantId: string;
  merchantTransactionId: string;
  amount: number;
  state: string;
  responseCode: string;
  paymentInstrument: IPaymentInstrument;
}

const TransactionSchema = new mongoose.Schema<ITransaction>({
  transactionId: { type: String, required: true, unique: true },
  merchantId: { type: String },
  merchantTransactionId: { type: String },
  amount: { type: Number },
  state: { type: String },
  responseCode: { type: String },
  paymentInstrument: {
    type: { type: String },
    pgTransactionId: { type: String },
    pgServiceTransactionId: { type: String },
    bankTransactionId: { type: String },
    bankId: { type: String },
    arn: { type: String },
  },
});

// Note: transactionId already has unique: true which creates an index

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema, "transaction");

export default Transaction;
