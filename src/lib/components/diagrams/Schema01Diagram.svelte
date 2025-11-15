<script lang="ts">
	import type { CalculatorResults } from '$lib/calculators/types';

	export let results: CalculatorResults | null = null;

	$: isPump1Active = results && results.pump1.flow_m3_per_s > 0;
	$: isPump2Active = results && results.pump2.flow_m3_per_s > 0;
	$: isManifoldActive = isPump1Active || isPump2Active;
</script>

<div class="diagram-wrapper">
	<h3>Схема установки</h3>

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
			<rect x="100" y="150" width="80" height="100" rx="10" class="pump-body" />
			<circle cx="140" cy="200" r="35" class="pump-impeller" />

			<!-- Pump label -->
			<text x="140" y="205" text-anchor="middle" class="pump-label">Н1</text>
			<text x="140" y="280" text-anchor="middle" class="component-info">
				{#if results}
					{results.pump1.flow_m3_per_h.toFixed(0)} м³/ч
				{/if}
			</text>
		</g>

		<!-- PUMP 2 -->
		<g class="pump" class:active={isPump2Active}>
			<!-- Pump body -->
			<rect x="100" y="450" width="80" height="100" rx="10" class="pump-body" />
			<circle cx="140" cy="500" r="35" class="pump-impeller" />

			<!-- Pump label -->
			<text x="140" y="505" text-anchor="middle" class="pump-label">Н2</text>
			<text x="140" y="580" text-anchor="middle" class="component-info">
				{#if results}
					{results.pump2.flow_m3_per_h.toFixed(0)} м³/ч
				{/if}
			</text>
		</g>

		<!-- PIPE FROM PUMP 1 -->
		<line x1="180" y1="200" x2="280" y2="200" class="pipe" class:active={isPump1Active} />
		<polygon points="275,195 285,200 275,205" class="flow-arrow" class:active={isPump1Active} />

		<!-- CHECK VALVE K1 -->
		<g class="valve check-valve" class:active={isPump1Active}>
			<rect x="290" y="180" width="40" height="40" rx="5" class="valve-body" />
			<path d="M 300 200 L 320 190 L 320 210 Z" fill="#fff" />
			<text x="310" y="235" text-anchor="middle" class="valve-label">К1</text>
			{#if results}
				<text x="310" y="250" text-anchor="middle" class="valve-info">
					⌀{results.check_valve_k1.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE AFTER K1 -->
		<line x1="330" y1="200" x2="420" y2="200" class="pipe" class:active={isPump1Active} />
		<polygon points="415,195 425,200 415,205" class="flow-arrow" class:active={isPump1Active} />

		<!-- GATE VALVE Z1 -->
		<g class="valve gate-valve" class:active={isPump1Active}>
			<rect x="430" y="180" width="40" height="40" rx="5" class="valve-body" />
			<rect x="445" y="185" width="10" height="30" fill="#fff" />
			<text x="450" y="235" text-anchor="middle" class="valve-label">З1</text>
			{#if results}
				<text x="450" y="250" text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z1.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE TO MANIFOLD FROM LINE 1 -->
		<line x1="470" y1="200" x2="550" y2="300" class="pipe" class:active={isPump1Active} />
		<polygon points="545,295 555,300 545,305" class="flow-arrow" class:active={isPump1Active} />

		<!-- PIPE FROM PUMP 2 -->
		<line x1="180" y1="500" x2="280" y2="500" class="pipe" class:active={isPump2Active} />
		<polygon points="275,495 285,500 275,505" class="flow-arrow" class:active={isPump2Active} />

		<!-- CHECK VALVE K2 -->
		<g class="valve check-valve" class:active={isPump2Active}>
			<rect x="290" y="480" width="40" height="40" rx="5" class="valve-body" />
			<path d="M 300 500 L 320 490 L 320 510 Z" fill="#fff" />
			<text x="310" y="535" text-anchor="middle" class="valve-label">К2</text>
			{#if results}
				<text x="310" y="550" text-anchor="middle" class="valve-info">
					⌀{results.check_valve_k2.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE AFTER K2 -->
		<line x1="330" y1="500" x2="420" y2="500" class="pipe" class:active={isPump2Active} />
		<polygon points="415,495 425,500 415,505" class="flow-arrow" class:active={isPump2Active} />

		<!-- GATE VALVE Z2 -->
		<g class="valve gate-valve" class:active={isPump2Active}>
			<rect x="430" y="480" width="40" height="40" rx="5" class="valve-body" />
			<rect x="445" y="485" width="10" height="30" fill="#fff" />
			<text x="450" y="535" text-anchor="middle" class="valve-label">З2</text>
			{#if results}
				<text x="450" y="550" text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z2.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE TO MANIFOLD FROM LINE 2 -->
		<line x1="470" y1="500" x2="550" y2="400" class="pipe" class:active={isPump2Active} />
		<polygon points="545,395 555,400 545,405" class="flow-arrow" class:active={isPump2Active} />

		<!-- MANIFOLD (ГРЕБЕНКА) -->
		<g class="manifold" class:active={isManifoldActive}>
			<rect x="560" y="280" width="60" height="140" rx="8" class="manifold-body" />
			<text x="590" y="360" text-anchor="middle" class="manifold-label">Гребенка</text>
		</g>

		<!-- GATE VALVE Z3 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect x="650" y="290" width="40" height="40" rx="5" class="valve-body" />
			<rect x="665" y="295" width="10" height="30" fill="#fff" />
			<text x="670" y="345" text-anchor="middle" class="valve-label">З3</text>
			{#if results}
				<text x="670" y="360" text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z3.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE FROM MANIFOLD TO Z3 -->
		<line x1="620" y1="310" x2="650" y2="310" class="pipe" class:active={isManifoldActive} />

		<!-- GATE VALVE Z4 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect x="650" y="340" width="40" height="40" rx="5" class="valve-body" />
			<rect x="665" y="345" width="10" height="30" fill="#fff" />
			<text x="670" y="395" text-anchor="middle" class="valve-label">З4</text>
			{#if results}
				<text x="670" y="410" text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z4.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE FROM MANIFOLD TO Z4 -->
		<line x1="620" y1="360" x2="650" y2="360" class="pipe" class:active={isManifoldActive} />

		<!-- GATE VALVE Z5 -->
		<g class="valve gate-valve" class:active={isManifoldActive}>
			<rect x="650" y="370" width="40" height="40" rx="5" class="valve-body" />
			<rect x="665" y="375" width="10" height="30" fill="#fff" />
			<text x="670" y="425" text-anchor="middle" class="valve-label">З5</text>
			{#if results}
				<text x="670" y="440" text-anchor="middle" class="valve-info">
					⌀{results.gate_valve_z5.diameter_mm.toFixed(0)}
				</text>
			{/if}
		</g>

		<!-- PIPE FROM MANIFOLD TO Z5 -->
		<line x1="620" y1="380" x2="650" y2="380" class="pipe" class:active={isManifoldActive} />

		<!-- OUTPUT PIPES -->
		<line
			x1="690"
			y1="310"
			x2="800"
			y2="310"
			class="pipe output-pipe"
			class:active={isManifoldActive}
		/>
		<polygon points="795,305 805,310 795,315" class="flow-arrow" class:active={isManifoldActive} />

		<line
			x1="690"
			y1="360"
			x2="800"
			y2="360"
			class="pipe output-pipe"
			class:active={isManifoldActive}
		/>
		<polygon points="795,355 805,360 795,365" class="flow-arrow" class:active={isManifoldActive} />

		<line
			x1="690"
			y1="390"
			x2="800"
			y2="390"
			class="pipe output-pipe"
			class:active={isManifoldActive}
		/>
		<polygon points="795,385 805,390 795,395" class="flow-arrow" class:active={isManifoldActive} />

		<!-- OUTPUT LABEL -->
		<text x="850" y="355" text-anchor="middle" class="output-label">Выход</text>

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
		margin: 0 0 1rem 0;
		color: #333;
		font-size: 1.3rem;
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

	.pump-label,
	.valve-label,
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
		stroke-width: 6;
		stroke-linecap: round;
		transition: all 0.3s;
	}

	.pipe.active {
		stroke: #20a13a;
		stroke-width: 8;
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
		animation: pulse 1.5s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
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
