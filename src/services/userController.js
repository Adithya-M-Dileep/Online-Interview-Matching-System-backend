import UserModel from '../models/user.js';

export const deleteUserById = async (clientId) => {
    try {
        await UserModel.deleteOne({clientId:clientId});
        console.log("removed user from waiting list");
    } catch (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }
};

// Function to retrieve a random user
export const getRandomUser = async () => {
    try {
        const randomUser = await UserModel.aggregate([{ $sample: { size: 1 } }]);
        if(randomUser){
        return randomUser[0]; // Return the randomly selected user
        }
        else{
        return null;
        }
        
    } catch (error) {
        throw new Error(`Failed to retrive user: ${error.message}`);
    }
};