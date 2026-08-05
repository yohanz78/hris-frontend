import { useRef, useState } from 'react';
import AppHeader from '../components/AppHeader';
import DocumentDropzone from '../components/DocumentDropzone';
import EmployeeBaseForm from '../components/EmployeeBaseForm';
import CompetenceBuilder from '../components/CompetenceBuilder';
import CompetenceTable from '../components/CompetenceTable';
import { createEmployee, extractDocument } from '../services/hrisApi';

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
  const [isExtracting, setIsExtracting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [extractionError, setExtractionError] = useState('');
  const builderRef = useRef(null);

  function handleEmployeeFieldChange(field, value) {
    setEmployeeData((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
  }

  function handleSaveCompetence(competence) {
    setCompetencesList((currentValue) => {
      if (editingIndex === null) {
        return [...currentValue, competence];
      }

      return currentValue.map((currentCompetence, index) =>
        index === editingIndex ? competence : currentCompetence
      );
    });

    setEditingIndex(null);
    setErrorMessage('');
    setSuccessMessage('');
  }

  function applyExtractedEmployee(extractedEmployee) {
    setEmployeeData({
      full_name: extractedEmployee.full_name || '',
      email: extractedEmployee.email || '',
      phone_number: extractedEmployee.phone_number || '',
      domicile: extractedEmployee.domicile || '',
    });

    setCompetencesList(
      Array.isArray(extractedEmployee.competences)
        ? extractedEmployee.competences.map((competence) => ({
            type: competence.type || 'Certificate',
            topic: competence.topic || '',
            description: competence.description || '',
            skills: competence.skills || '',
          }))
        : []
    );

    setEditingIndex(null);
  }

  async function handleExtractDocument(file) {
    const formData = new FormData();
    formData.append('document', file);

    setIsExtracting(true);
    setExtractionError('');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await extractDocument(formData);
      const extractedEmployee = result?.extracted_employee;

      if (!extractedEmployee) {
        throw new Error('The backend did not return extracted employee data.');
      }

      applyExtractedEmployee(extractedEmployee);
    } catch (extractError) {
      setExtractionError(
        extractError.message || 'Unable to extract data from the document.'
      );
    } finally {
      setIsExtracting(false);
    }
  }

  function handleRemoveCompetence(indexToRemove) {
    setCompetencesList((currentValue) =>
      currentValue.filter((_, index) => index !== indexToRemove)
    );

    if (editingIndex === indexToRemove) {
      setEditingIndex(null);
      return;
    }

    if (editingIndex !== null && editingIndex > indexToRemove) {
      setEditingIndex(editingIndex - 1);
    }
  }

  function handleEditCompetence(indexToEdit) {
    setEditingIndex(indexToEdit);
    builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleCancelEditing() {
    setEditingIndex(null);
  }

  function resetForm() {
    setEmployeeData(DEFAULT_EMPLOYEE_DATA);
    setCompetencesList([]);
    setEditingIndex(null);
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
    setExtractionError('');

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
        {extractionError ? (
          <div className="alert">{extractionError}</div>
        ) : null}

        <form className="upload-form" onSubmit={handleSubmit}>
          <DocumentDropzone
            isExtracting={isExtracting}
            onExtractDocument={handleExtractDocument}
          />

          <EmployeeBaseForm
            employeeData={employeeData}
            onFieldChange={handleEmployeeFieldChange}
          />

          <div ref={builderRef}>
            <CompetenceBuilder
              editingIndex={editingIndex}
              editingCompetence={
                editingIndex !== null ? competencesList[editingIndex] : null
              }
              onSaveCompetence={handleSaveCompetence}
              onCancelEditing={handleCancelEditing}
            />
          </div>

          <CompetenceTable
            competencesList={competencesList}
            editingIndex={editingIndex}
            onEditCompetence={handleEditCompetence}
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
