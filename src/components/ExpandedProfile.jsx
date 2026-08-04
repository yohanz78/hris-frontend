function ExpandedProfile({ employee, employeeDetail, isDetailLoading }) {
  if (isDetailLoading && !employeeDetail) {
    return (
      <tr className="expanded-row">
        <td colSpan="6">
          <div className="expanded-panel expanded-panel--loading">
            Loading employee detail...
          </div>
        </td>
      </tr>
    );
  }

  if (!employeeDetail) {
    return (
      <tr className="expanded-row">
        <td colSpan="6">
          <div className="expanded-panel">
            Employee detail is not available yet.
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="expanded-row">
      <td colSpan="6">
        <div className="expanded-panel">
          <div className="expanded-panel__summary">
            <div>
              <p className="section-label">Expanded profile</p>
              <h3>{employeeDetail.full_name}</h3>
              <p>{employeeDetail.email}</p>
            </div>
            <div className="profile-pill-group">
              <span className="profile-pill">
                {employeeDetail.domicile || employee.domicile || 'Unknown'}
              </span>
              <span className="profile-pill">
                {employeeDetail.competences?.skills?.length || 0} skills
              </span>
              <span className="profile-pill">
                {employeeDetail.portofolios?.length || 0} portofolios
              </span>
            </div>
          </div>

          <div className="detail-sections">
            <section>
              <h4>Skills</h4>
              <div className="chip-list chip-list--compact">
                {employeeDetail.competences?.skills?.length > 0 ? (
                  employeeDetail.competences.skills.map((skill) => (
                    <span key={skill} className="chip chip--static">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="empty-state">No skills returned by the API.</p>
                )}
              </div>
            </section>

            <section>
              <h4>Portofolios</h4>
              {employeeDetail.portofolios?.length > 0 ? (
                <div className="portfolio-list">
                  {employeeDetail.portofolios.map((item) => (
                    <article key={item.id} className="portfolio-card">
                      <div className="portfolio-card__meta">
                        <strong>{item.topic}</strong>
                        <span>{item.type}</span>
                      </div>
                      <p>{item.description}</p>
                      <small>{item.skills}</small>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="empty-state">
                  No portofolios returned by the API.
                </p>
              )}
            </section>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default ExpandedProfile;
