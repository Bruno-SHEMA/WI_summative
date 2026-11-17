import express from "express";
import "dotenv/config";
import { getJobs } from "./api.js";
const app = express();
const PORT = process.env.PORT || 3030;
app.use(express.json());

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
        if (!query || typeof query!=="string" || !query.trim()){
            return res.status(400).json({
                message: "Please Provide jon Q"
            });
        }
        const jobs = await getJobs({query: query.trim()});
        res.json({status: "success", total: jobs.length, jobs});
    } catch(error){console.error("Failed to retrieve jobs", error.message) 
        return res.status(502).json({status: "Oooops", message: "unable to get your jobs, Sorryrrrr!"});
    };

})
app.listen(PORT, ()=>{
    console.log(`Runningn on at http://localhost:${PORT}`);
});