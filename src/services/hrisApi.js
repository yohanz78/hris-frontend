import { requestJson } from './api';

function buildQueryString(filters = {}) {
  const params = new URLSearchParams();

  const selectedSkills = Array.isArray(filters.selectedSkills)
    ? filters.selectedSkills.filter(Boolean)
    : [];
  const selectedDomiciles = Array.isArray(filters.selectedDomiciles)
    ? filters.selectedDomiciles.filter(Boolean)
    : [];

  const skillTokens = [filters.searchSkill, ...selectedSkills].filter(Boolean);
  const domicileTokens = selectedDomiciles.filter(Boolean);

  if (skillTokens.length > 0) {
    params.set('skill', [...new Set(skillTokens)].join(','));
  }

  if (domicileTokens.length > 0) {
    params.set('domicile', [...new Set(domicileTokens)].join(','));
  }

  const queryString = params.toString();

  return queryString ? `?${queryString}` : '';
}

export async function fetchEmployees(filters = {}) {
  const queryString = buildQueryString(filters);
  const data = await requestJson(`/dashboard${queryString}`);

  return Array.isArray(data?.employees) ? data.employees : [];
}

export async function fetchEmployeeDetail(id) {
  const data = await requestJson(`/employee-detail/${id}`);

  return data;
}

export async function createEmployee(payload) {
  return requestJson('/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
