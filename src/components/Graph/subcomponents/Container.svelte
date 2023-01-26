<script lang="ts">
	import type { Margin } from '../../../types/layout';

	export let margin: Margin;

	$: transform = `translate(${margin.left},${margin.top})`;
</script>

<div class="graph-container">
	<svg width="100%" height="100%">
		<g {transform}>
			<slot />
		</g>
	</svg>
</div>

<style>
	.graph-container {
		background-color: #efecea;
		width: 100%;
		height: 100%;
		border-radius: 4px;
	}
</style>
