function FilterSidebar({
  filters,
  availableSkills,
  availableDomiciles,
  isFiltering,
  onSearchSkillChange,
  onSkillToggle,
  onDomicileToggle,
  onClearFilters,
}) {
  return (
    <aside className="filter-panel">
      <div className="filter-panel__header">
        <div>
          <h2>Filters</h2>
        </div>
        <button type="button" className="text-button" onClick={onClearFilters}>
          Clear
        </button>
      </div>

      <label className="search-field">
        <span>Search skill</span>
        <input
          type="text"
          value={filters.searchSkill}
          onChange={onSearchSkillChange}
          placeholder="Ex. JavaScript, Java"
        />
      </label>

      <section className="filter-group">
        <h3>Skills</h3>
        <div className="chip-list">
          {availableSkills.length > 0 ? (
            availableSkills.map((skill) => {
              const isActive =
                filters.selectedSkills.includes(skill) ||
                filters.searchSkill.toLowerCase() === skill.toLowerCase();

              return (
                <button
                  key={skill}
                  type="button"
                  className={`chip ${isActive ? 'chip--active' : ''}`}
                  onClick={() => onSkillToggle(skill)}
                >
                  {skill}
                </button>
              );
            })
          ) : (
            <p className="empty-state">No skills available yet.</p>
          )}
        </div>
      </section>

      <section className="filter-group">
        <h3>Domicile</h3>
        <div className="checkbox-list">
          {availableDomiciles.length > 0 ? (
            availableDomiciles.map((domicile) => {
              const isChecked = filters.selectedDomiciles.includes(domicile);

              return (
                <label key={domicile} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onDomicileToggle(domicile)}
                  />
                  <span>{domicile}</span>
                </label>
              );
            })
          ) : (
            <p className="empty-state">No domiciles available yet.</p>
          )}
        </div>
      </section>

      <div className="filter-panel__footer">
        <span>{isFiltering ? 'Refreshing data...' : 'Ready'}</span>
      </div>
    </aside>
  );
}

export default FilterSidebar;
