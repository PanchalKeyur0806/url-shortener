function searchByPopulatedField(data, query, fieldName, nestedField = "name") {
  if (query && query.includes(":")) {
    const [field, value] = query.split(":").map((i) => i.trim());
    if (field === fieldName) {
      return data.filter((item) => item[fieldName] !== null);
    }
  } else if (query) {
    const keyword = query.trim().toLowerCase();
    const filtered = data.filter(
      (item) =>
        item[fieldName] &&
        item[fieldName][nestedField] &&
        item[fieldName][nestedField].toLowerCase().includes(keyword)
    );

    const seen = new Set(data.map((item) => item._id.toString()));
    filtered.forEach((item) => {
      if (!seen.has(item._id.toString())) {
        data.push(item);
      }
    });
  }
  return data;
}

export default searchByPopulatedField;
