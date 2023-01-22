<script lang="ts">
	import {
		scaleLinear,
		extent,
		line,
		curveNatural,
		max,
		groups,
		scaleOrdinal,
		schemeSet1,
	} from 'd3';

	import Container from './subcomponents/Container.svelte';
	import AxisBottom from './subcomponents/AxisBottom.svelte';
	import AxisLeft from './subcomponents/AxisLeft.svelte';
	import Line from './subcomponents/Line.svelte';
	import type { Margin } from '../../types/layout';

	export let width: number;
	export let height: number;
	export let margin: Margin;
	export let xAxisLabelOffset: number;
	export let yAxisLabelOffset: number;
	export let xAxisLabel: string;
	export let yAxisLabel: string;

	type T = $$Generic;
	export let data: T[];
	export let xValue: (d: T) => number;
	export let yValue: (d: T) => number;
	export let zValue: (d: T) => string;
	export let zDomain: string[];

	$: innerHeight = height - margin.top - margin.bottom;
	$: innerWidth = width - margin.left - margin.right;

	$: xScale = scaleLinear()
		.domain(extent(data, xValue))
		.range([0, innerWidth])
		.nice();
	$: yScale = scaleLinear()
		.domain([0, max(data, yValue)])
		.range([innerHeight, 0])
		.nice();

	$: colorScale = scaleOrdinal().domain(zDomain).range(schemeSet1) as (
		id: string
	) => string;

	$: linePathGenerator = line<T>()
		.x((d) => xScale(xValue(d)))
		.y((d) => yScale(yValue(d)))
		.curve(curveNatural);

	$: groupedData = groups(data, zValue);
</script>

<Container {width} {height} {margin}>
	<AxisBottom
		{xAxisLabelOffset}
		{xAxisLabel}
		{xScale}
		{innerWidth}
		{innerHeight}
	/>
	<AxisLeft
		{yAxisLabelOffset}
		{yAxisLabel}
		{yScale}
		{innerWidth}
		{innerHeight}
	/>
	{#each groupedData as [identifier, groupData] (identifier)}
		<Line
			linePath={linePathGenerator(groupData)}
			stroke={colorScale(identifier)}
		/>
	{/each}
</Container>
