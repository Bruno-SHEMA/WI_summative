const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-button");
const jobsContainer = document.getElementById("jobs-container");
const suggestedJobs = document.getElementById("suggested-jobs-container");

//fn to get jobs from node
async function fetchJobs(query = ""){
    const url = query ? `/api/jobs?query=${encodeURIComponent(query)}` : "/api/jobs";
    const response = await fetch(url);
    if(!response.ok){ throw new Error("Opps, unable to fetch j from node");    }
    return await response.json();
}
console.log("Connnnnn")