const {v4: uuidv4} = require('uuid');
const easy = require("./easy.json");
const simple = require("./simple.json");
const middle = require("./middle.json");
const hard = require("./hard.json");
const interGroup = require("./intergroup.json");


const selectQuestions = (questionsCollection, questionCount, excludeQuestionsIds, startOrder = 1) => {
    const questions = [];
    let questionsCollectNorExclude = questionsCollection.filter(question => {
        return !excludeQuestionsIds.includes(question.id);
    });

    for (let i = 0; i < questionCount; i++) {
        const randomIndex = Math.floor(Math.random() * questionsCollectNorExclude.length);
        questions.push({
            ...questionsCollectNorExclude[randomIndex],
            order: startOrder + i
        });
        questionsCollectNorExclude = questionsCollectNorExclude.filter((item, index) => index !== randomIndex);
    }

    return questions;
}

const generateUUID = (questions) => {
    return questions.map(question => {
        return {
            ...question,
            uid: uuidv4()
        };
    })
}

const generateQuestionGroup = (groupId, easyCount, simpleCount, middleCount, hardCount, excludeQuestionsIds) => {
    const easyQuestions = selectQuestions(easy, easyCount, excludeQuestionsIds, excludeQuestionsIds.length + 1);
    const simpleQuestions = selectQuestions(simple, simpleCount, excludeQuestionsIds, excludeQuestionsIds.length + easyCount + 1);
    const middleQuestions = selectQuestions(middle, middleCount, excludeQuestionsIds, excludeQuestionsIds.length + easyCount + simpleCount + 1);
    const hardQuestions = selectQuestions(hard, hardCount, excludeQuestionsIds, excludeQuestionsIds.length + easyCount + simpleCount + middleCount + 1);

    return {
        group: {
            groupId: groupId,
            questions: [
                ...generateUUID(easyQuestions),
                ...generateUUID(simpleQuestions),
                ...generateUUID(middleQuestions),
                ...generateUUID(hardQuestions)
            ],
            interGroupQuestions: generateUUID(interGroup)
        },
        questionsIds: [...easyQuestions, ...simpleQuestions, ...middleQuestions, ...hardQuestions].map(question => question.id)
    }
}

const generateQuestionsGroups = (easyCount, simpleCount, middleCount, hardCount, groupCount) => {
    // generate four groups
    let questionsGroups = [];
    let excludeQuestionsIds = [];
    for (let i = 0; i < groupCount; i++) {
        const {
            group,
            questionsIds
        } = generateQuestionGroup(i, easyCount, simpleCount, middleCount, hardCount, excludeQuestionsIds);
        excludeQuestionsIds.push(...questionsIds);
        questionsGroups.push(group);
    }
    return questionsGroups;
}

module.exports = {
    generateQuestionsGroups
}