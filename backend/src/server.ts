<<<<<<< HEAD
import app from './app.ts';
import { startMarketPlaceListeners } from './blockchain/marketplace.listener.ts';

let PORT = process.env.PORT || 3000;

// start event Listeners 
app.listen(PORT, async() => {
    console.log(`Server running on : http://localhost:${PORT}`);
    await startMarketPlaceListeners();
=======
import app from './app';
import { startMarketPlaceListeners } from './blockchain';

let PORT = process.env.PORT;

// start event Listeners 

app.listen(PORT, async() => {
    console.log(`Server running on : http://localhost:${PORT}`);

    await startMarketPlaceListeners();

>>>>>>> db7aaecd5b66d9beab530d02b1fe7dfd501dd197
})