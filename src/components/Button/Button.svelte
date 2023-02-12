<script lang="ts">
	export let content: string;

	export let type: string = 'button';
	export let disabled = false;
</script>

{#if type === 'submit'}
	<button on:click {disabled} type="submit">{content}</button>
{:else}
	<button on:click {disabled}>{content}</button>
{/if}

<style>
	button {
        cursor: pointer;
		background-color: #F4F4F4;
		border: 1px solid black;
		border-radius: 3px;
		font-family: inherit;
		padding: .15rem .4rem;
	}

	button:hover {
		background-color: #e2e2e2;
	}
</style>
