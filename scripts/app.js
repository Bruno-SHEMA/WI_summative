const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-button");
const jobsContainer = document.getElementById("jobs-container");
const suggestedJobs = document.getElementById("suggested-jobs-container");
const jobType = document.querySelectorAll(".job-type-filter");
const workplace = document.querySelectorAll(".workplace-filter");
const clear = document.getElementById("clear-filters");
const sortSelect = document.getElementById("sort-jobs");

let allJobs = [];
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
    employment.textContent = `⌚ ${job.job_employment_type || "Employment type not specified"}`;
    const location = document.createElement("p");
    location.textContent = `📍 ${job.job_city || job.job_country || "To be specified"}`;
    const description = document.createElement("p");
    description.className = "soft";
    description.textContent = job.job_description ? job.job_description.slice(0, 180) + "..." : "No more description provided.";
    const applyLink = document.createElement("a");
    applyLink.className = "more dark-purple fg-white p-4 px-5";
    applyLink.textContent = "Apply Now";
    applyLink.href = job.job_apply_link || "#";
    applyLink.target = "_blank";
    applyLink.rel = "noopener noreferrer";

    const detailsLink = document.createElement("a");
    detailsLink.className = "more dark-purple fg-white p-3 px-5";
    detailsLink.textContent = "More details ->";
    detailsLink.href = `/job-details?id=${encodeURIComponent(job.job_id)}`;
    card.append(title,company,details,employment,location,description,detailsLink,applyLink);
    return card;
}

//fn to show those jobs on frontend
function showJobs(jobs){
    jobsContainer.innerHTML = "";
    suggestedJobs.innerHTML = "";
    if (!jobs.length){
        jobsContainer.textContent = "Sorry na, No jobs found at the moment. Try Again!";
        suggestedJobs.textContent = "Sorry na, No suggestions available!";
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
const selectWorkplace = [...workplace].filter(filter => filter.checked).map(filter => filter.value);
// filtering function  
function filters(){
    const searchTerm = searchInput.value.trim().toLowerCase();
    const jobTypes = [...jobType].filter(filter => filter.checked).map(filter => filter.value);
    const filteredJobs = allJobs.filter(job => {
        const searchableText = [
            job.job_title,
            job.employer_name,
            job.job_description,
            job.job_city,
            job.job_country
        ].join(" ").toLowerCase();
        const matchesSearch = searchableText.includes(searchTerm);
        const employementTypes = job.job_employment_types || [];
        const matchJobType = jobTypes.length === 0 || jobTypes.some(type => employementTypes.includes(type));
        const matchWorkplace = selectWorkplace.length === 0 || selectWorkplace.some(workplace => {
            if (workplace === "remote"){
                return job.job_is_remote === true;
            }
            if (workplace === "onsite"){
                return job.job_is_remote === false;
            }
            return false;
        });
        return matchesSearch && matchJobType && matchWorkplace;
    });
    const sortedJobs = sortJobs(filteredJobs);
    showJobs(sortedJobs);

}
// Load Jobss
async function loadJobs(){
    jobsContainer.textContent = "Loading Jobs. . .";
    suggestedJobs.textContent = "Loading Suggested jobs . . . .";
    try{
        const result = await fetchJobs();
        allJobs = result.jobs;
        filters();
    } catch(error){
        console.error("Oooops, error loading jobs", error);
        jobsContainer.textContent = "Unable to load them jobs, try again later!";
        suggestedJobs.textContent = "Unable to load suggestions at the moment Ooo";
    }
}
loadJobs();

// searchnig jobs functionality
searchBtn.addEventListener("click", filters);
searchInput.addEventListener("input", filters);
jobType.forEach(filter => {
    filter.addEventListener("change", filters);
});
workplace.forEach(filter => {
    filter.addEventListener("change", filters);
});
clear.addEventListener("click", () => {
    jobType.forEach(filter => {
        filter.checked = false;
    });
    workplace.forEach(filter => {
        filter.checked = false;
    });
    searchInput.value = "";
    filters();
});
sortSelect.addEventListener("change", filters);

//fn to sort
function sortJobs(jobs) {
    const sortOpt = sortSelect.value;
    const sortedJobs = [...jobs];
    switch (sortOpt) {
        case "newest":
            sortedJobs.sort((a, b)=> (b.job_posted_at_timestamp || 0) - (a.job_posted_at_timestamp || 0));
            break;
        case "oldest":
            sortedJobs.sort((a, b) => 
            (a.job_posted_at_timestamp || 0) - 
            (b.job_posted_at_timestamp || 0)
            );
            break;
        case "title-asc":
            sortedJobs.sort((a, b)=> (a.job_title || "").localeCompare(b.job_title || ""));
            break;
    }
    return sortedJobs;
}