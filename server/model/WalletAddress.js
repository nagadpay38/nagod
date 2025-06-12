import mongoose from 'mongoose';

const WalletAddressSchema = new mongoose.Schema({
  btcAddress: { type: String, required: true },
  usdtAddress: { type: String, required: true },
  network: { type: String, default: 'ERC20' },
  note: { type: String, default: '' }
}, { timestamps: true });

 const WalletAddress= mongoose.model('WalletAddress', WalletAddressSchema);

export default WalletAddress;