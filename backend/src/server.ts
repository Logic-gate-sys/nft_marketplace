import app from './app';

let PORT = process.env.SERVER_PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running on port: ${process.env.DEV_HOST}`);
    console.log("GraphQL endpoint running on  : http://localhost:3000/graphql");
})