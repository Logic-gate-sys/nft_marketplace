import { ethers} from 'ethers';

export const getTokenURI = async (readContractInstance : any, tokenId: any) : Promise<string> => {
    const tokenURI = await readContractInstance.tokenURI(tokenId);
    return tokenURI;
}


export const getTransferLogs = (eventName: any, receipt: any) => {
    try {
        for (const log of receipt?.logs ?? []) {
            if (log.eventName === eventName) {
                const from = log.args[0];
                const to = log.args[1];
                const tokenId = log.args[2];
                // return these 
                return {
                    from: String(from),
                    to: String(to),
                    tokenId:tokenId.toString()
                };
            }
        }
        return null;
    } catch (err) {
        console.log(err);
        return;
    }
}



export const getListedLogs = (receipt: any)  => {
    try {
        let _nftAddress = "";
        let _tokenID = 0;
        let _price = 0;
        // iterate the receipt logs array
        for (const log of receipt?.logs ?? []) {
            if (log.eventName === "_TokenListed") {
              _nftAddress = log.args[0]; 
              _tokenID = log.args[1];
              _price = log.args[2];
           }
        }
        // if none found return undefined
        return {_nftAddress, _tokenID, _price};
        
    } catch (err) {
        console.log(err);
        return;
    }
}