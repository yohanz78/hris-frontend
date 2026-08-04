import EmployeeRow from './EmployeeRow';
import ExpandedProfile from './ExpandedProfile';

function EmployeeTable({
  employees,
  expandedRowId,
  employeeDetailCache,
  isDetailLoading,
  onToggleRow,
}) {
  if (!employees.length) {
    return (
      <div className="empty-table">No employees match the current filters.</div>
    );
  }

  return (
    <div className="table-shell">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Contact</th>
              <th>Domicile</th>
              <th>Skills</th>
              <th>Portofolios</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const isExpanded = expandedRowId === employee.id;
              const employeeDetail = employeeDetailCache[employee.id];

              return (
                <EmployeeFragment
                  key={employee.id}
                  employee={employee}
                  isExpanded={isExpanded}
                  employeeDetail={employeeDetail}
                  isDetailLoading={isDetailLoading}
                  onToggleRow={onToggleRow}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeFragment({
  employee,
  isExpanded,
  employeeDetail,
  isDetailLoading,
  onToggleRow,
}) {
  return (
    <>
      <EmployeeRow
        employee={employee}
        isExpanded={isExpanded}
        onToggleRow={onToggleRow}
      />
      {isExpanded ? (
        <ExpandedProfile
          employee={employee}
          employeeDetail={employeeDetail}
          isDetailLoading={isDetailLoading}
        />
      ) : null}
    </>
  );
}

export default EmployeeTable;
