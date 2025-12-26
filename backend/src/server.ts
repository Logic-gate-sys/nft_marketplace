import app from './app';
import { startMarketPlaceListeners } from './blockchain';

let PORT = process.env.PORT;

// start event Listeners 
await startMarketPlaceListeners();

app.listen(PORT, () => {
    console.log(`Server running on : http://localhost:${PORT}`);
})