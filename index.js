require('dotenv').config()

const express = require("express");
//we are making an object for express framework to use.
const app = express();

const PORT = 4000;
const githubData = {
    "login": "tarun1sisodia",
    "id": 128500527,
    "node_id": "U_kgDOB6jDLw",
    "avatar_url": "https://avatars.githubusercontent.com/u/128500527?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/tarun1sisodia",
    "html_url": "https://github.com/tarun1sisodia",
    "followers_url": "https://api.github.com/users/tarun1sisodia/followers",
    "following_url": "https://api.github.com/users/tarun1sisodia/following{/other_user}",
    "gists_url": "https://api.github.com/users/tarun1sisodia/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/tarun1sisodia/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/tarun1sisodia/subscriptions",
    "organizations_url": "https://api.github.com/users/tarun1sisodia/orgs",
    "repos_url": "https://api.github.com/users/tarun1sisodia/repos",
    "events_url": "https://api.github.com/users/tarun1sisodia/events{/privacy}",
    "received_events_url": "https://api.github.com/users/tarun1sisodia/received_events",
    "type": "User",
    "user_view_type": "public",
    "site_admin": false,
    "name": "Tarun Sisodia",
    "company": null,
    "blog": "https://tarun-sisodia-nup9tne.gamma.site/",
    "location": "India",
    "email": null,
    "hireable": true,
    "bio": "Hey, I'm MCA Cybsecurity. \r\nCurrently,on APP & Backend Dev.. \r\nAutomation using AI agents",
    "twitter_username": "tarun1sisodia",
    "public_repos": 46,
    "public_gists": 0,
    "followers": 8,
    "following": 16,
    "created_at": "2023-03-21T15:03:02Z",
    "updated_at": "2025-09-07T15:21:08Z"
}
app.get('/', (req, res) => {
    res.send("Root");
});

app.get('/login', (req, res) => {
    res.send('<h1>Please Go to Hitesh Sir backend playlist</h2>');
});

app.get('/github', (req, res) => {
    res.send(githubData);
});
app.get('/health', (req, res) => {
    res.send('200 OK');
});

app.listen(process.env.PORT, () => {
    // print();
    // setInterval(() => { print(); }, 2000);
    console.log(`Server Listening on ${PORT}`);
});

app.get('/x', (req, res) => {
    res.send('Congrats You Are Admin at X');
});

app.get('/youtube', (req, res) => {
    res.send('<h2>CHai AUr COde</h2>');
});
/* function print() {
    console.log("Nothing Found:");
} */