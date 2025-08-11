<script lang="ts">
	import { page } from '$app/state';
	import '$lib/assets/app.css';
	let { children } = $props();

	let pageTitle = page.data['pageTitle'] as string | undefined;
</script>

<svelte:head>
	<title>{pageTitle ?? 'Demo'}</title>
</svelte:head>

<header>
	{#if pageTitle}
		<h1>{pageTitle}</h1>
	{/if}
</header>
<main>
	{@render children?.()}
</main>

<style>
	header {
		padding-inline: var(--padding-sm);
	}
</style>
