function CompetenceTable({ competencesList, onRemoveCompetence }) {
  return (
    <section className="form-card">
      <div className="form-card__header">
        <div>
          <p className="section-label">Preview table</p>
          <h2>Added competences</h2>
        </div>
      </div>

      {competencesList.length > 0 ? (
        <div className="table-shell table-shell--compact">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Topic</th>
                  <th>Description</th>
                  <th>Skills</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {competencesList.map((competence, index) => (
                  <tr key={`${competence.topic}-${index}`}>
                    <td>{competence.type}</td>
                    <td>{competence.topic}</td>
                    <td className="table-cell--description">
                      {competence.description}
                    </td>
                    <td>{competence.skills}</td>
                    <td>
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => onRemoveCompetence(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="empty-table">No competences have been added yet.</div>
      )}
    </section>
  );
}

export default CompetenceTable;
