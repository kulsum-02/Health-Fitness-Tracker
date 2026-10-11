/**
 * BMI Calculation & Clinical Category Service
 * Formula: BMI = weight(kg) / height(m)^2
 */

export const calculateBMI = (weightKg, heightCm) => {
  const w = parseFloat(weightKg);
  const h = parseFloat(heightCm);

  if (!w || !h || isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
    throw new Error('Valid positive weight and height are required to calculate BMI.');
  }

  const heightM = h / 100;
  const bmi = w / (heightM * heightM);
  return Number(bmi.toFixed(1));
};

export const getBMICategory = (bmi) => {
  if (!bmi || isNaN(bmi) || bmi <= 0) {
    return {
      category: 'Unknown',
      advice: 'Valid measurements are required to evaluate category.'
    };
  }

  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      range: '< 18.5',
      advice: 'Below standard healthy range. Focus on nutrient-dense nutrition and progressive resistance training.'
    };
  } else if (bmi >= 18.5 && bmi < 25.0) {
    return {
      category: 'Normal',
      range: '18.5 - 24.9',
      advice: 'Healthy weight range. Maintain balanced whole-food nutrition and regular physical activity.'
    };
  } else if (bmi >= 25.0 && bmi < 30.0) {
    return {
      category: 'Overweight',
      range: '25.0 - 29.9',
      advice: 'Above standard reference range. Moderate caloric deficit and consistent cardiovascular movement recommended.'
    };
  } else {
    return {
      category: 'Obese',
      range: '>= 30.0',
      advice: 'Clinically elevated metabolic risk. Structured lifestyle changes and medical consultation recommended.'
    };
  }
};

export const getHealthyWeightRange = (heightCm) => {
  const h = parseFloat(heightCm);
  if (!h || h <= 0) return null;
  const heightM = h / 100;
  const minWeight = Number((18.5 * heightM * heightM).toFixed(1));
  const maxWeight = Number((24.9 * heightM * heightM).toFixed(1));
  return { minWeight, maxWeight, unit: 'kg' };
};

export const evaluateBMI = (weightKg, heightCm) => {
  const bmi = calculateBMI(weightKg, heightCm);
  const categoryInfo = getBMICategory(bmi);
  const healthyRange = getHealthyWeightRange(heightCm);

  return {
    bmi,
    category: categoryInfo.category,
    range: categoryInfo.range,
    advice: categoryInfo.advice,
    healthyWeightRange: healthyRange,
    disclaimer: 'BMI is an epidemiological screening metric, not a standalone medical diagnosis.'
  };
};