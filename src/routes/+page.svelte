<script lang="ts">
	import { enhance } from '$app/forms';
	import { crossfade } from 'svelte/transition';
	import Container from '$lib/components/Container.svelte';
	import type { PageProps } from './$types';
	import { sineInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	let { data }: PageProps = $props();

	const [send, receive] = crossfade({ easing: sineInOut });

	let loading = $state(false);
	let inactive = $derived.by(() => {
		const inactive = $state(
			data.colors
				.filter((c) => !c.active)
				.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0))
		);
		return inactive;
	});
	let active = $derived.by(() => {
		const active = $state(
			data.colors.filter((c) => c.active).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
		);
		return active;
	});
</script>

<div class="wrapper">
	<span aria-busy={loading}>Loading...</span>
	<span class="placeholer"></span>
	<Container>
		<header>
			<h2>Inactive</h2>
		</header>
		<ul>
			{#each inactive as m (m.id)}
				<li animate:flip in:receive out:send>
					{m.name}
					<div class="buttons">
						<form
							method="POST"
							action="?/activate"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
						>
							<input type="hidden" name="id" value={m.id} />
							<button>Activate</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</Container>
	<Container>
		<header>
			<h2>Active</h2>
		</header>
		<ul>
			{#each active as c, idx (idx)}
				<li animate:flip in:receive out:send>
					{c.name}
					<div class="buttons">
						<form
							method="POST"
							action="?/promote"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
						>
							<input type="hidden" name="id" value={c.id} />
							<button disabled={idx === 0}>Promote</button>
						</form>
						<form
							method="POST"
							action="?/demote"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
						>
							<input type="hidden" name="id" value={c.id} />
							<button disabled={idx === active.length - 1}>Demote</button>
						</form>
						<form
							method="POST"
							action="?/deactivate"
							use:enhance={() => {
								loading = true;
								return async ({ update }) => {
									await update();
									loading = false;
								};
							}}
						>
							<input type="hidden" name="id" value={c.id} />
							<button>Deactivate</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</Container>
</div>

<style>
	div.wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	ul {
		display: grid;
		gap: 0.25rem;
		& li {
			display: inline-grid;
			grid-template-columns: 1fr auto;
			gap: 0.125rem;
			align-items: center;
			border: grey solid 1px;
			border-radius: 0.25rem;
			padding: 0.5rem;
			div.buttons {
				display: grid;
				grid-template-columns: 1fr;
				gap: 0.125rem;
			}
		}
	}

	span {
		opacity: 0;
		visibility: hidden;
		transition-property: opacity visibility;
		transition-timing-function: ease-in-out;
		transition-duration: 0.2s;
		transition-behavior: allow-discrete;
		&[aria-busy='true'] {
			opacity: 1;
			visibility: visible;
			animation: pulse 1s infinite;
		}
	}

	@keyframes pulse {
		50% {
			opacity: 0.5;
		}
	}
</style>
