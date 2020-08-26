const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middlewares
function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);

    return next(); //Para por aqui

    //next(); //Segue para o próximo passo
    //Próximo passo
}

function validateRepositoryId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid repository ID.' });
    }

    return next();
}

app.use(logRequests); //Roda para todas as rotas
// app.use('/repository/:id', validateRepositoryId); //Utiliza o middleware em todas as rotar que começam com /repository/:id

app.get("/repositories", (request, response) => {
    const { title } = request.query;

    const results = title ?
        repositories.filter(repository => repository.title.includes(title)) :
        repositories;

    return response.json(results);
});

app.post("/repositories", (request, response) => {
    const { url, title, techs } = request.body;

    const repository = { id: uuid(), url, title, techs, likes: 0 };

    repositories.push(repository);

    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { url, title, techs, likes } = request.body;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found.' });
    }

    if (likes !== undefined) {
        return response.json({ likes: repositories[repositoryIndex].likes });
    }

    const repository = { id, url, title, techs };

    repositories[repositoryIndex] = repository;


    return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found.' });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository not found.' });
    }

    const repository = repositories[repositoryIndex];

    repository.likes++;

    repositories[repositoryIndex] = repository;

    return response.json(repository);
});

module.exports = app;