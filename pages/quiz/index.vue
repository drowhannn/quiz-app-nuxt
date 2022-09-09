<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">
    <div>Error!</div>
    <button>Go back</button>
  </div>
  <div v-else-if="isFetched">
    <div
      class="w-screen min-h-screen bg-amber-100 flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        class="relative bg-white w-screen h-screen sm:w-4/6 sm:h-5/6 rounded-lg p-5 flex flex-col items-center justify-between sm:justify-center"
      >
      <div
          class="pt-6 text-orange-500 uppercase text-xs flex w-full items-center justify-around sm:my-5"
        >
          <p class="flex items-center flex-col sm:flex-row">
            <span>Ques: </span>
            <strong class="ml-1">{{ number }}</strong>
          </p>
          <p class="flex items-center flex-col sm:flex-row">
            <span>Difficulty: </span>
            <strong class="ml-1">{{ difficulty }}</strong>
          </p>
          <p class="flex items-center flex-col sm:flex-row">
            <span>Type: </span>
            <strong class="ml-1">{{
              type === 'multiple' ? 'Multiple' : 'True / False'
            }}</strong>
          </p>
          <p class="flex items-center flex-col sm:flex-row">
            <span>Score: </span>
            <strong class="ml-1"
              >{{ quizState?.score }} /
              {{
                hasChosenAnswer
                  ? quizState?.currentIndex + 1
                  : quizState?.currentIndex
              }}</strong
            >
          </p>
          <p class="flex items-center flex-col sm:flex-row">
            <span>Time: </span>
            <strong class="ml-1">{{
              timeTaken > 3599
                ? new Date(timeTaken * 1000).toISOString().slice(11, 19)
                : new Date(timeTaken * 1000).toISOString().slice(14, 19)
            }}</strong>
          </p>
        </div>
        <NuxtLink to="/" class="text-4xl sm:text-5xl lg:text-6xl text-amber-500 font-bold sm:my-5">
          Qui<span class="text-yellow-500">Z</span>z<span
            class="text-yellow-500"
            >Y</span
          >
        </NuxtLink>
        <div class="flex items-center justify-center text-orange-700 font-bold sm:my-5">
          <div class=" text-xl sm:text-2xl w-11/12">
            <span class="mr-2">Q.{{ quizState?.currentIndex + 1 }} </span>
            <span
              v-html="quizState?.questions[quizState?.currentIndex]?.question"
            ></span>
          </div>
        </div>
        <div class="grid grid-cols-2 items-center gap-6 sm:my-5">
          <button
            @click="checkAnswer(index)"
            class="bg-amber-500 text-white font-semibold py-3 px-6 rounded-3xl border enabled:hover:border-amber-500 enabled:hover:text-amber-500 enabled:hover:bg-transparent transition ease-in duration-150 text-sm sm:text-xl"
            v-for="(choice, index) in quizState?.currentChoices"
            :class="{
              'bg-red-500':
                quizState?.correctIndex !== index &&
                hasChosenAnswer &&
                index === choosenIndex,
              'bg-green-500':
                quizState?.correctIndex === index && hasChosenAnswer,
              'cursor-no-drop': hasChosenAnswer,
              'mb-16':!hasChosenAnswer
            }"
            :disabled="hasChosenAnswer"
          >
            {{ choice }}
          </button>
        </div>
        <div
          v-if="!hasChosenAnswer"
          class="absolute bottom-0 right-0 p-4 flex items-center"
        >
          <div v-if="showHint" class="text-red-600 font-semibold">
            Hint of the answer
          </div>
          <div class="text-orange-400 font-bold">
            <span v-if="showHint"> &nbsp;&nbsp;&lt;&lt; </span>
            <span
              class="cursor-pointer"
              :class="{
                ' underline underline-offset-2 font-extrabold': showHint,
              }"
              @click="showHint = !showHint"
              >Show Hint</span
            >
          </div>
        </div>
        
        <div
          v-if="hasChosenAnswer"
          class="bg-white p-5 flex flex-col gap-3 items-center justify-center"
        >
          <p class="text-green-500 font-extrabold" v-if="isAnswerCorrect">
            Correct Answer!
          </p>
          <p class="text-red-500 font-extrabold" v-else>Incorrect Answer!</p>
          <p class="text-teal-500 font-bold text-2xl">
            Explantion: {{ quizState.currentChoices[quizState.correctIndex] }}
          </p>
          <button
            class="bg-blue-500 text-white font-semibold py-3 px-6 rounded-3xl border hover:border-blue-500 hover:text-blue-500 hover:bg-transparent transition ease-in duration-150"
            @click="nextQuestion"
            v-if="!hasQuizFinished"
          >
            Next
          </button>
          <div v-else class="flex flex-col w-full items-center gap-2">
            <p>
              Your final score is <strong>{{ quizState?.score }} </strong> in
              {{ quizState?.questionsCount }}
            </p>
            <p>
              Time Elapsed:
              <strong>{{
                timeTaken > 3599
                  ? new Date(timeTaken * 1000).toISOString().slice(11, 19)
                  : new Date(timeTaken * 1000).toISOString().slice(14, 19)
              }}</strong>
            </p>

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
  </div>
</template>

<script setup>
import { useQuiz } from '~/store/quiz'

const route = useRoute()
const quizState = useQuiz()
const router = useRouter()

let hasChosenAnswer = ref(false)
let isAnswerCorrect = ref(false)
let hasQuizFinished = ref(false)
let showHint = ref(false)
let choosenIndex = ref(-1)
let isFetched = ref(false)
let timeTaken = ref(0)

setInterval(() => {
  if (isFetched.value && !hasQuizFinished.value) {
    timeTaken.value++
  }
}, 1000)

const { number, difficulty, type } = route.query

if (!number && !difficulty && !type) {
  router.push({
    name: 'quiz/404',
    query: {},
  })
}

let url = `https://opentdb.com/api.php?amount=${number}&difficulty=${difficulty}&type=${type}`

const { data, error, pending, refresh } = useAsyncData('questions', () =>
  $fetch(url)
)

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
  showHint.value = false
  quizState.nextQuestion()
}

const playAgain = () => {
  hasChosenAnswer.value = false
  hasQuizFinished.value = false
  isAnswerCorrect.value = false
  timeTaken.value = 0
  refresh()
}

watch(data, (newData) => {
  quizState.saveQuestions(newData.results)
  isFetched.value = true
})
</script>
