export const queryParamBuilder = (obj) => {
  const params = new URLSearchParams();
  for (let [key, value] of Object.entries(obj)) {
    if (value !== null && value !== "") {
      // check here for null or whatever you want
      params.append(key, value);
    }
  }
  return params;
};


export const NOTICE_TYPES = [
  { key: "ALL", value: "ALL" },
  { key: 'INFO', value: 'INFO' },
  { key: 'COMPLAINS', value: 'COMPLAINS' },
  { key: 'EVENTS', value: 'EVENTS' },
  { key: 'SCHOLARSHIPS', value: 'SCHOLARSHIPS' },
  { key: 'ADMINISTRATIVE', value: 'ADMINISTRATIVE' },
]