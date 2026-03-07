import { uploadFileToWeb3Store } from "./ifpfs.ts";
import { getFilesFromPath } from 'web3.storage';


const files = await getFilesFromPath("./"); // get all files here
const cid = await uploadFileToWeb3Store(files); 