'use strict'

class KeyTokenService { 
    static generateToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = {
                    upsert: true, // chưa có thì thêm vô, có rồi thì update
                    new: true,
                };
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };

    static removeKeyTokenById = async (id) => {
        const deletedResult = await keyTokenModel.deleteOne({
            _id: new Types.ObjectId(id),
        });
        return deletedResult;
    };

    
}

export default KeyTokenService