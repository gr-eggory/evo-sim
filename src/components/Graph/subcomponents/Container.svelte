<script lang="ts">
	import type { Margin } from '../../../types/layout';

	export let width: number;
	export let height: number;
	export let margin: Margin;
</script>

<div class="graph-container">
	<svg {width} {height}>
		<g transform={`translate(${margin.left},${margin.top})`}>
			<slot />
		</g>
	</svg>
</div>

<style>
	.graph-container {
		background-color: #efecea;
		flex: 0 0 800px;
		height: 500px;
	}
</style>
