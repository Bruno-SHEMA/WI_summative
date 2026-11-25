const detailsContainer = document.getElementById("job-details-container");
const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");
function formatPostedDate(timestamp) {
    if(!timestamp) return "Date Unavailable";
    return new Date(timestamp * 1000).toLocaleDateString(
        "en-GB",{
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}
function displayJob(job){
    detailsContainer.innerHTML = "";
    const title = document.createElement("h2");
    title.className = "title-color fw-bold mb-3";
    title.textContent = job.job_title || "Untitled";
    const company = document.createElement("h5");
    company.className = "soft mb-4";
    company.textContent = job.employer_name || "Company name unvailble";
    const info = document.createElement("div");
    info.className = "mb-4";
    const employment = document.createElement("p");
    employment.textContent = `Employment type: ${job.job_employment_type || "Not Specifed"}`;
    const location = document.createElement("p");
    location.textContent = `Location: ${job.job_is_remote ? "Remote" : "on-site / Not specified"}`;
    const posted = document.createElement("p");
    posted.textContent = `Posted at: ${formatPostedDate(job.job_posted_at_timestamp)}`;
    info.append(employment, location, posted);
    const heading = document.createElement("h4");
    heading.className = "title-color mt-5 mb-3";
    heading.textContent = "Job Description";
    const description = document.createElement("p");
    description.className = "soft";
    description.style.whiteSpace = "pre-line";
    description.textContent = job.job_description || "No further description provided!";
    detailsContainer.append(title, company, info, heading, description);
    if(job.job_salary_string || job.job_salary){
        const salary = document.createElement("p");
        salary.className = "mt-4";
        salary.textContent = `Salary: ${job.job_salary_string || job.job_salary}`;
        detailsContainer.appendChild(salary);
    }
    
}

async function loadJobDetails(){
    if(!jobId){
        detailsContainer.textContent = "No job was selectedddddddddddd.";
        return
    }
    try {
        const response = await fetch(`/api/jobs/detail?id=${encodeURIComponent(jobId)}`);
        const result = await response.json();
        if (!response.ok){ throw new Error(result.message || "Unable to retrieve 'em")};
        displayJob(result.job);
    } catch (error) {
        console.error("Failed to load more detailss", error);
        detailsContainer.textContent = "Unable to load more job details, please go back and try again!"
    }
}
loadJobDetails();