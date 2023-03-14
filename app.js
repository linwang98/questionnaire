const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require('mongodb');


const { generateQuestionsGroups} = require("./questions-database/generate");
const { allQuestions } = require("./questions-database/questions");

const url = 'mongodb+srv://qwer1234:qwer1234@cluster0.xa6fp.mongodb.net';
const client = new MongoClient(url);
const dbName = 'medical-research';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const getUserAnswers = async () => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('answers');
    const allAnswers = await collection.find().toArray();

    return allAnswers;
  } catch (err) {
    return [];
  }
}

const saveUserAnswers = (userAnswers) => {
  const db = client.db(dbName);
  const collection = db.collection('answers');
  collection.insertOne(userAnswers);
}


app.get('', async (req, res) => {
  try {
    const allUserAnswers = await getUserAnswers();
    res.render('survey-result', {
      allUserAnswers
    });
  } catch (err) {
    console.log(err);
  }
})

app.get('/questionnaire', async (req, res) => {
  try {
    //const questionsGroups = generateQuestionsGroups(1, 1, 1, 1);
    const questionsGroups = generateQuestionsGroups(2, 1, 1, 1, 4);
    const questionnaireTitle = 'Health investigation';
    const questionnaireIntroduction = 'This questionnaire is xxxxxx';
    res.status(200).json({
      groups: questionsGroups,
      questionnaireTitle,
      questionnaireIntroduction
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/questionnaire/:index', async (req, res) => {
  try {
    const allUserAnswers = await getUserAnswers();
    const {index} = req.params;

    const userAnswers = allUserAnswers[Number(index)];
    const answers = userAnswers.answers;
    const questions = userAnswers.questions;


    const result = questions.map(question => {
      return {
        uid: question.uid,
        questionText: question.description,
        answerText: answers[question.uid]
      }
    })
    res.render('survey-user-result', {
      userTimes: userAnswers.userTimes,
      information: userAnswers.information,
      email: userAnswers.email,
      feedback: userAnswers.feedback,
      model: userAnswers.model,
      result
    })
  } catch (err) {
    console.log(err);
  }
});


// collect user answers
app.post('/questionnaire', async (req, res) => {
  try {
    const answers = req.body;
    saveUserAnswers(answers);
    res.status(201).send();
  } catch (err) {
    console.log(err);
  }
});


client
  .connect()
  .then(() => {
    console.log(`Mongodb connected`);
    app.listen(PORT, () => {
      console.log(`The server set up at port ${PORT}`);
    });
  })

