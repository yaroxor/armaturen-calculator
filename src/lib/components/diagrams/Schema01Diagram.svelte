<script lang="ts">
	import type { CalculatorResults } from '$lib/calculators/types';

	export let results: CalculatorResults | null = null;

	$: hasResults = results !== null;
	$: isPump1Active = results && results.pump1.flow_m3_per_s > 0;
	$: isPump2Active = results && results.pump2.flow_m3_per_s > 0;
	$: isManifoldActive = isPump1Active || isPump2Active;

	const pump1 = { x: 140, y: 200 };
	const pump2 = { x: 140, y: 500 };

	const k1 = { x: 310, y: 200 };
	const z1 = { x: 450, y: 200 };

	const k2 = { x: 310, y: 500 };
	const z2 = { x: 450, y: 500 };

	const manifold = { x: 600, y: 350, width: 90, height: 200 };

	const z3 = { x: 730, y: 270 };
	const z4 = { x: 730, y: 360 };
	const z5 = { x: 730, y: 430 };

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
		<text x="500" y="30" text-anchor="middle" class="title">
			Двухнасосная система с гребенкой
		</text>

		<!-- PUMP 1 -->
		<g class="pump" class:active={isPump1Active}>
			<!-- Pump body -->
			<rect x={pump1.x - 40} y={pump1.y - 50} width="80" height="100" rx="10" class="pump-body" />
			<circle cx={pump1.x} cy={pump1.y} r="35" class="pump-impeller" />

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
			<rect x={pump2.x - 40} y={pump2.y - 50} width="80" height="100" rx="10" class="pump-body" />
			<circle cx={pump2.x} cy={pump2.y} r="35" class="pump-impeller" />

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
			x1={pump1.x + 40}
			y1={pump1.y}
			x2={k1.x - 20}
			y2={pump1.y}
			class="pipe"
			class:active={isPump1Active}
		/>
		<polygon
			points={`${k1.x - 35},${pump1.y - 5} ${k1.x - 25},${pump1.y} ${k1.x - 35},${pump1.y + 5}`}
			class="flow-arrow"
			class:active={isPump1Active}
		/>

		<!-- CHECK VALVE K1 -->
		<g class="valve check-valve" class:active={isPump1Active}>
			<rect x={k1.x - 20} y={k1.y - 20} width="40" height="40" rx="5" class="valve-body" />
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

		<!-- PIPE AFTER K1 -->
		<line
			x1={k1.x + 20}
			y1={k1.y}
			x2={z1.x - 20}
			y2={z1.y}
			class="pipe"
			class:active={isPump1Active}
		/>
		<polygon
			points={`${z1.x - 25},${z1.y - 5} ${z1.x - 15},${z1.y} ${z1.x - 25},${z1.y + 5}`}
			class="flow-arrow"
			class:active={isPump1Active}
		/>

		<!-- GATE VALVE Z1 -->
		<g class="valve gate-valve" class:active={isPump1Active}>
			<rect x={z1.x - 20} y={z1.y - 20} width="40" height="40" rx="5" class="valve-body" />
			<rect x={z1.x - 5} y={z1.y - 15} width="10" height="30" fill="#fff" />
			<text x={z1.x} y={z1.y + 35} text-anchor="middle" class="valve-label">З1</text>
			{#if results}
				<text x={z1.x} y={z1.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z1.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE TO MANIFOLD FROM LINE 1 -->
		<line
			x1={z1.x + 20}
			y1={z1.y}
			x2={manifold.x - manifold.width / 2 - 5}
			y2={manifold.y - 50}
			class="pipe"
			class:active={isPump1Active}
		/>
		<polygon
			points={`${manifold.x - manifold.width / 2 - 10},${manifold.y - 55} ${manifold.x - manifold.width / 2},${manifold.y - 50} ${manifold.x - manifold.width / 2 - 10},${manifold.y - 45}`}
			class="flow-arrow"
			class:active={isPump1Active}
		/>

		<!-- PIPE FROM PUMP 2 -->
		<line
			x1={pump2.x + 40}
			y1={pump2.y}
			x2={k2.x - 30}
			y2={pump2.y}
			class="pipe"
			class:active={isPump2Active}
		/>
		<polygon
			points={`${k2.x - 35},${pump2.y - 5} ${k2.x - 25},${pump2.y} ${k2.x - 35},${pump2.y + 5}`}
			class="flow-arrow"
			class:active={isPump2Active}
		/>

		<!-- CHECK VALVE K2 -->
		<g class="valve check-valve" class:active={isPump2Active}>
			<rect x={k2.x - 20} y={k2.y - 20} width="40" height="40" rx="5" class="valve-body" />
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

		<!-- PIPE AFTER K2 -->
		<line
			x1={k2.x + 20}
			y1={k2.y}
			x2={z2.x - 20}
			y2={z2.y}
			class="pipe"
			class:active={isPump2Active}
		/>
		<polygon
			points={`${z2.x - 25},${z2.y - 5} ${z2.x - 15},${z2.y} ${z2.x - 25},${z2.y + 5}`}
			class="flow-arrow"
			class:active={isPump2Active}
		/>

		<!-- GATE VALVE Z2 -->
		<g class="valve gate-valve" class:active={isPump2Active}>
			<rect x={z2.x - 20} y={z2.y - 20} width="40" height="40" rx="5" class="valve-body" />
			<rect x={z2.x - 5} y={z2.y - 15} width="10" height="30" fill="#fff" />
			<text x={z2.x} y={z2.y + 35} text-anchor="middle" class="valve-label">З2</text>
			{#if results}
				<text x={z2.x} y={z2.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z2.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE TO MANIFOLD FROM LINE 2 -->
		<line
			x1={z2.x + 20}
			y1={z2.y}
			x2={manifold.x - manifold.width / 2 - 5}
			y2={manifold.y + 50}
			class="pipe"
			class:active={isPump2Active}
		/>
		<polygon
			points={`${manifold.x - manifold.width / 2 - 10},${manifold.y + 45} ${manifold.x - manifold.width / 2},${manifold.y + 50} ${manifold.x - manifold.width / 2 - 10},${manifold.y + 55}`}
			class="flow-arrow"
			class:active={isPump2Active}
		/>

		<!-- MANIFOLD (ГРЕБЕНКА) -->
		<g class="manifold" class:active={isManifoldActive}>
			<rect
				x={manifold.x - 45}
				y={manifold.y - 100}
				width={manifold.width}
				height={manifold.height}
				rx="8"
				class="manifold-body"
			/>
			<text x={manifold.x} y={manifold.y} text-anchor="middle" class="manifold-label">Гребенка</text
			>
		</g>

		<!-- PIPE FROM MANIFOLD TO Z3 -->
		<line
			x1={manifoldPipeStart}
			y1={z3.y}
			x2={z3.x - 20}
			y2={z3.y}
			class="pipe"
			class:active={isManifoldActive}
		/>

		<!-- GATE VALVE Z3 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect
				x={z3.x - 20}
				y={z3.y - 20}
				width={valveWidth}
				height={valveHeight}
				rx="5"
				class="valve-body"
			/>
			<rect x={z3.x - 5} y={z3.y - 15} width="10" height="30" fill="#fff" />
			<text x={z3.x} y={z3.y + 35} text-anchor="middle" class="valve-label">З3</text>
			{#if results}
				<text x={z3.x} y={z3.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z3.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE FROM MANIFOLD TO Z4 -->
		<line
			x1={manifoldPipeStart}
			y1={z4.y}
			x2={z4.x - 20}
			y2={z4.y}
			class="pipe"
			class:active={isManifoldActive}
		/>

		<!-- GATE VALVE Z4 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect
				x={z4.x - 20}
				y={z4.y - 20}
				width={valveWidth}
				height={valveHeight}
				rx="5"
				class="valve-body"
			/>
			<rect x={z4.x - 5} y={z4.y - 15} width="10" height="30" fill="#fff" />
			<text x={z4.x} y={z4.y + 35} text-anchor="middle" class="valve-label">З4</text>
			{#if results}
				<text x={z4.x} y={z4.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z4.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE FROM MANIFOLD TO Z5 -->
		<line
			x1={manifoldPipeStart}
			y1={z5.y}
			x2={z5.x - 20}
			y2={z5.y}
			class="pipe"
			class:active={isManifoldActive}
		/>

		<!-- GATE VALVE Z5 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect
				x={z5.x - 20}
				y={z5.y - 20}
				width={valveWidth}
				height={valveHeight}
				rx="5"
				class="valve-body"
			/>
			<rect x={z5.x - 5} y={z5.y - 15} width="10" height="30" fill="#fff" />
			<text x={z5.x} y={z5.y + 35} text-anchor="middle" class="valve-label">З5</text>
			{#if results}
				<text x={z5.x} y={z5.y + 50} text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z5.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- OUTPUT PIPES -->
		<line
			x1={z3.x + 20}
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

		<line
			x1={z4.x + 20}
			y1={z4.y}
			x2={output.x - 50}
			y2={z4.y}
			class="pipe output-pipe"
			class:active={isManifoldActive}
		/>
		<polygon
			points={`${output.x - 55},${z4.y - 5} ${output.x - 45},${z4.y} ${output.x - 55},${z4.y + 5}`}
			class="flow-arrow"
			class:active={isManifoldActive}
		/>

		<line
			x1={z5.x + 20}
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

		<!-- OUTPUT LABEL -->
		<text x={output.x} y={manifold.y + 5} text-anchor="middle" class="output-label">Выход</text>

		<!-- Legend -->
		<g class="legend">
			<text x="50" y="650" class="legend-title">Обозначения:</text>
			<text x="50" y="670" class="legend-text">Н - Насос</text>
			<text x="200" y="670" class="legend-text">К - Обратный клапан</text>
			<text x="400" y="670" class="legend-text">З - Задвижка</text>
			<text x="600" y="670" class="legend-text">⌀ - Диаметр (мм)</text>
		</g>
	</svg>
</div>

<style>
	.diagram-wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.3rem;
	}

	.instruction-text {
		margin: 0 0 1rem 0;
		color: #999;
		font-size: 1rem;
		font-style: italic;
	}

	.schema {
		width: 100%;
		height: 100%;
		flex: 1;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	/* Text styles */
	.title {
		font-size: 20px;
		font-weight: 600;
		fill: #333;
	}

	.valve-label {
		font-size: 16px;
		font-weight: 700;
		fill: #000;
	}

	.pump-label,
	.manifold-label {
		font-size: 16px;
		font-weight: 700;
		fill: #fff;
	}

	.component-info,
	.valve-info {
		font-size: 12px;
		fill: #666;
		font-weight: 500;
	}

	.output-label {
		font-size: 18px;
		font-weight: 600;
		fill: #20a13a;
	}

	/* Pump styles */
	.pump-body {
		fill: #ccc;
		stroke: #999;
		stroke-width: 2;
		transition: all 0.3s;
	}

	.pump-impeller {
		fill: #999;
		stroke: #666;
		stroke-width: 2;
		transition: all 0.3s;
	}

	.pump.active .pump-body {
		fill: #20a13a;
		stroke: #1a8030;
	}

	.pump.active .pump-impeller {
		fill: #178028;
		stroke: #1a8030;
	}

	/* Valve styles */
	.valve-body {
		fill: #ccc;
		stroke: #999;
		stroke-width: 2;
		transition: all 0.3s;
	}

	.valve.active .valve-body {
		fill: #4a90e2;
		stroke: #357abd;
	}

	/* Manifold styles */
	.manifold-body {
		fill: #ccc;
		stroke: #999;
		stroke-width: 3;
		transition: all 0.3s;
	}

	.manifold.active .manifold-body {
		fill: #ff9800;
		stroke: #f57c00;
	}

	/* Pipe styles */
	.pipe {
		stroke: #ccc;
		stroke-width: 4;
		stroke-linecap: round;
		transition: all 0.3s;
	}

	.pipe.active {
		stroke: #20a13a;
		stroke-width: 4;
	}

	.output-pipe {
		stroke: #ddd;
	}

	.output-pipe.active {
		stroke: #20a13a;
	}

	/* Flow arrow styles */
	.flow-arrow {
		fill: #ccc;
		transition: all 0.3s;
	}

	.flow-arrow.active {
		fill: #20a13a;
	}

	/* Legend */
	.legend-title {
		font-size: 14px;
		font-weight: 600;
		fill: #333;
	}

	.legend-text {
		font-size: 12px;
		fill: #666;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.schema {
			height: 400px;
		}
	}
</style>
