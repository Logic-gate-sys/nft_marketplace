import app from './app.ts';
import { startMarketPlaceListeners } from './blockchain/marketplace.listener.ts';

let PORT = process.env.PORT || 3000;

// start event Listeners 
app.listen(PORT, async() => {
    console.log(`Server running on : http://localhost:${PORT}`);
    await startMarketPlaceListeners();
})