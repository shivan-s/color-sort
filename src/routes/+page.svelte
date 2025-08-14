<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let inactive = data.colors;
</script>

<div class="wrapper">
	<form method="POST" action="?/create">
		<div>
			<input value="" name="name" /><button>Submit</button>
		</div>
	</form>
	<span></span>
	<Container>
		<header>
			<h2>Inactive</h2>
			<ul>
				{#each inactive as m (m.id)}
					<li>{m.name}</li>
				{/each}
			</ul>
		</header>
	</Container>
	<Container><header><h2>Active</h2></header></Container>
</div>

<style>
	div.wrapper {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	form {
		& div {
			display: flex;
			gap: 0.5rem;
		}
	}

	ul {
		display: grid;
		gap: 0.25rem;
		& li {
			border: grey solid 1px;
			border-radius: 0.25rem;
			padding: 0.5rem;
		}
	}
</style>
