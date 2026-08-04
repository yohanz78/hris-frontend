function EmployeeRow({ employee, isExpanded, onToggleRow }) {
  return (
    <tr className="employee-row">
      <td>
        <div className="employee-card">
          <div className="avatar">{employee.row_number}</div>
          <div>
            <strong>{employee.full_name}</strong>
          </div>
        </div>
      </td>
      <td>
        <div className="cell-stack">
          <strong>{employee.email}</strong>
          <span>{employee.phone_number}</span>
        </div>
      </td>
      <td>{employee.domicile || '-'}</td>
      <td>
        <span className="preview-text">
          {employee.skills || 'No skills listed'}
        </span>
      </td>
      <td>
        <span className="portfolio-count">{employee.portofolios}</span>
      </td>
      <td>
        <button
          type="button"
          className={`expand-button ${isExpanded ? 'expand-button--active' : ''}`}
          onClick={() => onToggleRow(employee.id)}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </td>
    </tr>
  );
}

export default EmployeeRow;
