<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">
    <div>Error!</div>
    <button>Go back</button>
  </div>
  <div v-else>
    <div class="w-screen h-screen bg-amber-100 flex flex-col items-center justify-center">
      <div class="relative bg-white w-4/5 h-5/6 rounded-lg p-5 flex flex-col items-center justify-around">
        <NuxtLink to="/" class="text-5xl text-amber-500 font-bold">
          Qui<span class="text-yellow-500">Z</span>z<span class="text-yellow-500">Y</span>
        </NuxtLink>
        <div class="flex items-center justify-center text-orange-700 font-bold">
          <div class="text-2xl w-10/12">
            <span class="mr-2">Q. {{ quizState?.currentIndex + 1 }} </span>
            <span v-html="quizState?.questions[quizState?.currentIndex]?.question"></span>
          </div>
        </div>
        <div class="grid grid-cols-2 items-center gap-6">
          <button
            @click="checkAnswer(index)"
            class="bg-amber-500 text-white font-semibold py-3 px-6 rounded-3xl border enabled:hover:border-amber-500 enabled:hover:text-amber-500 enabled:hover:bg-transparent transition ease-in duration-150"
            v-for="(choice, index) in quizState?.currentChoices"
            :class="{
              'bg-red-500': quizState?.correctIndex !== index && hasChosenAnswer && index === choosenIndex,
              'bg-green-500': quizState?.correctIndex === index && hasChosenAnswer,
              'cursor-no-drop': hasChosenAnswer,
            }"
            :disabled="hasChosenAnswer"
          >
            {{ choice }}
          </button>
        </div>
        <div class="absolute top-0 right-0 p-2 text-purple-500 font-semibold">
          Score: {{ quizState?.score }} / {{ hasChosenAnswer ? quizState?.currentIndex + 1 : quizState?.currentIndex }}
        </div>
      </div>
      <div v-if="hasChosenAnswer" class="bg-white p-5 w-4/5 flex flex-col gap-3 items-center justify-center">
        <p class="text-green-500 font-extrabold" v-if="isAnswerCorrect">Correct Answer!</p>
        <p class="text-red-500 font-extrabold" v-else>Incorrect Answer!</p>
        <button
          class="bg-blue-500 text-white font-semibold py-3 px-6 rounded-3xl border hover:border-blue-500 hover:text-blue-500 hover:bg-transparent transition ease-in duration-150"
          @click="nextQuestion"
          v-if="!hasQuizFinished"
        >
          Next
        </button>
        <div v-else class="flex flex-col gap-2">
          <p>Your final score is {{ quizState?.score }} in {{ quizState?.questionsCount }}</p>
          <button
            class="bg-blue-500 text-white font-semibold py-3 px-6 rounded-3xl border hover:border-blue-500 hover:text-blue-500 hover:bg-transparent transition ease-in duration-150"
            @click="playAgain"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuiz } from '~/store/quiz'

const route = useRoute()
const quizState = useQuiz()

let hasChosenAnswer = ref(false)
let isAnswerCorrect = ref(false)
let hasQuizFinished = ref(false)
let choosenIndex = ref(-1)

const { number, difficulty, type } = route.query

let url = `https://opentdb.com/api.php?amount=${number}&difficulty=${difficulty}&type=${type}`

const { data, error, pending, refresh } = useAsyncData('questions', () => $fetch(url))

onMounted(() => {
  refresh()
})

const checkAnswer = (index) => {
  if (!hasChosenAnswer.value) {
    hasChosenAnswer.value = true
    choosenIndex.value = index
    if (index === quizState.correctIndex) {
      isAnswerCorrect.value = true
      quizState.increaseScore()
    }
    if (quizState.currentIndex === quizState.questionsCount - 1) {
      hasQuizFinished.value = true
    }
  }
}

const nextQuestion = () => {
  hasChosenAnswer.value = false
  isAnswerCorrect.value = false
  quizState.nextQuestion()
}

const playAgain = () => {
  hasChosenAnswer.value = false
  hasQuizFinished.value = false
  isAnswerCorrect.value = false
  refresh()
}

watch(data, (newData) => {
  quizState.saveQuestions(newData.results)
})
</script>
