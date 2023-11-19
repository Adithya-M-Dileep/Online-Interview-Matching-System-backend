import PairingModel from '../models/pairedConnections.js';

export const getOtherUserId = async (clientId) => {
    try {
      const pair = await PairingModel.findOne({
        $or: [{ user1: clientId }, { user2: clientId }],
      });
  
      if (!pair) {
        throw new Error('Pair not found');
      }
  
      return pair.user1 === clientId ? pair.user2 : pair.user1;
    } catch (error) {
      throw new Error(`Failed to get the other user: ${error.message}`);
    }
  };

export const deletePairByClientId = async (clientId) => {
    try {
      await PairingModel.deleteOne({
        $or: [{ user1: clientId }, { user2: clientId }],
      });
    } catch (error) {
      throw new Error(`Failed to delete pair: ${error.message}`);
    }
  };