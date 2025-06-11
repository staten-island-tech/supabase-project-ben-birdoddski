<template>
  <div ref="chartContainer" class="overflow-x-auto"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import { supabase } from '../lib/supabaseClient'

const chartContainer = ref<HTMLDivElement | null>(null)
// styling and rendering copy and pasted from d3 docs
onMounted(async () => {
  const { data, error } = await supabase.from('CapsuleData').select('Unlock')
  if (error) {
    return
  }
  const formatMonthKey = d3.timeFormat('%Y-%m') //formatting
  const parseMonthKey = d3.timeParse('%Y-%m') //turns into date object

  const counts: Record<string, number> = {}
  for (let i = 0; i < data.length; i++) {
    const dateKey = formatMonthKey(new Date(data[i].Unlock)) //converts date into key
    counts[dateKey] = (counts[dateKey] || 0) + 1 //adds to count for the specific date
  }

  const processedData = Object.entries(counts).map(([key, count]) => ({
    date: parseMonthKey(key)!,
    count,
  }))

  processedData.sort((a, b) => a.date.getTime() - b.date.getTime())

  renderChart(processedData) //renders chart
})

function renderChart(data: { date: Date; count: number }[]) {
  const width = 928
  const height = 500
  const marginTop = 30
  const marginRight = 0
  const marginBottom = 30
  const marginLeft = 40

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d3.timeFormat('%b %Y')(d.date)))
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
    .attr('style', 'max-width: 100%; height: auto;')

  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))

  svg
    .append('g')
    .attr('fill', 'steelblue')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(d3.timeFormat('%b %Y')(d.date))!)
    .attr('y', (d) => y(d.count))
    .attr('height', (d) => y(0) - y(d.count))
    .attr('width', x.bandwidth())

  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call((g) => g.select('.domain').remove())
    .call((g) =>
      g
        .append('text')
        .attr('x', -marginLeft)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text('↑ Unlocks'),
    )

  if (chartContainer.value) {
    chartContainer.value.innerHTML = ''
    chartContainer.value.appendChild(svg.node()!)
  }
}
</script>
