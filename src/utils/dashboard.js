export const DEFAULT_FILTERS = {
  searchSkill: '',
  selectedSkills: [],
  selectedDomiciles: [],
};

export function normalizeTokens(value = '') {
  return value
    .split(',')
    .map((token) => token.trim())
    .filter((token) => token && token !== '...');
}

export function getEmployeeSkills(employee) {
  return normalizeTokens(employee?.skills || '');
}

export function getFilterSignature(filters) {
  return JSON.stringify({
    searchSkill: filters.searchSkill,
    selectedSkills: [...filters.selectedSkills].sort(),
    selectedDomiciles: [...filters.selectedDomiciles].sort(),
  });
}
