import TopNavbar from '../components/TopNavbar';
import FilterSidebar from '../components/FilterSidebar';
import EmployeeTable from '../components/EmployeeTable';
import AppHeader from '../components/AppHeader';

import { useDashboard } from '../hooks/useDashboard';

function Dashboard() {
  const dashboard = useDashboard();

  return (
    <div className="page-shell">
      <AppHeader />
      <div className="dashboard-shell">
        <TopNavbar
          stats={dashboard.stats}
          expandedRowId={dashboard.expandedRowId}
        />

        <main className="dashboard-grid">
          <FilterSidebar
            filters={dashboard.filters}
            availableSkills={dashboard.availableSkills}
            availableDomiciles={dashboard.availableDomiciles}
            isFiltering={dashboard.isFiltering}
            onSearchSkillChange={dashboard.handleSearchSkillChange}
            onSkillToggle={dashboard.handleSkillToggle}
            onDomicileToggle={dashboard.handleDomicileToggle}
            onClearFilters={dashboard.handleClearFilters}
          />

          <section className="content-panel">
            <div className="content-panel__header">
              <div>
                <p className="section-label">Employee roster</p>
                <h2>Overview</h2>
              </div>
              <div className="content-panel__meta">
                <span>
                  {dashboard.isLoading
                    ? 'Loading employees'
                    : `${dashboard.filteredList.length} results`}
                </span>
              </div>
            </div>

            {dashboard.error ? (
              <div className="alert">{dashboard.error}</div>
            ) : null}

            <EmployeeTable
              employees={dashboard.filteredList}
              expandedRowId={dashboard.expandedRowId}
              employeeDetailCache={dashboard.employeeDetailCache}
              isDetailLoading={dashboard.isDetailLoading}
              onToggleRow={dashboard.handleToggleRow}
            />
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
