<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
    <NavBar />
    <div class="px-6 py-10 max-w-6xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-purple-700 text-center mb-6">Post Unlocks Over Time</h1>

      <div class="flex justify-center mb-6">
        <select
          v-model="selectedInterval"
          @input="loadAndRender"
          class="bg-white hover:bg-gray-100 text-purple-700 font-semibold px-4 py-2 rounded-full shadow transition"
        >
          <option value="year">Yearly</option>
          <option value="month">Monthly</option>
          <option value="week">Weekly</option>
          <option value="day">Daily</option>
        </select>
      </div>
      <div class="text-gray-800 dark:text-black">
        <div ref="chartContainer" class="bg-white rounded-3xl shadow p-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { supabase } from '../lib/supabaseClient'
import NavBar from '@/components/NavBar.vue'

const chartContainer = ref<HTMLDivElement | null>(null)
const selectedInterval = ref('month')

onMounted(() => {
  loadAndRender()
})

async function loadAndRender() {
  const { data, error } = await supabase.from('CapsuleData').select('Unlock')
  if (error) {
    return
  }

  // interval formats
  const formatters = {
    day: d3.timeFormat('%Y-%m-%d'),
    week: d3.timeFormat('%Y-W%U'),
    month: d3.timeFormat('%Y-%m'),
    year: d3.timeFormat('%Y'),
  }

  const parsers = {
    day: d3.timeParse('%Y-%m-%d'),
    week: d3.timeParse('%Y-W%U'),
    month: d3.timeParse('%Y-%m'),
    year: d3.timeParse('%Y'),
  }

  const formatLabel = formatters[selectedInterval.value]
  const parseLabel = parsers[selectedInterval.value]

  const counts: Record<string, number> = {}
  for (let i = 0; i < data.length; i++) {
    let date = new Date(data[i].Unlock)
    let year = date.getFullYear()
    if (year > 9999) {
      year = 9999
      date.setFullYear(year)
    }
    const key = formatLabel(date) //converts date into key
    counts[key] = (counts[key] || 0) + 1 //adds to count for the specific date
  }

  const allData = Object.entries(counts).map(([key, count]) => ({
    //.entries w/ .map converts into "entries" in the array
    date: parseLabel(key)!,
    count,
  }))

  allData.sort((a, b) => a.date.getTime() - b.date.getTime())

  renderChart(allData)
}

function renderChart(data: { date: Date; count: number }[]) {
  const width = 1000
  const height = 500
  const marginTop = 20
  const marginRight = 10
  const marginBottom = 20
  const marginLeft = 30

  const xLabelFormatters = {
    day: d3.timeFormat('%b %d'),
    week: d3.timeFormat('%Y W%U'),
    month: d3.timeFormat('%b %Y'),
    year: d3.timeFormat('%Y'),
  }

  const formatXAxisLabel = xLabelFormatters[selectedInterval.value] || xLabelFormatters.month

  const x = d3
    .scaleBand()
    .domain(data.map((d) => formatXAxisLabel(d.date)))
    .range([marginLeft, width - marginRight])
    .padding(0.1)

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)!])
    .nice()
    .range([height - marginBottom, marginTop])

  const svg = d3
    .create('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; color: currentColor;')

  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call((g) => g.selectAll('text').attr('fill', 'currentColor').attr('font-size', 11))
    .call((g) => g.selectAll('line').attr('stroke', 'currentColor'))

  svg
    .append('g')
    .attr('fill', '#7e2fff')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(formatXAxisLabel(d.date))!)
    .attr('y', (d) => y(d.count))
    .attr('height', (d) => y(0) - y(d.count))
    .attr('width', x.bandwidth())
    .attr('rx', 4)

  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.selectAll('text').attr('fill', 'currentColor').attr('font-size', 11))
    .call((g) => g.selectAll('line').attr('stroke', 'currentColor'))
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .append('text')
        .attr('x', -marginLeft + 10)
        .attr('y', marginTop - 10)
        .attr('fill', 'currentColor')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text('Y-Axis: Post Unlock Count'),
    )

  if (chartContainer.value) {
    chartContainer.value.innerHTML = ''
    chartContainer.value.appendChild(svg.node()!)
  }
}
</script>
