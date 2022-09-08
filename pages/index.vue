<template>
  <div class="w-screen h-screen bg-amber-100 flex items-center justify-center">
    <div
      class="bg-white w-4/5 h-5/6 rounded-lg p-5 flex flex-col items-center justify-around"
    >
      <div class="text-5xl text-amber-500 font-bold">
        Qui<span class="text-yellow-500">Z</span>z<span class="text-yellow-500"
          >Y</span
        >
      </div>

      <div>
        <p class="uppercase text-3xl text-amber-500 font-bold">
          Test your knowledge
        </p>
      </div>

      <form
        @submit.prevent="startQuiz"
        action=""
        class="flex p-3 flex-col w-2/4 h-3/5 items-center justify-around"
      >
        <div class="flex flex-col items-baseline gap-1 w-full">
          <label for="number" class="text-2xl text-orange-600 font-semibold"
            >Number of Questions:</label
          >
          <select
            v-model="number"
            name="number"
            id=""
            class="p-2 font-bold text-red-500 w-full"
          >
            <option value="5" selected>5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
        <div class="flex flex-col items-baseline gap-1 w-full">
          <label
            for="difficulty"
            class="text-2xl w-2/3 text-orange-600 font-semibold"
            >Difficulty:</label
          >
          <select
            v-model="difficulty"
            name="difficulty"
            id=""
            class="p-2 font-bold text-red-500 w-full"
          >
            <option value="">Any</option>
            <option value="easy" selected>Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div class="flex flex-col items-baseline gap-1 w-full">
          <label for="type" class="text-2xl w-2/3 text-orange-600 font-semibold"
            >Type:</label
          >
          <select
            v-model="type"
            name="type"
            id=""
            class="p-2 font-bold text-red-500 w-full"
          >
            <option value="multiple" selected>Multiple Choice</option>
            <option value="boolean">True / False</option>
          </select>
        </div>
        <button
          class="bg-amber-500 text-white font-semibold py-3 px-6 rounded-3xl border hover:border-amber-500 hover:text-amber-500 hover:bg-transparent transition ease-in duration-150"
        >
          Start Quiz
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()

let number = ref('5')
let difficulty = ref('easy')
let type = ref('multiple')

const startQuiz = () => {
  router.push({
    name: 'quiz',
    query: {
      number: number.value,
      difficulty: difficulty.value,
      type: type.value,
    },
  })
}
</script>
