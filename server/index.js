import express from 'express';
import yields from 'express-yields';//For using the generators
import fs from 'fs-extra';
//instanciate express
const app = express();
const port = process.env.PORT || 3000;
app.get(['/'], function* (req, res) {
  let index = yield fs.readFile(`../public/index.html`, 'utf-8');
  res.send(index);
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at ${port}`);
})
