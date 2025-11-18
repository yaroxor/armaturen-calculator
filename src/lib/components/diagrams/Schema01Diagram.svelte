<script lang="ts">
	import type { CalculatorResults } from '$lib/calculators/types';

	export let results: CalculatorResults | null = null;

	$: hasResults = results !== null;
	$: isPump1Active = results && results.pump1.flow_m3_per_s > 0;
	$: isPump2Active = results && results.pump2.flow_m3_per_s > 0;
	$: isManifoldActive = isPump1Active || isPump2Active;

	const pump1 = { x: 140, y: 200, width: 80, height: 100 };
	const pump2 = { x: 140, y: 500, width: 80, height: 100 };

	const k1 = { x: 310, y: 200, width: 40, height: 40 };
	const k2 = { x: 310, y: 500, width: 40, height: 40 };

	const z1 = { x: 450, y: 200, width: 40, height: 40 };
	const z2 = { x: 450, y: 500, width: 40, height: 40 };

	// Vertical collector line
	const collector = { x: 580, yTop: 10, yBottom: 580 };

	const z3 = { x: collector.x, y: 120, width: 40, height: 40 };
	const z4 = { x: collector.x, y: 350, width: 40, height: 40 };
	const z5 = { x: collector.x, y: 570, width: 40, height: 40 };

	const manifold = { x: 565, y: 350, width: 90, height: 600 };

	const manifoldPipeStart = 645;
	const valveWidth = 40;
	const valveHeight = 40;

	const output = { x: 850 };
</script>

<div class="diagram-wrapper">
	<h3>Схема установки</h3>
	{#if !hasResults}
		<p class="instruction-text">Заполните форму и нажмите "Рассчитать"</p>
	{/if}

	<svg viewBox="0 0 1000 700" class="schema">
		<!-- Background -->
		<rect width="1000" height="700" fill="#f8f9fa" />

		<!-- Title -->
		<!-- <text x="500" y="30" text-anchor="middle" class="title">
			Двухнасосная система с гребенкой
		</text> -->

		<!-- PUMP 1 -->
		<g class="pump" class:active={isPump1Active}>
			<!-- Pump body -->
			<rect x={pump1.x - pump1.width / 2} y={pump1.y - pump1.height / 2} width={pump1.width} height={pump1.height} rx="10" class="pump-body" />
			<circle cx={pump1.x} cy={pump1.y} r={(pump1.width / 2) * 0.9} class="pump-impeller" />

			<!-- Pump label -->
			<text x={pump1.x} y={pump1.y + 5} text-anchor="middle" class="pump-label">Н1</text>
			<text x={pump1.x} y={pump1.y + 80} text-anchor="middle" class="component-info">
				{#if results}
					{results.pump1.flow_m3_per_h.toFixed(0)} м³/ч
				{/if}
			</text>
		</g>

		<!-- PUMP 2 -->
		<g class="pump" class:active={isPump2Active}>
			<!-- Pump body -->
			<rect x={pump2.x - pump2.width / 2} y={pump2.y - pump2.height / 2} width={pump2.width} height={pump2.height} rx="10" class="pump-body" />
			<circle cx={pump2.x} cy={pump2.y} r={(pump2.width / 2) * 0.9} class="pump-impeller" />

			<!-- Pump label -->
			<text x={pump2.x} y={pump2.y + 5} text-anchor="middle" class="pump-label">Н2</text>
			<text x={pump2.x} y={pump2.y + 80} text-anchor="middle" class="component-info">
				{#if results}
					{results.pump2.flow_m3_per_h.toFixed(0)} м³/ч
				{/if}
			</text>
		</g>

		<!-- PIPE FROM PUMP 1 -->
		<line
			x1={pump1.x + pump1.width / 2}
			y1={pump1.y}
			x2={k1.x - k1.width / 2}
			y2={pump1.y}
			class="pipe"
			class:active={isPump1Active}
		/>

		<!-- PIPE FROM PUMP 2 -->
		<line
			x1={pump2.x + pump2.width / 2}
			y1={pump2.y}
			x2={k2.x - k2.width / 2}
			y2={pump2.y}
			class="pipe"
			class:active={isPump2Active}
		/>

		<!-- CHECK VALVE K1 -->
		<g class="valve check-valve" class:active={isPump1Active}>
			<rect
				x={k1.x - k1.width / 2}
				y={k1.y - k1.height / 2}
				width={k1.width}
				height={k1.height}
				rx="5"
				class="valve-body"
			/>
			<path
				d={`M ${k1.x - 10} ${k1.y} L ${k1.x + 10} ${k1.y - 10} L ${k1.x + 10} ${k1.y + 10} Z`}
				fill="#fff"
			/>
			<text x={k1.x} y={k1.y + 35} text-anchor="middle" class="valve-label">К1</text>
			{#if results}
				<text x={k1.x} y={k1.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.check_valve_k1.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- CHECK VALVE K2 -->
		<g class="valve check-valve" class:active={isPump2Active}>
			<rect x={k2.x - k2.width / 2} y={k2.y - k2.height / 2} width={k2.width} height={k2.height} rx="5" class="valve-body" />
			<path
				d={`M ${k2.x - 10} ${k2.y} L ${k2.x + 10} ${k2.y - 10} L ${k2.x + 10} ${k2.y + 10} Z`}
				fill="#fff"
			/>
			<text x={k2.x} y={k2.y + 35} text-anchor="middle" class="valve-label">К2</text>
			{#if results}
				<text x={k2.x} y={k2.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.check_valve_k2.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE AFTER K1 -->
		<line
			x1={k1.x + k1.width / 2}
			y1={k1.y}
			x2={z1.x - z1.width / 2}
			y2={z1.y}
			class="pipe"
			class:active={isPump1Active}
		/>

		<!-- PIPE AFTER K2 -->
		<line
			x1={k2.x + k2.width / 2}
			y1={k2.y}
			x2={z2.x - z2.width / 2}
			y2={z2.y}
			class="pipe"
			class:active={isPump2Active}
		/>

		<!-- GATE VALVE Z1 -->
		<g class="valve gate-valve" class:active={isPump1Active}>
			<rect x={z1.x - z1.width / 2} y={z1.y - z1.height / 2} width={z1.width} height={z1.height} rx="5" class="valve-body" />
			<rect x={z1.x - 5} y={z1.y - 15} width="10" height="30" fill="#fff" />
			<text x={z1.x} y={z1.y + 35} text-anchor="middle" class="valve-label">З1</text>
			{#if results}
				<text x={z1.x} y={z1.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z1.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- GATE VALVE Z2 -->
		<g class="valve gate-valve" class:active={isPump2Active}>
			<rect x={z2.x - z2.width / 2} y={z2.y - z2.height / 2} width={z2.width} height={z2.height} rx="5" class="valve-body" />
			<rect x={z2.x - 5} y={z2.y - 15} width="10" height="30" fill="#fff" />
			<text x={z2.x} y={z2.y + 35} text-anchor="middle" class="valve-label">З2</text>
			{#if results}
				<text x={z2.x} y={z2.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z2.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- MANIFOLD (ГРЕБЕНКА) -->
		<g class="manifold" class:active={isManifoldActive}>
			<rect
				x={manifold.x - manifold.width / 2}
				y={manifold.y - manifold.height / 2}
				width={manifold.width}
				height={manifold.height}
				rx="8"
				class="manifold-body"
			/>
			<text
				x={manifold.x}
				y={manifold.y - manifold.height / 2 + 20}
				text-anchor="middle"
				class="manifold-label">Гребенка</text
			>
		</g>

		<!-- PIPE TO COLLECTOR FROM LINE 1 -->
		<line
			x1={z1.x + z1.width / 2}
			y1={z1.y}
			x2={collector.x}
			y2={z1.y}
			class="pipe"
			class:active={isPump1Active}
		/>

		<!-- PIPE TO COLLECTOR FROM LINE 2 -->
		<line
			x1={z2.x + z2.width / 2}
			y1={z2.y}
			x2={collector.x}
			y2={z2.y}
			class="pipe"
			class:active={isPump2Active}
		/>

		<!-- VERTICAL COLLECTOR LINE -->
		<line
			x1={collector.x}
			y1={z3.y}
			x2={collector.x}
			y2={z5.y}
			class="pipe collector-pipe"
			class:active={isManifoldActive}
			stroke-width="6"
		/>

		<!-- GATE VALVE Z3 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect
				x={z3.x - z3.width / 2}
				y={z3.y - z3.height / 2}
				width={valveWidth}
				height={valveHeight}
				rx="5"
				class="valve-body"
			/>
			<rect x={z3.x - 5} y={z3.y - 15} width="10" height="30" fill="#fff" />
			<text x={z3.x - 35} y={z3.y + 5} text-anchor="middle" class="valve-label">З3</text>
			{#if results}
				<text x={z3.x - 35} y={z3.y + 20} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z3.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- GATE VALVE З4 (on collector, between pump lines) -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect
				x={z4.x - z4.width / 2}
				y={z4.y - z4.height / 2}
				width={valveWidth}
				height={valveHeight}
				rx="5"
				class="valve-body"
			/>
			<rect x={z4.x - 5} y={z4.y - 15} width="10" height="30" fill="#fff" />
			<text x={z4.x - 35} y={z4.y + 5} text-anchor="middle" class="valve-label">З4</text>
			{#if results}
				<text x={z4.x - 35} y={z4.y + 20} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z4.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- GATE VALVE Z5 (at bottom of collector) -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect
				x={z5.x - z5.width / 2}
				y={z5.y - z5.height / 2}
				width={valveWidth}
				height={valveHeight}
				rx="5"
				class="valve-body"
			/>
			<rect x={z5.x - 5} y={z5.y - 15} width="10" height="30" fill="#fff" />
			<text x={z5.x - 35} y={z5.y + 5} text-anchor="middle" class="valve-label">З5</text>
			{#if results}
				<text x={z5.x - 35} y={z5.y + 20} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z5.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- OUTPUTS -->
		<!-- OUTPUT PIPE FROM Z5 -->
		<line
			x1={z5.x + z5.width / 2}
			y1={z5.y}
			x2={output.x - 50}
			y2={z5.y}
			class="pipe output-pipe"
			class:active={isManifoldActive}
		/>
		<polygon
			points={`${output.x - 55},${z5.y - 5} ${output.x - 45},${z5.y} ${output.x - 55},${z5.y + 5}`}
			class="flow-arrow"
			class:active={isManifoldActive}
		/>
		<text x={output.x} y={z5.y + 5} text-anchor="middle" class="output-label">Выход</text>
		<!-- OUTPUT PIPE FROM Z3 -->
		<line
			x1={z3.x + z3.width / 2}
			y1={z3.y}
			x2={output.x - 50}
			y2={z3.y}
			class="pipe output-pipe"
			class:active={isManifoldActive}
		/>
		<polygon
			points={`${output.x - 55},${z3.y - 5} ${output.x - 45},${z3.y} ${output.x - 55},${z3.y + 5}`}
			class="flow-arrow"
			class:active={isManifoldActive}
		/>
		<text x={output.x} y={z3.y + 5} text-anchor="middle" class="output-label">Выход</text>

		<!-- Legend -->
		<g class="legend">
			<text x="50" y="700" class="legend-title">Обозначения:</text>
			<text x="50" y="730" class="legend-text">Н - Насос</text>
			<text x="200" y="730" class="legend-text">К - Обратный клапан</text>
			<text x="400" y="730" class="legend-text">З - Задвижка</text>
			<text x="600" y="730" class="legend-text">⌀ - Диаметр (мм)</text>
		</g>
	</svg>
</div>

<style>
	.diagram-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		--color-bg: #f8f9fa;
		--color-border: #ddd;
		--color-gray-light: #ccc;
		--color-gray: #999;
		--color-gray-dark: #666;
		--color-accent: #4a90e2;
		--color-component: #20a13a;
		--color-accent-dark: #1a8030;
		--transition: all 0.3s;
	}

	/* h3 {
		margin: 0 0 0.5rem 0;
		color: var(--color-gray-dark);
		font-size: 1.3rem;
	} */

	.instruction-text {
		margin: 0 0 1rem 0;
		color: var(--color-gray-dark);
		font-size: 1rem;
		font-style: italic;
	}

	.schema {
		width: 100%;
		height: 100%;
		flex: 1;
		border: 1px solid var(--color-border);
		border-radius: 4px;
	}

	.title {
		font-size: 20px;
		font-weight: 600;
		fill: var(--color-gray-dark);
	}

	.valve-label,
	.manifold-label,
	.pump-label {
		font-size: 16px;
		font-weight: 700;
	}

	.valve-label,
	.manifold-label {
		fill: var(--color-gray-dark);
	}

	.pump-label {
		fill: var(--color-bg);
	}

	.component-info,
	.valve-info,
	.legend-text {
		font-size: 12px;
		fill: var(--color-gray-dark);
		font-weight: 500;
	}

	.output-label {
		font-size: 18px;
		font-weight: 600;
		fill: var(--color-accent);
	}

	.legend-title {
		font-size: 14px;
		font-weight: 600;
		fill: var(--color-gray-dark);
	}

	.pump-body,
	.valve-body {
		fill: var(--color-gray-light);
		stroke: var(--color-gray);
		stroke-width: 2;
		transition: var(--transition);
	}

	.pump-impeller {
		fill: var(--color-gray);
		stroke: var(--color-gray-dark);
		stroke-width: 2;
		transition: var(--transition);
	}

	.manifold-body {
		fill: var(--color-bg);
		stroke: var(--color-gray);
		stroke-width: 3;
		transition: var(--transition);
	}

	.pump.active .pump-body {
		fill: var(--color-component);
		stroke: var(--color-accent-dark);
	}

	.pump.active .pump-impeller {
		fill: var(--color-accent-dark);
		stroke: var(--color-accent-dark);
	}

	.valve.active .valve-body {
		fill: var(--color-component);
		stroke: var(--color-accent-dark);
	}

	.manifold.active .manifold-body {
		stroke: var(--color-accent-dark);
	}

	.pipe,
	.collector-pipe,
	.output-pipe {
		stroke: var(--color-gray-light);
		stroke-width: 4;
		stroke-linecap: round;
		transition: var(--transition);
	}

	.pipe.active,
	.output-pipe.active,
	.collector-pipe.active {
		stroke: var(--color-accent);
	}

	.flow-arrow {
		fill: var(--color-gray-light);
		transition: var(--transition);
	}

	.flow-arrow.active {
		fill: var(--color-accent);
	}

	@media (max-width: 768px) {
		.schema {
			height: 400px;
		}
	}
</style>
