module.exports = {
  allQuestions: [
    ...require("./easy.json"),
    ...require("./simple.json"),
    ...require("./middle.json"),
    ...require("./hard.json"),
      ...require("./intergroup.json")
  ]
}