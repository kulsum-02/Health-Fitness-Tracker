/**
 * BMI Calculator and Scale Utilities
 * Formula: BMI = Weight(kg) / Height(m)^2
 */

export const calculateBMI = (weightKg, heightCm) => {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);

  if (!w || !h || w <= 0 || h <= 0) {
    return null;
  }

  const heightM = h / 100;
  const bmi = w / (heightM * heightM);
  return Number(bmi.toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (bmi === null || bmi === undefined || isNaN(bmi) || bmi <= 0) {
    return {
      category: 'Unknown',
      color: 'slate',
      bgClass: 'bg-slate-100 text-slate-700',
      borderClass: 'border-slate-300',
      description: 'Enter valid height and weight to calculate category.'
    };
  }

  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'amber',
      bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
      borderClass: 'border-amber-400',
      advice: 'Below standard healthy range. Focus on nutrient-dense foods and strength building.',
      badgeColor: 'amber'
    };
  } else if (bmi >= 18.5 && bmi < 25.0) {
    return {
      category: 'Normal',
      color: 'emerald',
      bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderClass: 'border-emerald-400',
      advice: 'Healthy weight range. Maintain balanced nutrition and regular physical activity.',
      badgeColor: 'emerald'
    };
  } else if (bmi >= 25.0 && bmi < 30.0) {
    return {
      category: 'Overweight',
      color: 'orange',
      bgClass: 'bg-orange-50 text-orange-700 border-orange-200',
      borderClass: 'border-orange-400',
      advice: 'Moderately above standard range. Cardiovascular exercises and moderate calorie deficit recommended.',
      badgeColor: 'orange'
    };
  } else {
    return {
      category: 'Obese',
      color: 'rose',
      bgClass: 'bg-rose-50 text-rose-700 border-rose-200',
      borderClass: 'border-rose-400',
      advice: 'Significantly elevated health risk. Structured lifestyle changes and professional consultation recommended.',
      badgeColor: 'rose'
    };
  }
};

/**
 * Maps BMI value to 0-100% position across the 4 visual segments:
 * 0% - 25%: Underweight (10 to 18.5)
 * 25% - 50%: Normal (18.5 to 25.0)
 * 50% - 75%: Overweight (25.0 to 30.0)
 * 75% - 100%: Obese (30.0 to 40.0)
 */
export const getBMIPosition = (bmi) => {
  if (!bmi || bmi <= 0) return 0;
  
  if (bmi < 18.5) {
    const clamped = Math.max(12, bmi);
    return ((clamped - 12) / (18.5 - 12)) * 25;
  } else if (bmi < 25.0) {
    return 25 + ((bmi - 18.5) / (25.0 - 18.5)) * 25;
  } else if (bmi < 30.0) {
    return 50 + ((bmi - 25.0) / (30.0 - 25.0)) * 25;
  } else {
    const clamped = Math.min(40, bmi);
    return 75 + ((clamped - 30.0) / (40.0 - 30.0)) * 25;
  }
};

export const getHealthyWeightRange = (heightCm) => {
  const h = parseFloat(heightCm);
  if (!h || h <= 0) return null;
  const heightM = h / 100;
  const minWeight = Number((18.5 * heightM * heightM).toFixed(1));
  const maxWeight = Number((24.9 * heightM * heightM).toFixed(1));
  return { minWeight, maxWeight };
};
