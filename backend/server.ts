import app from './src/app.js';
import { config } from 'dotenv';
config();


let PORT = parseInt(process.env.SERVER_PORT, 10)||3000;


app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
})