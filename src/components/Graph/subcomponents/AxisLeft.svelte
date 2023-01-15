<script lang="ts">
	import type { ScaleLinear } from 'd3';

	export let yAxisLabelOffset: number;
	export let yAxisLabel: string;
	export let yScale: ScaleLinear<number, number, never>;
    export let innerHeight: number;
    export let innerWidth: number;
</script>

<text
	class="axis-label"
	style="text-anchor: middle"
	transform={`translate(${-yAxisLabelOffset},${innerHeight / 2}) rotate(-90)`}
>
	{yAxisLabel}
</text>
{#each yScale.ticks() as tickValue (tickValue)}
	<g class="tick" transform={`translate(0,${yScale(tickValue)})`}>
		<line x2={innerWidth} />
		<text x={-3} dy=".32em">
			{tickValue}
		</text>
	</g>
{/each}

<style>
    
	.tick line {
		stroke: #c0c0bb;
	}

	.tick text {
		fill: #635f5d;
        text-anchor: end;
	}
</style>