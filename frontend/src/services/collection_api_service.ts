
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