import { useState } from 'react';

const DEFAULT_COMPETENCE = {
  type: 'certificate',
  topic: '',
  description: '',
};

function CompetenceBuilder({ onAddCompetence }) {
  const [currentCompetence, setCurrentCompetence] =
    useState(DEFAULT_COMPETENCE);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [skillInputText, setSkillInputText] = useState('');

  function updateCompetenceField(field, value) {
    setCurrentCompetence((currentValue) => ({
      ...currentValue,
      [field]: value,
    }));
  }

  function addSkill() {
    const nextSkill = skillInputText.trim();

    if (!nextSkill || currentSkills.includes(nextSkill)) {
      setSkillInputText('');
      return;
    }

    setCurrentSkills((currentValue) => [...currentValue, nextSkill]);
    setSkillInputText('');
  }

  function removeSkill(skill) {
    setCurrentSkills((currentValue) =>
      currentValue.filter((currentSkill) => currentSkill !== skill)
    );
  }

  function addCompetence() {
    if (
      !currentCompetence.topic.trim() ||
      !currentCompetence.description.trim()
    ) {
      return;
    }

    onAddCompetence({
      ...currentCompetence,
      skills: currentSkills.join(', '),
    });

    setCurrentCompetence(DEFAULT_COMPETENCE);
    setCurrentSkills([]);
    setSkillInputText('');
  }

  return (
    <section className="form-card">
      <div className="form-card__header">
        <div>
          <p className="section-label">Competence builder</p>
          <h2>Add portfolio items</h2>
        </div>
      </div>

      <div className="form-grid form-grid--builder">
        <label className="field">
          <span>Type *</span>
          <select
            value={currentCompetence.type}
            onChange={(event) =>
              updateCompetenceField('type', event.target.value)
            }
          >
            <option value="certificate">Certificate</option>
            <option value="project">Project</option>
          </select>
        </label>

        <label className="field field--full">
          <span>Topic *</span>
          <input
            type="text"
            value={currentCompetence.topic}
            onChange={(event) =>
              updateCompetenceField('topic', event.target.value)
            }
            placeholder="Blogging Tool"
          />
        </label>

        <label className="field field--full">
          <span>Description *</span>
          <textarea
            rows="4"
            value={currentCompetence.description}
            onChange={(event) =>
              updateCompetenceField('description', event.target.value)
            }
            placeholder="Short description of the portfolio item"
          />
        </label>
      </div>

      <div className="skill-builder">
        <label className="field field--flex">
          <span>Add skills</span>
          <div className="skill-builder__input">
            <input
              type="text"
              value={skillInputText}
              onChange={(event) => setSkillInputText(event.target.value)}
              placeholder="React"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addSkill();
                }
              }}
            />
            <button
              type="button"
              className="secondary-button"
              onClick={addSkill}
            >
              Add
            </button>
          </div>
        </label>

        <div className="chip-row">
          {currentSkills.length > 0 ? (
            currentSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                className="chip chip--removable"
                onClick={() => removeSkill(skill)}
                aria-label={`Remove ${skill}`}
              >
                {skill}
                <span aria-hidden="true">×</span>
              </button>
            ))
          ) : (
            <p className="empty-state">No skills added yet.</p>
          )}
        </div>
      </div>

      <div className="form-actions form-actions--builder">
        <button
          type="button"
          className="primary-button"
          onClick={addCompetence}
        >
          Add competence
        </button>
      </div>
    </section>
  );
}

export default CompetenceBuilder;
