function clamp(input, inMin, inMax, outMin, outMax) {
  return (
    (
      (input - inMin) * (outMax - outMin)
    ) / (inMax - inMin)
  ) + outMin;
}

export { clamp };
