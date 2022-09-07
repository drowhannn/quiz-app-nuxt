import { defineStore } from 'pinia'

export const useQuiz = defineStore('quiz', {
  state: () => {
    return {
      currentIndex: -1,
      questions: [],
      score: -1,
      correctIndex: -1,
    }
  },
  actions: {
    saveQuestions(questions) {
      this.questions = questions
      this.currentIndex = 0
      this.correctIndex =
        questions[0].type === 'multiple'
          ? Math.floor(Math.random() * 4)
          : questions[0].correct_answer === 'true'
          ? 0
          : 1
      this.score = 0
    },
    increaseScore() {
      this.score++
    },
    nextQuestion() {
      this.currentIndex++
      this.correctIndex =
        this.questions[this.currentIndex].type === 'multiple'
          ? Math.floor(Math.random() * 4)
          : this.questions[this.currentIndex].correct_answer === 'True'
          ? 0
          : 1
    },
    resetQuizState() {
      this.currentIndex = -1
      this.questions = []
      this.score = -1
      this.correctIndex = -1
    },
  },
  getters: {
    questionsCount: (state) => state.questions.length,
    choicesCount: (state) => (state.questions[state.currentIndex].type === 'multiple' ? 4 : 2),
    currentChoices: (state) => {
      if (state.questions.length === 0) return []
      else if (state.questions[state.currentIndex].type === 'multiple') {
        return insert(
          state.questions[state.currentIndex].incorrect_answers,
          state.correctIndex,
          state.questions[state.currentIndex].correct_answer
        )
      } else {
        return ['True', 'False']
      }
    },
  },
})

const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)]
