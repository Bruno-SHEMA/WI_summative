const API_URL = "https://jsearch.p.rapidapi.com/search-v2";
export async function getJobs({
    query,
    country = "rw",
    language = "en",
    datePosted = "week"
}){
    if (!process.env.RAPIDAPI_KEY){
        throw new Error("key wasnt configured");
    }
    const params = new URLSearchParams({
        query,
        country,
        language,
        date_posted: datePosted,
        num_pages: "1"
    });
    const response = await fetch(`${API_URL}?${params}`,{
        method: "get",
        headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.RAPIDAPI_HOST
        }
    });
    if (!response.ok) {
        const errorSMS = await response.text();
        throw new Error( `API Error (${response.status}): ${errorSMS}`);
    }
    const jobsData = await response.json();
    return jobsData.data?.jobs ?? [];
}