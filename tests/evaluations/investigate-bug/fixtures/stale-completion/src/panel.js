function createPanel(fetchRecord, view) {
  return async function select(id) {
    view.selectedId = id;
    const record = await fetchRecord(id);
    view.record = record;
  };
}
