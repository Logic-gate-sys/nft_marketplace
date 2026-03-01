import app from './app';
import { startMarketPlaceListeners } from './blockchain';

let PORT = process.env.PORT || 3000;

// start event Listeners 
app.listen(PORT, async() => {
    console.log(`Server running on : http://localhost:${PORT}`);
    await startMarketPlaceListeners();
})