import { describe, it, expect } from 'vitest';
import {
  m3h_to_m3s,
  calculateDiameter,
  calculatePressure,
  calculate
} from './schema-01';
import type { CalculatorInputs } from './types';

describe('Схема 01 - Калькулятор насосов', () => {
  console.log('Схема 01 - Калькулятор насосов')
  describe('Конвертация м³/ч в м³/с', () => {
    console.log('Конвертация м³/ч в м³/с')
    it('корректно переводит 3600 м³/ч в 1 м³/с', () => {
      const result = m3h_to_m3s(3600);
      expect(result).toBe(1);
      console.log('✓ Ввод: 3600 м³/ч → Результат: 1 м³/с');
    });

    it('корректно переводит 1800 м³/ч в 0.5 м³/с', () => {
      const result = m3h_to_m3s(1800);
      expect(result).toBe(0.5);
      console.log('✓ Ввод: 1800 м³/ч → Результат: 0.5 м³/с');
    });

    it('корректно обрабатывает ноль', () => {
      const result = m3h_to_m3s(0);
      expect(result).toBe(0);
      console.log('✓ Ввод: 0 м³/ч → Результат: 0 м³/с');
    });

    it('обрабатывает десятичные значения', () => {
      const input1 = 100;
      const result1 = m3h_to_m3s(input1);
      expect(result1).toBeCloseTo(0.02778);
      console.log(`✓ Ввод: ${input1} м³/ч → Результат: ${result1.toFixed(5)} м³/с`);

      const input2 = 250.5;
      const result2 = m3h_to_m3s(input2);
      expect(result2).toBeCloseTo(0.06958);
      console.log(`✓ Ввод: ${input2} м³/ч → Результат: ${result2.toFixed(5)} м³/с`);
    });
  });

  describe('Расчет диаметра по формуле √(4×G/(3.14×V))×1000', () => {
    console.log('Расчет диаметра по формуле √(4×G/(3.14×V))×1000')
    it('рассчитывает диаметр для Q=0.027778 м³/с, V=2 м/с', () => {
      const Q = 0.027778;
      const V = 2;
      const result = calculateDiameter(Q, V);
      expect(result).toBeCloseTo(132.98, 1);
      console.log(`✓ Ввод: Q=${Q} м³/с, V=${V} м/с → Диаметр: ${result.toFixed(2)} мм`);
    });

    it('рассчитывает диаметр для типичных значений насоса (100 м³/ч, V=1.5 м/с)', () => {
      const flow_m3h = 100;
      const Q = m3h_to_m3s(flow_m3h);
      const V = 1.5;
      const result = calculateDiameter(Q, V);
      expect(result).toBeCloseTo(153.56, 1);
      console.log(`✓ Ввод: G=${flow_m3h} м³/ч (${Q.toFixed(6)} м³/с), V=${V} м/с → Диаметр: ${result.toFixed(2)} мм`);
    });

    it('возвращает NaN при нулевой скорости потока', () => {
      const result = calculateDiameter(0.027778, 0);
      expect(result).toBeNaN();
      console.log('✓ Ввод: V=0 м/с → Результат: NaN (некорректные данные)');
    });

    it('возвращает NaN при нулевом расходе', () => {
      const result = calculateDiameter(0, 2);
      expect(result).toBeNaN();
      console.log('✓ Ввод: Q=0 м³/с → Результат: NaN (некорректные данные)');
    });

    it('возвращает NaN при некорректных входных данных', () => {
      expect(calculateDiameter(NaN, 2)).toBeNaN();
      expect(calculateDiameter(0.027778, NaN)).toBeNaN();
      expect(calculateDiameter(Infinity, 2)).toBeNaN();
      console.log('✓ Некорректные данные (NaN, Infinity) обрабатываются правильно');
    });
  });

  describe('Расчет давления по формуле Ру=Ру_насоса×0.1×1.1', () => {
    console.log('Расчет давления по формуле Ру=Ру_насоса×0.1×1.1')
    it('рассчитывает давление для высоты подъёма 20м', () => {
      const head = 20;
      const result = calculatePressure(head);
      expect(result).toBeCloseTo(2.2, 2);
      console.log(`✓ Ввод: Высота подъёма=${head}м → Давление: ${result.toFixed(2)}м`);
    });

    it('рассчитывает давление для высоты подъёма 10м', () => {
      const head = 10;
      const result = calculatePressure(head);
      expect(result).toBeCloseTo(1.1, 2);
      console.log(`✓ Ввод: Высота подъёма=${head}м → Давление: ${result.toFixed(2)}м`);
    });

    it('рассчитывает давление для высоты подъёма 50м', () => {
      const head = 50;
      const result = calculatePressure(head);
      expect(result).toBeCloseTo(5.5, 2);
      console.log(`✓ Ввод: Высота подъёма=${head}м → Давление: ${result.toFixed(2)}м`);
    });

    it('обрабатывает нулевую высоту подъёма', () => {
      const result = calculatePressure(0);
      expect(result).toBe(0);
      console.log('✓ Ввод: Высота подъёма=0м → Давление: 0м');
    });

    it('возвращает NaN для некорректных данных', () => {
      expect(calculatePressure(NaN)).toBeNaN();
      expect(calculatePressure(Infinity)).toBeNaN();
      console.log('✓ Некорректные данные обрабатываются правильно');
    });
  });

  describe('Полный расчет схемы - Интеграционные тесты', () => {
    console.log('Полный расчет схемы - Интеграционные тесты')
    const baseInputs: CalculatorInputs = {
      pump1: {
        flow_m3_per_h: 100,
        head_m: 20,
        velocity_m_s: 2
      },
      pump2: {
        flow_m3_per_h: 100,
        head_m: 20,
        velocity_m_s: 2
      },
      manifold_velocity_m_s: 1.5
    };

    it('полный расчет для одинаковых насосов (100 м³/ч, 20м, 2 м/с)', () => {
      console.log('\n═══ ТЕСТ: Базовый расчет с одинаковыми параметрами насосов ═══');
      console.log('Входные данные:');
      console.log(`  Насос 1: G=${baseInputs.pump1.flow_m3_per_h} м³/ч, Ру=${baseInputs.pump1.head_m}м, V=${baseInputs.pump1.velocity_m_s} м/с`);
      console.log(`  Насос 2: G=${baseInputs.pump2.flow_m3_per_h} м³/ч, Ру=${baseInputs.pump2.head_m}м, V=${baseInputs.pump2.velocity_m_s} м/с`);
      console.log(`  Гребенка: 2V=${baseInputs.manifold_velocity_m_s} м/с`);

      const results = calculate(baseInputs);

      console.log('\nРезультаты конвертации:');
      console.log(`  Насос 1: ${results.pump1.flow_m3_per_s.toFixed(6)} м³/с`);
      console.log(`  Насос 2: ${results.pump2.flow_m3_per_s.toFixed(6)} м³/с`);
      expect(results.pump1.flow_m3_per_s).toBeCloseTo(0.027778, 5);
      expect(results.pump2.flow_m3_per_s).toBeCloseTo(0.027778, 5);

      console.log('\nОбратный клапан К1:');
      console.log(`  Диаметр: ${results.check_valve_k1.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.check_valve_k1.pressure_m.toFixed(2)} м`);
      expect(results.check_valve_k1.diameter_mm).toBeCloseTo(132.98, 1);
      expect(results.check_valve_k1.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\nОбратный клапан К2:');
      console.log(`  Диаметр: ${results.check_valve_k2.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.check_valve_k2.pressure_m.toFixed(2)} м`);
      expect(results.check_valve_k2.diameter_mm).toBeCloseTo(132.98, 1);
      expect(results.check_valve_k2.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\nЗадвижка З1:');
      console.log(`  Диаметр: ${results.gate_valve_z1.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.gate_valve_z1.pressure_m.toFixed(2)} м`);
      expect(results.gate_valve_z1.diameter_mm).toBeCloseTo(132.98, 1);
      expect(results.gate_valve_z1.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\nЗадвижка З2:');
      console.log(`  Диаметр: ${results.gate_valve_z2.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.gate_valve_z2.pressure_m.toFixed(2)} м`);
      expect(results.gate_valve_z2.diameter_mm).toBeCloseTo(132.98, 1);
      expect(results.gate_valve_z2.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\n✓ Все результаты корректны\n');
    });

    it('расчет задвижек З3, З4, З5 с суммированием потоков насосов', () => {
      console.log('\n═══ ТЕСТ: Расчет задвижек гребенки (З3, З4, З5) ═══');
      console.log('Входные данные:');
      console.log(`  Насос 1: G=${baseInputs.pump1.flow_m3_per_h} м³/ч`);
      console.log(`  Насос 2: G=${baseInputs.pump2.flow_m3_per_h} м³/ч`);
      console.log(`  Скорость в гребенке: 2V=${baseInputs.manifold_velocity_m_s} м/с`);

      const results = calculate(baseInputs);

      const combined_flow = (results.pump1.flow_m3_per_s + results.pump2.flow_m3_per_s) / 2;
      console.log(`\nСредний поток: ${results.pump1.flow_m3_per_s.toFixed(6)} + ${results.pump2.flow_m3_per_s.toFixed(6)} = ${combined_flow.toFixed(6)} м³/с`);

      const expectedDiameter = Math.sqrt((4 * combined_flow) / (Math.PI * baseInputs.manifold_velocity_m_s)) * 1000;
      console.log(`Ожидаемый диаметр: √(4×${combined_flow.toFixed(6)}/(π×${baseInputs.manifold_velocity_m_s}))×1000 = ${expectedDiameter.toFixed(2)} мм`);

      console.log('\nЗадвижка З3:');
      console.log(`  Диаметр: ${results.gate_valve_z3.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.gate_valve_z3.pressure_m.toFixed(2)} м`);
      expect(results.gate_valve_z3.diameter_mm).toBeCloseTo(expectedDiameter, 1);
      expect(results.gate_valve_z3.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\nЗадвижка З4:');
      console.log(`  Диаметр: ${results.gate_valve_z4.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.gate_valve_z4.pressure_m.toFixed(2)} м`);
      expect(results.gate_valve_z4.diameter_mm).toBeCloseTo(expectedDiameter, 1);
      expect(results.gate_valve_z4.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\nЗадвижка З5:');
      console.log(`  Диаметр: ${results.gate_valve_z5.diameter_mm.toFixed(2)} мм`);
      console.log(`  Давление: ${results.gate_valve_z5.pressure_m.toFixed(2)} м`);
      expect(results.gate_valve_z5.diameter_mm).toBeCloseTo(expectedDiameter, 1);
      expect(results.gate_valve_z5.pressure_m).toBeCloseTo(2.2, 2);

      console.log('\n✓ Все задвижки гребенки рассчитаны корректно\n');
    });

    it('использует максимальную высоту подъёма для расчета давления в гребенке', () => {
      console.log('\n═══ ТЕСТ: Выбор максимальной высоты подъёма ═══');
      const inputs: CalculatorInputs = {
        pump1: { flow_m3_per_h: 100, head_m: 20, velocity_m_s: 2 },
        pump2: { flow_m3_per_h: 100, head_m: 30, velocity_m_s: 2 },
        manifold_velocity_m_s: 1.5
      };

      console.log('Входные данные:');
      console.log(`  Насос 1: Высота подъёма = ${inputs.pump1.head_m}м`);
      console.log(`  Насос 2: Высота подъёма = ${inputs.pump2.head_m}м`);
      console.log(`  Максимальная высота: ${Math.max(inputs.pump1.head_m, inputs.pump2.head_m)}м`);

      const results = calculate(inputs);

      const expectedPressure = 30 * 0.1 * 1.1;
      console.log(`\nОжидаемое давление: ${inputs.pump2.head_m}×0.1×1.1 = ${expectedPressure.toFixed(2)}м`);

      console.log('\nРезультаты для задвижек гребенки:');
      console.log(`  З3 давление: ${results.gate_valve_z3.pressure_m.toFixed(2)}м`);
      console.log(`  З4 давление: ${results.gate_valve_z4.pressure_m.toFixed(2)}м`);
      console.log(`  З5 давление: ${results.gate_valve_z5.pressure_m.toFixed(2)}м`);

      expect(results.gate_valve_z3.pressure_m).toBeCloseTo(expectedPressure, 2);
      expect(results.gate_valve_z4.pressure_m).toBeCloseTo(expectedPressure, 2);
      expect(results.gate_valve_z5.pressure_m).toBeCloseTo(expectedPressure, 2);

      console.log('\n✓ Максимальная высота подъёма выбрана корректно\n');
    });

    it('расчет минимальных расстояний L1, L2, L3', () => {
      console.log('\n═══ ТЕСТ: Расчет минимальных расстояний ═══');
      const results = calculate(baseInputs);

      console.log('Формулы:');
      console.log('  L1 = Диаметр К1 × 5');
      console.log('  L2 = Диаметр К1 × 3');
      console.log('  L3 = Диаметр З3 × 3');

      console.log(`\nДиаметр К1: ${results.check_valve_k1.diameter_mm.toFixed(2)} мм`);
      console.log(`Диаметр З3: ${results.gate_valve_z3.diameter_mm.toFixed(2)} мм`);

      console.log(`\nРасстояние L1: ${results.length1.toFixed(2)} мм (${results.check_valve_k1.diameter_mm.toFixed(2)} × 5)`);
      console.log(`Расстояние L2: ${results.length2.toFixed(2)} мм (${results.check_valve_k1.diameter_mm.toFixed(2)} × 3)`);
      console.log(`Расстояние L3: ${results.length3.toFixed(2)} мм (${results.gate_valve_z3.diameter_mm.toFixed(2)} × 3)`);

      expect(results.length1).toBeCloseTo(results.check_valve_k1.diameter_mm * 5, 1);
      expect(results.length2).toBeCloseTo(results.check_valve_k1.diameter_mm * 3, 1);
      expect(results.length3).toBeCloseTo(results.gate_valve_z3.diameter_mm * 3, 1);

      console.log('\n✓ Все расстояния рассчитаны корректно\n');
    });

    it('корректно обрабатывает разные параметры насосов', () => {
      console.log('\n═══ ТЕСТ: Различные параметры насосов ═══');
      const inputs: CalculatorInputs = {
        pump1: {
          flow_m3_per_h: 150,
          head_m: 25,
          velocity_m_s: 2.2
        },
        pump2: {
          flow_m3_per_h: 120,
          head_m: 18,
          velocity_m_s: 1.8
        },
        manifold_velocity_m_s: 1.6
      };

      console.log('Входные данные:');
      console.log(`  Насос 1: G=${inputs.pump1.flow_m3_per_h} м³/ч, Ру=${inputs.pump1.head_m}м, V=${inputs.pump1.velocity_m_s} м/с`);
      console.log(`  Насос 2: G=${inputs.pump2.flow_m3_per_h} м³/ч, Ру=${inputs.pump2.head_m}м, V=${inputs.pump2.velocity_m_s} м/с`);

      const results = calculate(inputs);

      console.log('\nРезультаты:');
      console.log(`  К1 диаметр: ${results.check_valve_k1.diameter_mm.toFixed(2)} мм`);
      console.log(`  К2 диаметр: ${results.check_valve_k2.diameter_mm.toFixed(2)} мм`);
      console.log(`  З1 давление: ${results.gate_valve_z1.pressure_m.toFixed(2)} м`);
      console.log(`  З2 давление: ${results.gate_valve_z2.pressure_m.toFixed(2)} м`);

      expect(results.check_valve_k1.diameter_mm).not.toBe(results.check_valve_k2.diameter_mm);
      expect(results.gate_valve_z1.pressure_m).not.toBe(results.gate_valve_z2.pressure_m);
      expect(results.check_valve_k1.pressure_m).toBeGreaterThan(results.check_valve_k2.pressure_m);

      console.log('\n✓ Разные параметры насосов обрабатываются корректно');
      console.log(`✓ Насос 1 имеет большее давление (${inputs.pump1.head_m}м > ${inputs.pump2.head_m}м)\n`);
    });

    it('обрабатывает нулевые значения', () => {
      console.log('\n═══ ТЕСТ: Обработка нулевых значений ═══');
      const inputs: CalculatorInputs = {
        pump1: { flow_m3_per_h: 0, head_m: 0, velocity_m_s: 0 },
        pump2: { flow_m3_per_h: 0, head_m: 0, velocity_m_s: 0 },
        manifold_velocity_m_s: 0
      };

      console.log('Входные данные: все параметры = 0');

      const results = calculate(inputs);

      console.log('\nРезультаты:');
      console.log(`  К1 диаметр: ${isNaN(results.check_valve_k1.diameter_mm) ? 'NaN' : results.check_valve_k1.diameter_mm}`);
      console.log(`  К2 диаметр: ${isNaN(results.check_valve_k2.diameter_mm) ? 'NaN' : results.check_valve_k2.diameter_mm}`);
      console.log(`  З3 диаметр: ${isNaN(results.gate_valve_z3.diameter_mm) ? 'NaN' : results.gate_valve_z3.diameter_mm}`);
      console.log(`  К1 давление: ${results.check_valve_k1.pressure_m}м`);
      console.log(`  К2 давление: ${results.check_valve_k2.pressure_m}м`);

      expect(results.check_valve_k1.diameter_mm).toBeNaN();
      expect(results.check_valve_k2.diameter_mm).toBeNaN();
      expect(results.gate_valve_z3.diameter_mm).toBeNaN();
      expect(results.check_valve_k1.pressure_m).toBe(0);
      expect(results.check_valve_k2.pressure_m).toBe(0);

      console.log('\n✓ Нулевые значения обработаны корректно (диаметры=NaN, давления=0)\n');
    });

    it('реальный пример: типичная канализационная насосная станция', () => {
      console.log('\n═══ ТЕСТ: Типичная канализационная насосная станция ═══');
      const inputs: CalculatorInputs = {
        pump1: {
          flow_m3_per_h: 200,
          head_m: 15,
          velocity_m_s: 2
        },
        pump2: {
          flow_m3_per_h: 200,
          head_m: 15,
          velocity_m_s: 2
        },
        manifold_velocity_m_s: 1.5
      };

      console.log('Входные данные (типичные значения для канализации):');
      console.log(`  Насос 1: G=${inputs.pump1.flow_m3_per_h} м³/ч, Ру=${inputs.pump1.head_m}м, V=${inputs.pump1.velocity_m_s} м/с`);
      console.log(`  Насос 2: G=${inputs.pump2.flow_m3_per_h} м³/ч, Ру=${inputs.pump2.head_m}м, V=${inputs.pump2.velocity_m_s} м/с`);
      console.log(`  Гребенка: 2V=${inputs.manifold_velocity_m_s} м/с`);

      const results = calculate(inputs);

      console.log('\nРезультаты:');
      console.log(`  К1 диаметр: ${results.check_valve_k1.diameter_mm.toFixed(2)} мм`);
      console.log(`  К1 давление: ${results.check_valve_k1.pressure_m.toFixed(2)} м`);
      console.log(`  L1 расстояние: ${results.length1.toFixed(2)} мм`);

      expect(results.check_valve_k1.diameter_mm).toBeGreaterThan(100);
      expect(results.check_valve_k1.diameter_mm).toBeLessThan(300);
      expect(results.check_valve_k1.pressure_m).toBeGreaterThan(1);
      expect(results.check_valve_k1.pressure_m).toBeLessThan(5);
      expect(results.length1).toBeGreaterThan(500);

      console.log('\n✓ Результаты в разумных пределах для канализационной станции');
      console.log('  ✓ Диаметр: 100-300 мм');
      console.log('  ✓ Давление: 1-5 м');
      console.log('  ✓ Расстояние L1: > 500 мм\n');
    });
  });
});
