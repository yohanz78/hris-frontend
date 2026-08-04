function EmployeeBaseForm({ employeeData, onFieldChange }) {
  return (
    <section className="form-card">
      <div className="form-card__header">
        <div>
          <p className="section-label">Employee profile</p>
          <h2>Base information</h2>
        </div>
        <span className="form-card__hint">
          Required fields are marked with *
        </span>
      </div>

      <div className="form-grid form-grid--base">
        <label className="field">
          <span>Full name *</span>
          <input
            type="text"
            value={employeeData.full_name}
            onChange={(event) => onFieldChange('full_name', event.target.value)}
            placeholder="Yohanes Handoyo"
          />
        </label>

        <label className="field">
          <span>Email *</span>
          <input
            type="email"
            value={employeeData.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            placeholder="yohanes@email.com"
          />
        </label>

        <label className="field">
          <span>Phone number</span>
          <input
            type="text"
            value={employeeData.phone_number}
            onChange={(event) =>
              onFieldChange('phone_number', event.target.value)
            }
            placeholder="0851-2345-67890"
          />
        </label>

        <label className="field">
          <span>Domicile</span>
          <input
            type="text"
            value={employeeData.domicile}
            onChange={(event) => onFieldChange('domicile', event.target.value)}
            placeholder="Jakarta Barat"
          />
        </label>
      </div>
    </section>
  );
}

export default EmployeeBaseForm;
