import mongoose from 'mongoose';

const pairingSchema = new mongoose.Schema({
    user1: { type: String, required: true },
    user2: { type: String, required: true },
  });
  
  const PairedConnections = mongoose.model('PairedConnections', pairingSchema);

  export default PairedConnections;