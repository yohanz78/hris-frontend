import { useRef, useState } from 'react';

function DocumentDropzone({ isExtracting, onExtractDocument }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files) {
    const documentFile = files?.[0];

    if (documentFile) {
      onExtractDocument(documentFile);
    }
  }

  return (
    <section
      className={`dropzone ${isDragging ? 'dropzone--active' : ''} ${isExtracting ? 'dropzone--loading' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-busy={isExtracting}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      <div className="dropzone__content">
        <p className="section-label">Feature 03</p>
        <h2>{isExtracting ? 'Parsing document...' : 'Drop CV / resume file here'}</h2>
        <p>
          Upload a PDF or Word file to auto-fill the employee form and competence table below.
        </p>
        <button type="button" className="secondary-button" disabled={isExtracting}>
          {isExtracting ? 'Processing...' : 'Choose file'}
        </button>
      </div>

      {isExtracting ? <div className="dropzone__overlay" /> : null}
    </section>
  );
}

export default DocumentDropzone;