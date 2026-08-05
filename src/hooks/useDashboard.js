import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchEmployeeDetail, fetchEmployees } from '../services/hrisApi';
import {
  DEFAULT_FILTERS,
  getEmployeeSkills,
  getFilterSignature,
} from '../utils/dashboard';

export function useDashboard() {
  const [employeesList, setEmployeesList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [employeeDetailCache, setEmployeeDetailCache] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const detailInFlightRef = useRef(new Set());
  const filterSignatureRef = useRef('');

  useEffect(() => {
    let isActive = true;

    async function loadInitialEmployees() {
      try {
        setIsLoading(true);
        setError('');

        const employees = await fetchEmployees();

        if (!isActive) {
          return;
        }

        setEmployeesList(employees);
        setFilteredList(employees);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError.message || 'Unable to load employees.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadInitialEmployees();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    async function loadEmployeeDetail() {
      if (!expandedRowId || employeeDetailCache[expandedRowId]) {
        return;
      }

      if (detailInFlightRef.current.has(expandedRowId)) {
        return;
      }

      detailInFlightRef.current.add(expandedRowId);
      setIsDetailLoading(true);
      setError('');

      try {
        const detail = await fetchEmployeeDetail(expandedRowId);

        setEmployeeDetailCache((currentCache) => ({
          ...currentCache,
          [expandedRowId]: detail,
        }));
      } catch (detailError) {
        setError(detailError.message || 'Unable to load employee detail.');
      } finally {
        detailInFlightRef.current.delete(expandedRowId);
        setIsDetailLoading(false);
      }
    }

    loadEmployeeDetail();
  }, [employeeDetailCache, expandedRowId]);

  // useEffect(() => {
  //   console.log('EmplyeesList:', employeesList);
  // }, [employeesList]);

  const availableSkills = useMemo(() => {
    const skills = new Set();

    employeesList.forEach((employee) => {
      getEmployeeSkills(employee).forEach((skill) => skills.add(skill));
    });

    return Array.from(skills).sort((a, b) => a.localeCompare(b));
  }, [employeesList]);

  const availableDomiciles = useMemo(() => {
    const domiciles = new Set();

    employeesList.forEach((employee) => {
      if (employee?.domicile) {
        domiciles.add(employee.domicile);
      }
    });

    return Array.from(domiciles).sort((a, b) => a.localeCompare(b));
  }, [employeesList]);

  async function applyFilters(nextFilters) {
    setFilters(nextFilters);

    if (!employeesList.length) {
      return;
    }

    const nextSignature = getFilterSignature(nextFilters);

    if (filterSignatureRef.current === nextSignature) {
      return;
    }

    filterSignatureRef.current = nextSignature;

    const hasAnyFilter =
      nextFilters.searchSkill.trim().length > 0 ||
      nextFilters.selectedSkills.length > 0 ||
      nextFilters.selectedDomiciles.length > 0;

    if (!hasAnyFilter) {
      setFilteredList(employeesList);
      return;
    }

    try {
      setIsFiltering(true);
      setError('');

      const employees = await fetchEmployees(nextFilters);

      // ✅ only apply this response if it's still the latest requested filter
      if (filterSignatureRef.current !== nextSignature) return;

      setFilteredList(employees);
      setExpandedRowId((currentExpandedRowId) =>
        employees.some((employee) => employee.id === currentExpandedRowId)
          ? currentExpandedRowId
          : null
      );
    } catch (filterError) {
      setError(filterError.message || 'Unable to filter employees.');
    } finally {
      setIsFiltering(false);
    }
  }

  const searchDebounceRef = useRef(null);

  function handleSearchSkillChange(event) {
    const value = event.target.value;

    // update the input immediately so typing feels responsive
    setFilters((current) => ({ ...current, searchSkill: value }));

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      applyFilters({ ...filters, searchSkill: value });
    }, 300);
  }

  function handleSkillToggle(skill) {
    const nextSelectedSkills = filters.selectedSkills.includes(skill)
      ? filters.selectedSkills.filter((currentSkill) => currentSkill !== skill)
      : [...filters.selectedSkills, skill];

    applyFilters({
      ...filters,
      selectedSkills: nextSelectedSkills,
    });
  }

  function handleDomicileToggle(domicile) {
    const nextSelectedDomiciles = filters.selectedDomiciles.includes(domicile)
      ? filters.selectedDomiciles.filter(
          (currentDomicile) => currentDomicile !== domicile
        )
      : [...filters.selectedDomiciles, domicile];

    applyFilters({
      ...filters,
      selectedDomiciles: nextSelectedDomiciles,
    });
  }

  function handleSearchSkillChange(event) {
    applyFilters({
      ...filters,
      searchSkill: event.target.value,
    });
  }

  function handleClearFilters() {
    filterSignatureRef.current = '';
    setFilters(DEFAULT_FILTERS);
    setFilteredList(employeesList);
  }

  function handleToggleRow(employeeId) {
    setExpandedRowId((currentExpandedRowId) =>
      currentExpandedRowId === employeeId ? null : employeeId
    );
  }

  return {
    employeesList,
    filteredList,
    filters,
    expandedRowId,
    employeeDetailCache,
    isLoading,
    isFiltering,
    isDetailLoading,
    error,
    availableSkills,
    availableDomiciles,
    stats: {
      totalEmployees: employeesList.length,
      filteredEmployees: filteredList.length,
    },
    handleSkillToggle,
    handleDomicileToggle,
    handleSearchSkillChange,
    handleClearFilters,
    handleToggleRow,
  };
}
