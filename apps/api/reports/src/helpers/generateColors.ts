export function generateColors(numColors: number) {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    // Simple method to generate a random color
    const color = '#' + Math.floor(Math.random()*16777215).toString(16);
    colors.push(color);
  }
  return colors;
}