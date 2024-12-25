<script lang="ts">
	const handleStartReload = () => {
		console.log('RELOADING');
	};

	const handleKeyDown = (
		event: KeyboardEvent & {
			currentTarget: EventTarget & Document;
		}
	) => {
		if (event.key.toLowerCase() !== 'r') {
			return;
		}
		handleStartReload();
	};
</script>

<svelte:document on:touchstart={handleStartReload} on:keydown={handleKeyDown} />

<main>
	<div class="headers">
		<h1>Frostbite Reload</h1>
		<h3>Press R to reload</h3>
	</div>
	<div class="bar"></div>
</main>

<style>
	main {
		min-height: inherit;
		padding-top: 35vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5rem;
		text-align: center;
	}

	h1 {
		font-size: 5rem;
	}

	h3 {
		font-size: 3rem;
	}

	.bar {
		background-color: blue;
		width: min(50rem, 90%);
		height: 2rem;
	}
</style>
