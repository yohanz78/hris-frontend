import { useState } from 'react';
import AppHeader from '../components/AppHeader';
import EmployeeBaseForm from '../components/EmployeeBaseForm';
import CompetenceBuilder from '../components/CompetenceBuilder';
import CompetenceTable from '../components/CompetenceTable';
import { createEmployee } from '../services/hrisApi';

const DEFAULT_EMPLOYEE_DATA = {
  full_name: '',
  email: '',
  phone_number: '',
  domicile: '',
};

function UploadData() {
  const [employeeData, setEmployeeData] = useState(DEFAULT_EMPLOYEE_DATA);
  const [competencesList, setCompetencesList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleEmployeeFieldChange(field, value) {
    setEmployeeData((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
  }

  function handleAddCompetence(competence) {
    setCompetencesList((currentValue) => [...currentValue, competence]);
    setErrorMessage('');
    setSuccessMessage('');
  }

  function handleRemoveCompetence(indexToRemove) {
    setCompetencesList((currentValue) =>
      currentValue.filter((_, index) => index !== indexToRemove)
    );
  }

  function resetForm() {
    setEmployeeData(DEFAULT_EMPLOYEE_DATA);
    setCompetencesList([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!employeeData.email.trim()) {
      setErrorMessage(
        'Email is required before submitting the employee profile.'
      );
      return;
    }

    if (competencesList.length === 0) {
      setErrorMessage('Add at least one competence before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        ...employeeData,
        competences: competencesList,
      };

      const result = await createEmployee(payload);
      const message = result?.message || 'Employee data uploaded successfully.';

      setSuccessMessage(message);
      resetForm();
    } catch (submitError) {
      setErrorMessage(submitError.message || 'Unable to upload employee data.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <AppHeader />

      <main className="upload-shell">
        <section className="upload-hero">
          <div>
            <p className="eyebrow">Feature 02</p>
            <h1>Upload employee data</h1>
            <p className="subtitle">
              Build an employee profile, add one or more competences, then
              submit the bundle to the backend in a single request.
            </p>
          </div>

          <div className="upload-hero__stats">
            <article>
              <span>Competences</span>
              <strong>{competencesList.length}</strong>
            </article>
            <article>
              <span>Status</span>
              <strong>{isSubmitting ? 'Submitting' : 'Draft'}</strong>
            </article>
          </div>
        </section>

        {successMessage ? (
          <div className="success-banner">{successMessage}</div>
        ) : null}
        {errorMessage ? <div className="alert">{errorMessage}</div> : null}

        <form className="upload-form" onSubmit={handleSubmit}>
          <EmployeeBaseForm
            employeeData={employeeData}
            onFieldChange={handleEmployeeFieldChange}
          />

          <CompetenceBuilder onAddCompetence={handleAddCompetence} />

          <CompetenceTable
            competencesList={competencesList}
            onRemoveCompetence={handleRemoveCompetence}
          />

          <div className="form-actions form-actions--submit">
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit employee data'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default UploadData;
