import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DATA_FILE = './data/tasks.json';

app.use(cors());
app.use(express.json());

function readTasks() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

app.get('/tasks', (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const tasks = readTasks();
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Le titre est obligatoire.' });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);
  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Tâche introuvable.' });
  }

  const { title, completed } = req.body;

  if (title !== undefined) {
    tasks[index].title = title.trim();
  }

  if (completed !== undefined) {
    tasks[index].completed = completed;
  }

  writeTasks(tasks);
  res.json(tasks[index]);
});

app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const id = Number(req.params.id);

  const filteredTasks = tasks.filter(task => task.id !== id);

  if (filteredTasks.length === tasks.length) {
    return res.status(404).json({ message: 'Tâche introuvable.' });
  }

  writeTasks(filteredTasks);
  res.json({ message: 'Tâche supprimée.' });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});