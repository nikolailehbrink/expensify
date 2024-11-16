<script setup lang="ts">
import Button from '@/components/Button.vue'
import InputGroup from '@/components/InputGroup.vue'
import Input from '@/components/Input.vue'
import Label from '@/components/Label.vue'
import { formatCentsToEuro, formatDate } from '@/lib/utils'
import { computed, ref } from 'vue'
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
const expenses = ref([
  {
    id: 1,
    title: 'Restaurantbesuch',
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
    date: new Date(),
  },
  { id: 4, title: 'Tanken', amount: 1000, category: CATEGORIES.TRANSPORT, date: new Date() },
  {
    id: 5,
    title: 'Netflix',
    amount: 999,
    category: CATEGORIES.ENTERTAINMENT,
    date: new Date(),
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

const form = ref({
  title: '',
  amount: 0,
  category: '',
})

const filteredCategory = ref<null | string>(null)
const filteredExpenses = computed(() =>
  filteredCategory.value !== null
    ? expenses.value.filter((expense) => expense.category === filteredCategory.value)
    : expenses.value,
)
const totalAmount = computed(() =>
  filteredExpenses.value.reduce((expense, total) => expense + total.amount, 0),
)
function toggleCategoryFilter(category: string) {
  filteredCategory.value = filteredCategory.value ? null : category
}
function removeExpense(id: number) {
  expenses.value = expenses.value.filter((expense) => expense.id !== id)
}
function addExpense() {
  return expenses.value.push({
    id: expenses.value[expenses.value.length - 1].id + 1,
    title: form.value.title,
    amount: form.value.amount,
    category: form.value.category,
    date: new Date(),
  })
}
</script>

<template>
  <main class="container mx-auto flex gap-4 items-center">
    <form @submit.prevent="addExpense" class="space-y-2 w-1/2">
      <InputGroup>
        <Label :for="form.title">Title</Label>
        <Input type="text" v-model="form.title" placeholder="Supermarkt" />
      </InputGroup>
      <InputGroup>
        <Label :for="form.amount"
          >Amount <span class="text-xs text-neutral-600 font-normal">(in cents)</span></Label
        >
        <Input type="number" v-model="form.amount" />
      </InputGroup>
      <InputGroup>
        <Label :for="form.category">Category</Label>
        <select
          required
          v-model="form.category"
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

    <div class="flex flex-col gap-2 grow">
      <p>
        Total amount:
        <span class="font-bold">
          {{ formatCentsToEuro(totalAmount) }}
        </span>
      </p>
      <div
        :key="expense.id"
        v-for="expense in filteredExpenses"
        class="flex flex-col gap-1 relative border-2 border-neutral-200 px-3 py-2 rounded-lg"
      >
        <div class="flex justify-between gap-4 items-center">
          <h2 class="font-bold">
            {{ expense.title }}
          </h2>
          <p class="text-sm text-neutral-600">{{ formatCentsToEuro(expense.amount) }}</p>
        </div>
        <button
          @click="toggleCategoryFilter(expense.category)"
          class="inline-flex self-start px-1.5 py-0.5 bg-neutral-200 rounded text-xs"
          :class="{
            'bg-green-500': expense.category === filteredCategory,
          }"
        >
          {{ expense.category }}
        </button>
        <p class="text-xs text-neutral-700">{{ formatDate(expense.date) }}</p>
        <button
          @click="removeExpense(expense.id)"
          class="bg-neutral-200 text-neutral-600 hover:text-neutral-900 p-1 absolute rounded-br rounded-tl -bottom-px -right-px flex gap-2"
          aria-label="Remove expense"
        >
          <IconTrashXFilled size="20" />
        </button>
      </div>
    </div>
  </main>
</template>
