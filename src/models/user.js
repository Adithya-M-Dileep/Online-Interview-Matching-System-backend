import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  offer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const Users = mongoose.model('CurrentUser', usersSchema);

export default Users;
