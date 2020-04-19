import express from 'express';
import yields from 'express-yields';//For using the generators
import fs from 'fs-extra';
import webpack from 'webpack';
import { argv } from 'optimist';
import { get } from 'request-promise';
import { questions, question } from '../data/api-url';

import { delay } from 'redux-saga';
//instanciate express
const app = express();
const port = process.env.PORT || 3000;

const useLiveData = argv.useLiveData === 'true';

function* getQuestions() {
  let data;
  //if we are using the live data
  if (useLiveData) {
    data = yield get(questions, { gzip: true })

  } else {
    data = yield fs.readFile(`./data/questions.json`, "utf-8");
  }

  return JSON.parse(data);
}

function* getQuestion(id) {
  let data;
  if (useLiveData) {
    data = yield get(question(id), { gzip: true, json: true });
  } else {
    const questions = yield getQuestions();
    const question = questions.items.find(question => question.question_id === id);
    question.body = `Mock question body:${id}`;
    data = { items: [question] };

  }
  return data;
}

//make an  api route to handle
app.get(['/api/questions'], function* (req, res) {
  const data = yield getQuestions();
  yield delay(150);
  res.json(data);
})

app.get(['/api/questions/:id'], function* (req, res) {
  const data = yield getQuestion(req.params.id);
  yield delay(150);
  res.json(data);
})
if (process.env.NODE_ENV === 'development') {
  const config = require('../webpack.config.dev.babel').default;
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true
  }));
  app.use(require('webpack-hot-middleware')(compiler))

}

app.get(['/'], function* (req, res) {
  let index = yield fs.readFile(`./public/index.html`, 'utf-8');
  res.send(index);
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at ${port}`);
})
