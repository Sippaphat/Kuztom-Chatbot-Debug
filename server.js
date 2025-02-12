// server.js
import express from 'express';
import sheet1Router from './api/sheet1.js';
import sheet2Router from './api/sheet2.js';

const app = express();

app.use('/api/sheet1', sheet1Router);
app.use('/api/sheet2', sheet2Router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
