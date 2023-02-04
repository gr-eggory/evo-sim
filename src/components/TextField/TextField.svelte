<script lang="ts">
	type T = $$Generic<'text' | 'number'>;
	export let type: T;
	export let value: T extends 'text' ? string : number;
	export let label: string;
	export let id: string;

	export let step = '0.001';
</script>

<div>
	{#if type === 'number'}
		<label for={id}>{label}</label>
		<input bind:value type="number" {id} {step} />
	{:else}
		<label for={id}>{label}</label>
		<input bind:value type="string" {id} />
	{/if}
</div>

<style>
	label {
		margin-bottom: 0.3rem;
        display: block;
	}
	input {
		height: 2rem;
		border: 1px solid black;
		border-radius: 3px;
		background-color: #fafafa;
        width: 80%;
        padding: 0rem .5rem;
        font-size: clamp(.9rem, 1.5vw, 1.1rem);
	}
</style>
