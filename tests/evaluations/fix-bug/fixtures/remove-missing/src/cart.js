function removeLine(lines, id) {
  const copy = lines.slice();
  copy.splice(lines.findIndex((line) => line.id === id), 1);
  return copy;
}
