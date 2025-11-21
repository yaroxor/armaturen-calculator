<script lang="ts">
	import { tick } from 'svelte';
	import { calculate } from '$lib/calculators/schema-01';
	import PumpInput from '$lib/components/PumpInput.svelte';
	import Schema01Diagram from '$lib/components/diagrams/Schema01Diagram.svelte';
	import type { CalculatorInputs, CalculatorResults } from '$lib/calculators/types';

	// Form state
	let pump1Flow = 10;
	let pump1Head = 12;
	let pump1Velocity = 2;

	let pump2Flow = 20;
	let pump2Head = 24;
	let pump2Velocity = 4;

	let manifoldVelocity = 1.5;

	// Results state
	let results: CalculatorResults | null = null;
	let highlightedElement: string | null = null;

	async function handleSubmit() {
		const inputs: CalculatorInputs = {
			pump1: {
				flow_m3_per_h: pump1Flow,
				head_m: pump1Head,
				velocity_m_s: pump1Velocity
			},
			pump2: {
				flow_m3_per_h: pump2Flow,
				head_m: pump2Head,
				velocity_m_s: pump2Velocity
			},
			manifold_velocity_m_s: manifoldVelocity
		};

		results = calculate(inputs);

		await tick();

		const el = document.getElementById('results-start');
		if (!el) {
			console.warn('Results element not found for scrolling');
			return;
		}

		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function handleReset() {
		pump1Flow = 0;
		pump1Head = 0;
		pump1Velocity = 0;
		pump2Flow = 0;
		pump2Head = 0;
		pump2Velocity = 0;
		manifoldVelocity = 0;
		results = null;
		highlightedElement = null;
	}

	function handleElementClick(elementId: string) {
		highlightedElement = elementId;

		const el = document.getElementById(elementId);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}

		setTimeout(() => {
			highlightedElement = null;
		}, 2000);
	}
</script>

<div class="page-layout">
	<!-- LEFT COLUMN: Calculator and Results (1/3 width) -->
	<div class="calculator-column">
		<div class="container">
			<h1>Калькулятор насосов</h1>

			<form on:submit|preventDefault={handleSubmit} on:reset={handleReset} autocomplete="off">
				<PumpInput
					label="Насос 1"
					bind:flow={pump1Flow}
					bind:head={pump1Head}
					bind:velocity={pump1Velocity}
				/>

				<PumpInput
					label="Насос 2"
					bind:flow={pump2Flow}
					bind:head={pump2Head}
					bind:velocity={pump2Velocity}
				/>

				<fieldset>
					<legend>Гребенка</legend>
					<div class="form-group">
						<label for="manifoldVelocity">
							2V скорость потока в гребёнке <small>(м/с)</small>
						</label>
						<input
							type="number"
							id="manifoldVelocity"
							bind:value={manifoldVelocity}
							required
							min="0"
							step="any"
							inputmode="decimal"
						/>
					</div>
				</fieldset>

				<div class="form-actions">
					<button type="submit">Рассчитать</button>
					<button type="reset">Очистить</button>
				</div>
			</form>

			{#if results}
				<section class="results" aria-live="polite">
					<h2 id="results-start" class="title-w-caption">Обратные клапаны</h2>
					<h3>минимальный размер</h3>

					<div
						class="results-block"
						id="check_valve_k1"
						class:highlighted={highlightedElement === 'check_valve_k1'}
						on:click={() => handleElementClick('check_valve_k1')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('check_valve_k1')}
						role="button"
						tabindex="0"
					>
						<h3>VAG AW</h3>
						<h4>обозначение на на схеме — К1</h4>
						<p>Диаметр: {results.check_valve_k1.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.check_valve_k1.pressure_m)} атм</p>
					</div>

					<div
						class="results-block"
						id="check_valve_k2"
						class:highlighted={highlightedElement === 'check_valve_k2'}
						on:click={() => handleElementClick('check_valve_k2')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('check_valve_k2')}
						role="button"
						tabindex="0"
					>
						<h3 class="name-w-caption">VAG AW</h3>
						<h4>обозначение на на схеме — К2</h4>
						<p>Диаметр: {results.check_valve_k2.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.check_valve_k2.pressure_m)} атм</p>
					</div>

					<h2>Шиберные ножевые задвижки</h2>
					<h3>минимальный размер</h3>

					<div
						class="results-block"
						id="gate_valve_z1"
						class:highlighted={highlightedElement === 'gate_valve_z1'}
						on:click={() => handleElementClick('gate_valve_z1')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('gate_valve_z1')}
						role="button"
						tabindex="0"
					>
						<h3>VAG ZETA</h3>
						<h4>обозначение на на схеме — З1</h4>
						<p>Диаметр: {results.gate_valve_z1.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.gate_valve_z1.pressure_m)} атм</p>
					</div>

					<div
						class="results-block"
						id="gate_valve_z2"
						class:highlighted={highlightedElement === 'gate_valve_z2'}
						on:click={() => handleElementClick('gate_valve_z2')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('gate_valve_z2')}
						role="button"
						tabindex="0"
					>
						<h3>VAG ZETA</h3>
						<h4>обозначение на на схеме — З2</h4>
						<p>Диаметр: {results.gate_valve_z2.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.gate_valve_z2.pressure_m)} атм</p>
					</div>

					<div
						class="results-block"
						id="gate_valve_z3"
						class:highlighted={highlightedElement === 'gate_valve_z3'}
						on:click={() => handleElementClick('gate_valve_z3')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('gate_valve_z3')}
						role="button"
						tabindex="0"
					>
						<h3>VAG ZETA</h3>
						<h4>обозначение на на схеме — З3</h4>
						<p>Диаметр: {results.gate_valve_z3.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.gate_valve_z3.pressure_m)} атм</p>
					</div>

					<div
						class="results-block"
						id="gate_valve_z4"
						class:highlighted={highlightedElement === 'gate_valve_z4'}
						on:click={() => handleElementClick('gate_valve_z4')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('gate_valve_z4')}
						role="button"
						tabindex="0"
					>
						<h3>VAG ZETA</h3>
						<h4>обозначение на на схеме — З4</h4>
						<p>Диаметр: {results.gate_valve_z4.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.gate_valve_z4.pressure_m)} атм</p>
					</div>

					<div
						class="results-block"
						id="gate_valve_z5"
						class:highlighted={highlightedElement === 'gate_valve_z5'}
						on:click={() => handleElementClick('gate_valve_z5')}
						on:keypress={(e) => e.key === 'Enter' && handleElementClick('gate_valve_z5')}
						role="button"
						tabindex="0"
					>
						<h3>VAG ZETA</h3>
						<h4>обозначение на на схеме — З5</h4>
						<p>Диаметр: {results.gate_valve_z5.diameter_mm} мм</p>
						<p>Давление: {Math.ceil(results.gate_valve_z5.pressure_m)} атм</p>
					</div>

					<h2>Минимальное расстояние</h2>

					<div class="results-block">
						<h3>L1</h3>
						<p>Расстояние: {Math.ceil(results.length1)} мм</p>
					</div>

					<div class="results-block">
						<h3>L2</h3>
						<p>Расстояние: {Math.ceil(results.length2)} мм</p>
					</div>

					<div class="results-block">
						<h3>L3</h3>
						<p>Расстояние: {Math.ceil(results.length3)} мм</p>
					</div>
				</section>
			{/if}
		</div>
	</div>

	<div class="diagram-column">
		<div class="diagram-sticky">
			<Schema01Diagram {results} {highlightedElement} onElementClick={handleElementClick} />
		</div>
	</div>
</div>

<style>
	:root {
		--space-xxs: 0.25rem;
		--space-xs: 0.5rem;
		--space-sm: 0.75rem;
		--space-md: 1rem;
		--space-lg: 1.5rem;

		/* tuning knobs:
       - Increase --space-lg to add more room between caption (h3) and blocks
       - Increase --space-sm or --gap-block to increase gap between h4 and p
    */
		--gap-block: var(--space-sm);
	}

	/* Main layout: split screen */
	.page-layout {
		display: flex;
		min-height: 100vh;
	}

	.calculator-column {
		flex: 0 0 33.333%;
		overflow-y: auto;
		max-height: 100vh;
	}

	.diagram-column {
		flex: 0 0 66.667%;
		border-left: 2px solid #ddd;
		overflow: hidden;
	}

	/* Sticky container for diagram */
	.diagram-sticky {
		top: 0;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: stretch;
		padding: 1rem;
	}

	.container {
		width: 90%;
		max-width: none;
		padding: 1.5rem;
		font-family:
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial,
			sans-serif;
	}

	h1 {
		color: #333;
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
	}

	h2 {
		color: #555;
		margin-top: 1.5rem;
		margin-bottom: var(--space-sm);
		font-size: 1.2rem;
	}

	h2.title-w-caption {
		margin-bottom: 0.5rem;
	}

	h3 {
		color: #666;
		font-size: 1rem;
		margin: 0 0 var(--space-sm) 0;
	}

	h3.name-w-caption {
		margin-bottom: var(--space-xs);
	}

	/* Explanatory note style for h4 */
	h4 {
		font-style: italic;
		font-weight: 400;
		font-size: 1rem;
		line-height: 1.35;
		color: #555;
		font-family:
			system-ui,
			-apple-system,
			'Segoe UI',
			Roboto,
			'Helvetica Neue',
			Arial,
			serif;
		font-synthesis: none;
		-webkit-font-smoothing: antialiased;
		margin: 0; /* spacing inside block controlled by gap */
	}

	.results {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 2px solid #ddd;
	}

	.results > h3 {
		margin-bottom: var(--space-lg);
	}

	/* Single consolidated results-block definition:
     - uses flex + gap to control spacing between h3/h4/p
     - overflow:auto creates a BFC and avoids margin collapse
  */
	.results-block {
		display: flex;
		flex-direction: column;
		gap: var(--gap-block); /* controls spacing between h3 / h4 / p */
		overflow: auto; /* prevents margin-collapsing issues */
		background-color: #f9f9f9;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	/* Reset margins inside blocks so gap is authoritative */
	.results-block h3,
	.results-block h4,
	.results-block p {
		margin: 0;
	}

	/* If you want an explicit extra gap between the h4 caption and the values,
     increase --gap-block or add a specific rule below. Prefer adjusting --gap-block. */
	/* .results-block h4 { margin-bottom: 0.75rem; }  <-- optional override */

	.results-block p {
		margin: 0.4rem 0; /* fine-grain spacing for lines within paragraphs */
		color: #555;
		font-size: 0.9rem;
	}

	.results-block:hover {
		background-color: #e8f4ff;
		border-color: #4a90e2;
		transform: translateX(4px);
		border: none;
	}

	.results-block.highlighted {
		background-color: #d4e9ff;
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
		animation: pulse 0.5s ease-in-out;
		border: none;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
	}

	/* Form and controls */
	fieldset {
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	legend {
		font-weight: 600;
		color: #444;
		padding: 0 0.5rem;
		font-size: 0.95rem;
	}

	.form-group {
		margin-bottom: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	label {
		font-weight: 500;
		color: #555;
		font-size: 0.9rem;
	}

	label small {
		color: #888;
		font-weight: 400;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 3px;
		font-size: 0.95rem;
	}

	input:focus {
		outline: none;
		border-color: #4a90e2;
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 1rem;
	}

	button {
		padding: 0.6rem 1.2rem;
		font-size: 0.95rem;
		border: none;
		border-radius: 3px;
		cursor: pointer;
		font-weight: 700;
		transition: all 0.2s;
	}

	button[type='submit'] {
		background-color: white;
		color: #20a13a;
		border: 2px solid #20a13a;
	}

	button[type='submit']:hover {
		background-color: #20a13a;
		color: white;
	}

	button[type='reset'] {
		background-color: #e0e0e0;
		color: #333;
	}

	button[type='reset']:hover {
		background-color: #d0d0d0;
	}

	/* Responsive: Stack on tablets/mobile */
	/* @media (max-width: 1024px) {
		.page-layout {
			flex-direction: column;
		}

		.calculator-column {
			flex: 1 1 auto;
			max-height: none;
			overflow-y: visible;
		}

		.diagram-column {
			flex: 1 1 auto;
			border-left: none;
			border-top: 2px solid #ddd;
		}

		.diagram-sticky {
			position: static;
			height: auto;
			min-height: 500px;
		}

		.container {
			padding: 1.5rem;
		}
	} */
</style>
