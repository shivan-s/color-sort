<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

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
			{#each inactive as c (c.id)}
				<li>
					{c.name}
					<div class="buttons">
						<form method="POST" action="?/activate">
							<input type="hidden" name="id" value={c.id} />
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
			{#each active as c, idx (c.id)}
				<li>
					{c.name}
					<div class="buttons">
						<form method="POST" action="?/promote">
							<input type="hidden" name="id" value={c.id} />
							<button disabled={idx === 0}>Promote</button>
						</form>
						<form method="POST" action="?/demote">
							<input type="hidden" name="id" value={c.id} />
							<button disabled={idx === active.length - 1}>Demote</button>
						</form>
						<form method="POST" action="?/deactivate">
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
			background-color: inherit;
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
		}
	}
</style>
