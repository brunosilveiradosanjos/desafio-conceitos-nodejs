const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');
const { isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

// repositories object sample
const repositories = [];
// [{
//   "id": "cbcda245-59de-4c98-865e-cc6cb314a6a6",
//   "title": "Desafio Angular.js",
//   "url": "http://github.com/banjos/angular",
//   "techs": [
//     "Node.js",
//     "Angular.js"
//   ],
//   "likes": 0
// },
// {
//   "id": "22efa31f-3d2e-4377-8f09-86c7fd1778d5",
//   "title": "Desafio Vue.js",
//   "url": "http://github.com/banjos/vue",
//   "techs": [
//     "Node.js",
//     "Vue.js"
//   ],
//   "likes": 0
// }
// ];

function validadeRepositorytId(request, response, next) {
  const { id } = request.params;
  // console.log(`Validação ${id}`)
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID.' })
  }

  next();
}

app.use('/repositories/:id', validadeRepositorytId);

app.get('/repositories', (request, response) => {
  // console.log(repositories);
  return response.json(repositories);
});


app.post("/repositories", (request, response) => {

  // Build repository
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Project not found' })
  }

  repositories[repositoryIndex].title = title
  repositories[repositoryIndex].url = url
  repositories[repositoryIndex].techs = techs

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories[repositoryIndex].likes++

  // console.log(repositories[repositoryIndex])

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
