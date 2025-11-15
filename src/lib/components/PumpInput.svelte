<script lang="ts">
  export let label: string;
  export let flow: number;
  export let head: number;
  export let velocity: number;

  $: flowM3s = flow / 3600;

  function formatNumber(value: number, decimals: number = 6): string {
    if (!Number.isFinite(value)) {
      return 'н/д';
    }
    return value.toFixed(decimals);
  }
</script>

<fieldset>
  <legend>{label}</legend>

  <div class="form-group">
    <label for="{label}-flow">
      G производительность <small>(м³/ч)</small>
    </label>
    <input
      type="number"
      id="{label}-flow"
      bind:value={flow}
      required
      min="0"
      step="any"
      inputmode="decimal"
      placeholder="например 10"
    />
    <output for="{label}-flow">
      {flow > 0 ? `${formatNumber(flowM3s, 6)} м³/с` : '— м³/с'}
    </output>
  </div>

  <div class="form-group">
    <label for="{label}-head">
      Ru высота подъёма <small>(м)</small>
    </label>
    <input
      type="number"
      id="{label}-head"
      bind:value={head}
      required
      min="0"
      step="any"
      inputmode="decimal"
      placeholder="например 12"
    />
  </div>

  <div class="form-group">
    <label for="{label}-velocity">
      V скорость потока после насоса <small>(м/с)</small>
    </label>
    <input
      type="number"
      id="{label}-velocity"
      bind:value={velocity}
      required
      min="0"
      step="any"
      inputmode="decimal"
      placeholder="например 1.2"
    />
  </div>
</fieldset>

<style>
  fieldset {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  legend {
    font-weight: 600;
    color: #444;
    padding: 0 0.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 500;
    color: #555;
  }

  label small {
    color: #888;
    font-weight: 400;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  }

  output {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
  }
</style>
