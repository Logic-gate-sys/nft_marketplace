import { promises } from "dns";


//---------------------- function find user_ by wallet 

export const getUserId = async (wallet: string) => {
    const fetch_result = await fetch(
        `http://localhost:3000/api/users/${wallet}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
    if (!fetch_result) {
        console.log("No user found for such id");
        return;
    }
    //fetch returns a promise that can be resolved
    const user = await fetch_result.json();
    return user.user_id;
}



//---------------------- create user ---------------------------
export const createUser = async (wallet: string, email?: string, username?: string) :Promise<any> => {
    const fetch_result = await fetch('http://localhost:3000/api/users/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, wallet, email })
    });
    const data = await fetch_result.json();
    // return 
    console.log("Created user:     ", data.new_user)
    return data?.new_user;
}


//------------------- create a collection ------------------------
export const createCollection = async (data: FormData) => {
    const fetch_result = await fetch('http://localhost:3000/api/collections/',
        {
            method: "POST",
            body: data
        }
    );
    // returned json
    const new_collection = await fetch_result.json();
    return new_collection;
 }