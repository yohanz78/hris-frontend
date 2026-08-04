function TopNavbar({ stats, expandedRowId }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">HRIS System</p>
        <h1>Employee dashboard</h1>
        <p className="subtitle">
          Search, filter, and expand employee records without leaving the table.
        </p>
      </div>
      <div className="summary-grid">
        <article>
          <span>Employees</span>
          <strong>{stats.totalEmployees}</strong>
        </article>
        <article>
          <span>Filtered</span>
          <strong>{stats.filteredEmployees}</strong>
        </article>
        <article>
          <span>Open row</span>
          <strong>{expandedRowId ?? 'None'}</strong>
        </article>
      </div>
    </header>
  );
}

export default TopNavbar;
