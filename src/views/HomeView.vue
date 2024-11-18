<script setup lang="ts">
import Button from '@/components/Button.vue'
import InputGroup from '@/components/InputGroup.vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'
import { formatCentsToEuro, formatDate, isSameDay } from '@/lib/utils'
import { computed, nextTick, ref } from 'vue'
import { IconFilterCheck, IconTextPlus, IconTrashXFilled } from '@tabler/icons-vue'
import { expenses } from '@/data/expenses'
import { CATEGORIES } from '@/data/categories'
import Hr from '@/components/Hr.vue'

const initialExpenses = ref<
  {
    id: number
    title: string
    description?: string
    amount?: number
    category: string
    date: Date
  }[]
>(expenses)

const form = ref<{
  title: string
  description: string
  amount?: number
  category: keyof typeof CATEGORIES | ''
}>({
  title: '',
  description: '',
  amount: undefined,
  category: '',
})

const expenseList = ref<HTMLElement | null>(null)
const filteredCategory = ref<string | null>(null)

function toggleCategoryFilter(category: string) {
  filteredCategory.value = filteredCategory.value ? null : category
}

function removeExpense(id: number) {
  initialExpenses.value = initialExpenses.value.filter((expense) => expense.id !== id)
}

function addExpense() {
  initialExpenses.value.push({
    id: initialExpenses.value[initialExpenses.value.length - 1].id + 1,
    title: form.value.title,
    description: form.value.description,
    amount: form.value.amount,
    category: form.value.category,
    date: new Date(),
  })
  form.value = {
    title: '',
    description: '',
    amount: undefined,
    category: '',
  }
  nextTick(() => {
    expenseList.value?.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const filteredExpenses = computed(() =>
  filteredCategory.value !== null
    ? initialExpenses.value
        .filter((expense) => expense.category === filteredCategory.value)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    : initialExpenses.value.sort((a, b) => b.date.getTime() - a.date.getTime()),
)

const totalAmount = computed(() =>
  filteredExpenses.value.reduce((expense, total) => expense + (total.amount ?? 0), 0),
)

const totalExpenses = computed(() => filteredExpenses.value.length)
</script>

<template>
  <main
    class="container mx-auto flex gap-8 items-center max-md:flex-col py-4 md:h-dvh md:pl-4 max-md:p-4"
  >
    <section class="space-y-3 w-[inherit] md:w-1/2">
      <h1 class="font-bold text-2xl">
        Expensify -
        <mark class="px-1 rounded py-0.5 bg-sky-300 text-sky-950"> Simplify expense tracking.</mark>
      </h1>
      <p>
        Add a new expense to your list. <br />
        You can categorize your expenses to keep track of your spending.
      </p>
      <form
        @submit.prevent="addExpense"
        class="p-4 border bg-neutral-50 border-b-4 border-neutral-200 rounded-lg space-y-2"
      >
        <InputGroup>
          <Label required for="title">Title</Label>
          <Input required id="title" type="text" v-model="form.title" placeholder="Cinema" />
        </InputGroup>
        <InputGroup>
          <Label for="amount" required
            >Amount <span class="text-xs text-neutral-600 font-normal">(in cents)</span></Label
          >
          <Input required placeholder="1390" type="number" id="amount" v-model="form.amount" />
        </InputGroup>
        <InputGroup>
          <Label for="description">Description</Label>
          <textarea
            placeholder="Cinema ticket for the new Marvel movie."
            class="border placeholder:text-neutral-400 border-b-2 border-neutral-200 bg-white p-2 text-sm rounded-md"
            v-model="form.description"
            name="description"
            id="description"
          ></textarea>
        </InputGroup>
        <InputGroup>
          <Label required for="category">Category</Label>
          <select
            required
            v-model="form.category"
            id="category"
            class="border border-neutral-200 px-2 py-1 invalid:text-neutral-400 bg-white border-b-2 text-sm block rounded-md"
          >
            <option disabled value="" class="text-neutral-500">Select a category</option>
            <option v-for="(value, key) in CATEGORIES" :key :value>
              {{ value }}
            </option>
          </select>
        </InputGroup>
        <Button><IconTextPlus size="20" />Add expense</Button>
      </form>
    </section>

    <div class="flex flex-col w-[inherit] h-full grow md:w-1/2">
      <header class="pb-2 text-sm">
        <p class="inline">
          Total of
          <span class="font-bold bg-green-200 text-green-900 px-1 py-0.5 rounded">
            {{ formatCentsToEuro(totalAmount) }}
          </span>
        </p>
        <p class="inline">
          from
          <span class="font-bold bg-purple-200 text-purple-900 px-1 py-0.5 rounded">
            {{ totalExpenses }}
          </span>
          {{ totalExpenses > 1 ? 'expenses' : 'expense' }}
        </p>
        <p v-if="filteredCategory" class="inline">
          in
          <span class="font-bold bg-orange-200 text-orange-900 px-1 py-0.5 rounded">{{
            filteredCategory
          }}</span>
        </p>
      </header>
      <div class="relative">
        <div
          class="bg-gradient-to-b from-white via-80% via-transparent shrink-0 z-10 to-transparent w-full top-0 h-4 absolute flex"
        ></div>
      </div>
      <ol ref="expenseList" class="h-full md:overflow-y-scroll flex flex-col gap-2 md:pr-4">
        <li :key="expense.id" v-for="(expense, index) in filteredExpenses" class="space-y-2">
          <div
            class="mt-2 flex gap-2 justify-between items-center"
            v-if="
              index === 0 ||
              (index > 0 && isSameDay(expense.date, filteredExpenses[index - 1].date) === false)
            "
          >
            <p class="text-xs text-neutral-500">
            <Hr />
              {{ formatDate(expense.date) }}
            </p>
            <Hr />
          </div>
          <div
            class="flex flex-col gap-1 relative border border-b-4 bg-neutral-50 border-neutral-200 px-3 py-2 rounded-lg"
          >
            <div class="flex justify-between gap-4 items-center">
              <h2 class="font-bold">
                {{ expense.title }}
              </h2>
              <p class="text-sm text-neutral-500">{{ formatCentsToEuro(expense.amount ?? 0) }}</p>
            </div>
            <p v-if="expense.description" class="text-sm mb-1 text-neutral-600">
              {{ expense.description }}
            </p>
            <button
              @click="toggleCategoryFilter(expense.category)"
              class="inline-flex self-start px-1.5 py-0.5 rounded text-xs"
              :class="
                expense.category === filteredCategory
                  ? 'bg-sky-200 hover:bg-sky-300 text-sky-800 inline-flex gap-0.5 items-center'
                  : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
              "
            >
              <IconFilterCheck size="14" v-if="expense.category === filteredCategory" />
              {{ expense.category }}
            </button>
            <button
              @click="removeExpense(expense.id)"
              class="border-l border-t bg-white shadow-inner border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors hover:text-neutral-800 p-1 absolute rounded-br-md rounded-tl-md right-0 bottom-0 flex gap-2"
              aria-label="Remove expense"
            >
              <IconTrashXFilled size="16" />
            </button>
          </div>
        </li>
      </ol>
    </div>
  </main>
</template>
