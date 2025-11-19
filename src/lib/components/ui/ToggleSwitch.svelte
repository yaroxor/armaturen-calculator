<script lang="ts">
	type ToggleChangeDetail = {
		checked: boolean;
	};

	export let checked = false;
	export let label = '';
	export let disabled = false;
	export let onChange: (detail: ToggleChangeDetail) => void = () => {};

	const toggle = () => {
		if (disabled) return;
		checked = !checked;
		onChange?.({ checked });
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			toggle();
		}
	};

	$: ariaLabel = label ? `${label}: ${checked ? 'включено' : 'выключено'}` : undefined;
</script>

<button
	type="button"
	class="toggle"
	class:checked
	{disabled}
	role="switch"
	aria-checked={checked}
	aria-label={ariaLabel}
	on:click={toggle}
	on:keydown={handleKeyDown}
>
	<span class="track" aria-hidden="true"></span>
	<span class="thumb" aria-hidden="true"></span>
</button>

<style>
	.toggle {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		font: inherit;
		color: inherit;
	}

	.toggle:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	.track {
		width: 46px;
		height: 22px;
		border-radius: 999px;
		background: #d7dce5;
		border: 1.5px solid #b0b7c6;
		transition:
			background 0.2s ease,
			border-color 0.2s ease;
	}

	.thumb {
		position: absolute;
		left: 4px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #fff;
		border: 1.5px solid #b0b7c6;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;
	}

	.toggle.checked .track {
		background: #d7f5df;
		border-color: #20a13a;
	}

	.toggle.checked .thumb {
		transform: translateX(22px);
		border-color: #146425;
	}

	.toggle:focus-visible .track {
		outline: 2px solid #3d78d7;
		outline-offset: 2px;
	}
</style>
