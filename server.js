import express from "express";
import "dotenv/config";
import { getJobs, getAllJobs } from "./api.js";
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.json());
const cache = new Map();
const c_durat = 15 * 60 * 1000;
//cached dataa
function getCachedJobs(key){
    const cached = cache.get(key);
    if(!cached || Date.now() > cached.expiry) {
        return null;
    }
    return cached.jobs;
}
function cacheJobs(key, jobs){
    cache.set(key, {
        jobs,
        expiry: Date.now() + c_durat
    });
}

app.get("/", (req, res)=>{
    res.sendFile("index.html", { root: process.cwd()});
});
app.use("/styles", express.static("styles"));
app.use("/scripts", express.static("scripts"));
app.use("/assets", express.static("assets"));

app.get("/api/health", (req, res)=>{
    res.json({
        status: "success",
        message: "Itsss runninge!"
    });
});

app.get("/api/jobs", async (req, res) => {
    try {
        const { query } = req.query;
        // Shii to validate request query
        if (query !== undefined && (typeof query !== "string" || !query.trim())){
            return res.status(400).json({
                status: "Oooops",
                message: "Wetin be this! please provide a W request querry"
            });
        }
        
        const cacheKey = query ? query.trim().toLowerCase() : "discovery";
        const cachedJobs = getCachedJobs(cacheKey);
        if(cachedJobs){
            return res.json({
                status: "success",
                src: "cache",
                total: cachedJobs.length,
                jobs: cachedJobs 
            });
        }
        const jobs = query ? await getJobs({query: query.trim()}) : await getAllJobs();
        cacheJobs(cacheKey, jobs);
        return res.json({
            status: "success",
            src: "jsearch api",
            total: jobs.length,
            jobs
        });
    } catch(error){console.error("Failed to retrieve jobs", error.message) 
        return res.status(502).json({status: "Oooops", message: "unable to get your jobs, Sorryrrrr!"});
    };

})

//to get one job's details
app.get("/api/jobs/detail", async (req, res) => {
    try {
        const { id } = req.query;
        let jobs = getCachedJobs("discovery");
        if(!jobs) {
            jobs = await getAllJobs();
            cacheJobs("discovery", jobs);
        }
        const job = jobs.find(item => item.job_id === id);
        if(!job) {
            return res.status(404).json({
                status: "error",
                message: "Sorry That job was not found!!"
            });
        }
        return res.json({status: "sucess", job});
    } catch (error){
        console.error("Failed to get job detailss: ", error.message);
        return res.status(502).json({
            status: "error",
            message: "Oooo unable to retrieve job details."
        });
    }
});
app.get("/job-details", (req, res)=>{
    res.sendFile("Job-details.html", {
        root: process.cwd()
    });
});
app.listen(PORT, ()=>{
    console.log(`Runningn on at http://localhost:${PORT}`);
});