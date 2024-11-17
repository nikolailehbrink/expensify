<script setup lang="ts">
import Button from '@/components/Button.vue'
import InputGroup from '@/components/InputGroup.vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'
import { formatCentsToEuro, formatDate } from '@/lib/utils'
import { computed, ref, nextTick } from 'vue'
import { IconTrashXFilled } from '@tabler/icons-vue'

const CATEGORIES = {
  FOOD: 'Food',
  RENT: 'Rent',
  INSURANCE: 'Insurance',
  TRANSPORT: 'Transport',
  ENTERTAINMENT: 'Entertainment',
  HEALTH: 'Health',
  EDUCATION: 'Education',
  MISCELLANEOUS: 'Miscellaneous',
}
const expenses = ref<
  {
    id: number
    title: string
    description?: string
    amount?: number
    category: string
    date: Date
  }[]
>([
  {
    id: 1,
    title: 'Restaurantbesuch',
    description: 'Im Arabiano im Viertel mit Ben und Karina.',
    amount: 8327,
    category: CATEGORIES.FOOD,
    date: new Date('1995-12-17'),
  },
  { id: 2, title: 'Kaution', amount: 210000, category: CATEGORIES.RENT, date: new Date() },
  {
    id: 3,
    title: 'VHV Allgemeine Versicherung',
    amount: 6532,
    category: CATEGORIES.INSURANCE,
    date: new Date('1997-02-24'),
  },
  { id: 4, title: 'Tanken', amount: 1000, category: CATEGORIES.TRANSPORT, date: new Date() },
  {
    id: 5,
    title: 'Netflix',
    amount: 999,
    category: CATEGORIES.ENTERTAINMENT,
    date: new Date('1993-07-06'),
  },
  { id: 6, title: 'Medikamente', amount: 5999, category: CATEGORIES.HEALTH, date: new Date() },
  {
    id: 7,
    title: 'Learn TypeScript - Buch',
    amount: 4399,
    category: CATEGORIES.EDUCATION,
    date: new Date(),
  },
  {
    id: 8,
    title: 'Splice-Abo',
    amount: 872,
    category: CATEGORIES.MISCELLANEOUS,
    date: new Date(),
  },
])

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

const expenseListRef = ref<HTMLElement | null>(null)

const filteredCategory = ref<null | string>(null)
const filteredExpenses = computed(() =>
  filteredCategory.value !== null
    ? expenses.value
        .filter((expense) => expense.category === filteredCategory.value)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
    : expenses.value.sort((a, b) => b.date.getTime() - a.date.getTime()),
)

const totalAmount = computed(() =>
  filteredExpenses.value.reduce((expense, total) => expense + (total.amount ?? 0), 0),
)

const totalExpenses = computed(() => filteredExpenses.value.length)

function toggleCategoryFilter(category: string) {
  filteredCategory.value = filteredCategory.value ? null : category
}

function datesAreOnSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

function removeExpense(id: number) {
  expenses.value = expenses.value.filter((expense) => expense.id !== id)
}

function addExpense() {
  expenses.value.push({
    id: expenses.value[expenses.value.length - 1].id + 1,
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
    expenseListRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  })
}
</script>

<template>
  <main class="container mx-auto flex gap-8 items-center py-8 h-dvh">
    <form @submit.prevent="addExpense" class="space-y-2 w-1/2">
      <h1 class="font-bold text-2xl">
        Expensify - <mark class="px-1 rounded py-0.5 bg-sky-300"> Simplify expense tracking.</mark>
      </h1>
      <p>
        Add a new expense to your list. <br />
        You can categorize your expenses to keep track of your spending.
      </p>
      <InputGroup>
        <Label required for="title">Title</Label>
        <Input required id="title" type="text" v-model="form.title" placeholder="Supermarkt" />
      </InputGroup>
      <InputGroup>
        <Label for="amount" required
          >Amount <span class="text-xs text-neutral-600 font-normal">(in cents)</span></Label
        >
        <Input required placeholder="5690" type="number" id="amount" v-model="form.amount" />
      </InputGroup>
      <InputGroup>
        <Label for="description">Description</Label>
        <textarea
          class="border-2 border-neutral-200 bg-neutral-50 p-2 text-sm rounded-md"
          placeholder="Brot, Milch, Käse, Eier"
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
          class="border-2 border-neutral-200 px-2 py-1 invalid:text-neutral-500 bg-neutral-50 text-sm block rounded-md"
        >
          <option disabled value="" class="text-neutral-500">Select a category</option>
          <option v-for="(value, key) in CATEGORIES" :key :value>
            {{ value }}
          </option>
        </select>
      </InputGroup>
      <Button>Add expense</Button>
    </form>

    <div class="flex flex-col gap-2 h-full grow w-1/2">
      <header>
        <p class="inline">
          Total amount:
          <span class="font-bold">
            {{ formatCentsToEuro(totalAmount) }}
          </span>
        </p>
        <p class="inline">
          from
          <span class="font-bold">
            {{ totalExpenses }}
          </span>
          {{ totalExpenses > 1 ? 'expenses' : 'expense' }}
        </p>
        <p v-if="filteredCategory" class="inline">
          in
          <span class="font-bold">{{ filteredCategory }}</span>
        </p>
      </header>

      <div ref="expenseListRef" class="h-full overflow-y-scroll flex flex-col gap-2 pr-4">
        <div :key="expense.id" v-for="(expense, index) in filteredExpenses" class="space-y-2">
          <div
            class="mx-0.5 mt-2 bg-white rounded-lg flex gap-2 z-10 justify-between items-center sticky top-0"
            v-if="
              index === 0 ||
              (index > 0 &&
                datesAreOnSameDay(expense.date, filteredExpenses[index - 1].date) === false)
            "
          >
            <hr class="h-0.5 w-full bg-neutral-200 -z-10" />
            <p class="text-xs text-neutral-700 z-10">
              {{ formatDate(expense.date) }}
            </p>
            <hr class="h-0.5 w-full -z-10 bg-neutral-200" />
          </div>
          <div
            class="flex flex-col gap-1 relative border-2 border-neutral-200 px-3 py-2 rounded-lg bg-white"
          >
            <div class="flex justify-between gap-4 items-center">
              <h2 class="font-bold">
                {{ expense.title }}
              </h2>
              <p class="text-sm text-neutral-600">{{ formatCentsToEuro(expense.amount ?? 0) }}</p>
            </div>
            <p v-if="expense.description" class="text-sm mb-1">
              {{ expense.description }}
            </p>
            <button
              @click="toggleCategoryFilter(expense.category)"
              class="inline-flex self-start px-1.5 py-0.5 rounded text-xs"
              :class="
                expense.category === filteredCategory
                  ? 'bg-green-200 hover:bg-green-300'
                  : 'bg-neutral-200 hover:bg-neutral-300'
              "
            >
              {{ expense.category }}
            </button>
            <button
              @click="removeExpense(expense.id)"
              class="bg-neutral-200 text-neutral-600 hover:bg-red-400 transition-colors hover:text-neutral-900 p-1 absolute rounded-br-lg rounded-tl-lg -bottom-0.5 -right-0.5 flex gap-2"
              aria-label="Remove expense"
            >
              <IconTrashXFilled size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
