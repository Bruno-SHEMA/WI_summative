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
    title.textContent = job.job-title || "Un-named Position";
    const company = document.createElement("p");
    company.className = "soft";
    company.textContent = job.employer_name || "CC comppany";
    const details = document.createElement("div");
    details.className = "short-description";
    const employment = document.createElement("p");
    employment.textContent = `⌚ ${job.job_employment_type}` || "Employment type not specified";
    const location = document.createElement("p");
    location.textContent = `🌍 ${job.job_city || job.job_country} ` || "To be specified";
    const description = document.createElement("p");
    description.className = "soft";
    description.textCOntent = job.job_description ? job.job_description.slice(0, 180) + "..." : "No more description provided.";
    const applyLink = document.createElement("a");
    applyLink.className = "more dark-purple fg-white p-4 px-5";
    applyLink.textCOntent = "Apply Now";
    applyLink.href = job.job_apply_link || "#";
    applyLink.target = "_blank";
    applyLink.rel = "noopener noreferrer";

    card.append(title,company,details,employment,location,description,applyLink);
    return card;
}