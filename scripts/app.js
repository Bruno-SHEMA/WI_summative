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

// fn to then create job card n displaay it
function createJobCard(job){
    const card = document.createElement("div");
    card.className = "job-card bg-white card my-5 p-8";
    const title = document.createElement("h4");
    title.className = "title-color";
    title.textContent = job.job_title || "Un-named Position";
    const company = document.createElement("p");
    company.className = "soft";
    company.textContent = job.employer_name || "ComppanyName unavailable";
    const details = document.createElement("div");
    details.className = "short-description";
    const employment = document.createElement("p");
    employment.textContent = `⌚ ${job.job_employment_type}` || "Employment type not specified";
    const location = document.createElement("p");
    location.textContent = `🌍 ${job.job_city || job.job_country} ` || "To be specified";
    const description = document.createElement("p");
    description.className = "soft";
    description.textContent = job.job_description ? job.job_description.slice(0, 180) + "..." : "No more description provided.";
    const applyLink = document.createElement("a");
    applyLink.className = "more dark-purple fg-white p-4 px-5";
    applyLink.textContent = "Apply Now";
    applyLink.href = job.job_apply_link || "#";
    applyLink.target = "_blank";
    applyLink.rel = "noopener noreferrer";

    card.append(title,company,details,employment,location,description,applyLink);
    return card;
}

//fn to show those jobs on frontend
function showJobs(jobs){
    jobsContainer.innerHTML = "";
    suggestedJobs.innerHTML = "";
    if (!jobs.length){
        jobsContainer.textContent = "Sorry na, No jobs found at the moment. Try Again!";
        return;
    }
    jobs.forEach( job => {
        const jobCard = createJobCard(job);
        jobsContainer.appendChild(jobCard);
    });
    jobs.slice(0, 3).forEach(job => {
        const suggestsCard = createJobCard(job);
        suggestedJobs.appendChild(suggestsCard);
    })
}

// Load Jobss
async function loadJobs(){
    jobsContainer.textContent = "Loading Jobs. . .";
    suggestedJobs.textContent = "Loading Suggested jobs . . . .";
    try{
        const result = await fetchJobs();
        showJobs(result.jobs);
    } catch(error){
        console.error("Oooops, error loading jobs", error);
        jobsContainer.textContent = "Unable to load them jobs, try again later!";
        suggestedJobs.textContent = "Unable to load suggestions at the moment Ooo";
    }
}
loadJobs();