# WI_summative_Project: JobBridge
JobBridge is a web application that is designed to help people discover job opportunities in different fields. It brings job listings together in one place, making it easier to search, filter, and explore available opportunities.

When developing this, I used the JSearch API (which I got from the RapidAPI website we were recommended) to retrieve job listings 

* Features
JobBridge has different features 

. Browse available job opportunities.
. Search for jobs by keywords.
. Filter jobs by employment type and workplace.
. View detailed job descriptions.
. Get job listings through the JSearch API.
. Sort jobs using

Built With

. HTML, CSS(with bootstrap) and JavaScript
. Node.js (Express.js)
. JSearch API (from RapidAPI)
. Nginx and HAProxy
. PM2

* A small walkthrough of the development lifecycle:
Before getting started with development of Jobbridge, I didn't even have any idea of what I was going to work on. I started by exploring the RapidAPI website, which contains vast categories of external API's you can use in your project/ https://rapidapi.com/categories . When I was going through those API categories on RapidAPI, I stumbled across the JSearch API, and then I chose to use it. But before starting to use it I referenced the JSONPlaceholder website (https://jsonplaceholder.typicode.com/#get) to understand how API interactions are done.
After choosing the API to use, I then created the frontend structure using HTML, CSS (with Bootstrap), and JavaScript. I later on then initialized Node.js to start communicating securely with the JSearch API.

* Some of the challenges I faced throughout development to deployment, and how I tried to overcome:
  
- The first challenge I faced was when trying to find an external API to use, because those APIs on RapidAPI, even though some of them are free, they have limited request credits per month. Some of them, like ActiveJobs DB, had a limit of 25 requests/ month (https://rapidapi.com/fantastic-jobs-fantastic-jobs-default/api/active-jobs-db/pricing), but then I saw JSearch API which had a limit of 200 requests/ month, and then I chose to go with it because it seemed like the best deal.
- Another challenge I faced, which relates to that one I was talking about above, is on how to manage those monthly request limits. I had to avoid doing unnecessary requests to the JSearch API endpoint, and that's where I introduced a cache functionality to help store some data in cache and then use it later rather than making a new request for every test.
- When I was transitioning from local development to deploying to the web servers ( web-01 and web-02), I discovered that none of them had Node and NPM installed. As I said, I used Node.js for my backend, and to run it, those two tools must be present. So it also challenged me, and to address it, I had to then install them on both web-01 and web-02. I first used `ssh -i ~/.ssh/school/ ubuntu@IpAdress` to switch to one of those servers using their IP address, and then used `sudo apt update` and `sudo apt install nodejs npm`.
- Another major challenge I faced was how the backend would keep running even when I am not on the server to start it. This was a major one because the backend needs to be running in order for the frontend to be able to send requests to the external API. I had to do research on what tools I could use, and I saw two interesting options: running it as a system service, or using pm2. I chose to use pm2, which is a process manager tool, to help keep the Node.js backend running always in the background. I first installed it using `sudo npm install pm2`, and then, after installing it, I used `pm2 start server.js --name jobbridge`, and then `pm2 status` to check if it's running.

Getting Started

1. Clone the repository

git clone https://github.com/Bruno-SHEMA/WI_summative.git
cd WI_summative

2. Install dependencies

npm install

3. Set up environment variables

Create a .env file in the project root and add the environment variables:

4. Run the application

  npm start
  
or

  npm run dev


Then, open the browser and visit:

  http://localhost:3030

Project Structure

WI_summative/
├── assets/
├── scripts/
│   ├── app.js
│   └── job-details.js
├── styles/
│   └── style.css
├── index.html
├── job-details.html
├── api.js
├── server.js
├── package.json
└── README.md

Deployment architecture:

When deploying, I depended on this architecture design:

<img width="1292" height="404" alt="image" src="https://github.com/user-attachments/assets/e4118d73-5dc2-4ecf-b0bb-77e1023cc5cc" />

There are some configurations I had to make on both servers to make sure they work accordingly,
1. I first installed Node.js and NPM on both Web-01 and Web-02 servers, in order to be able to accomodate the backend project.
2. After installing Node.js and NPM, I then brought the source code to both servers
3. After bringing the source code to both servers, I then had to install pm2 to run the project always in the background.
4. I then had to configure the Nginx config to receive requests and redirect them to the running backend project( which was running on 3000), after that, I then restarted Nginx to apply those changes using `sudo systemctl restart nginx` and ` sudo systemctl status nginx` to check if it successfully restarted.
5. I also switched to  lb-01, to check if Haproxy was still running successfully, because I configured it in the previous Intranet projects. And I have these three main configurations:
   . HAProxy listens for incoming HTTP traffic on port 80 and HTTPS traffic on port 443.
   . Both frontends forward requests to the same backend.
   . balance roundrobin distributes requests between the two web servers in turn.

For Testing command-line based testing I used these ways: 
* I tested the health endpoint:

curl https://www.shemabruno.tech/api/health

The application returned a successful response:

{
  "status": "success",
  "message": "Itsss runninge!"
}

I also tested job retrieval and invalid search input.

*  Verifying load balancing

To confirm that HAProxy was distributing traffic, I sent multiple requests to the public website using:

for i in {1..6}; do
    curl -s -I https://www.shemabruno.tech | grep -i x-served-by
done

The responses alternated between Web-01 and Web-02, confirming that both servers were receiving traffic through HAProxy.
I also checked the services directly on the servers to confirm that PM2, Nginx and HAProxy were running.

I used these two servers:

Web-01: Runs the Node.js (Express.js) backend of the application using Nginx as a reverse proxy.

Web-02: Also Runs a second application instance of the Node.js (Express.js) using Nginx which acts as the reverse proxy.

and a LoadBalancer: 
LB-01: which handles incoming traffic using HAProxy and allocates that traffic across the two servers ( web-01 and web-02).

HAProxy distributes incoming requests between the two web servers using round-robin load balancing.

* Deployment link : https://www.shemabruno.tech
* Demo video Link: https://youtu.be/XvfUtkI5CyE

 # credits
 First credit goes to JSearch API and its developer team: OpenWeb Ninja MCP: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 JSONPlaceholder and its developer team: https://jsonplaceholder.typicode.com/#get
 RapidAPI documentation: https://rapidapi.com/hub, https://rapidapi.com/page/about
 Node.js and its developers:  https://nodejs.org/docs/latest/api/
 Express.js and its developers: https://expressjs.com/
 Nginx and its developers: https://nginx.org/en/docs/
 HAProxy and its developers: https://www.haproxy.org/#docs
 .tech domains and its developers: https://get.tech/
Other resources and libraries used:
 Bootstrap – frontend styling and responsive components.
 PM2 – managing the Node.js application process.
 

---Yours truly, SHEMA Alain Bruno ---
GitHub: https://github.com/Bruno-SHEMA
