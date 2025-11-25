import React from 'react';
import styles from './LicenseTerms.module.css';

function LicenseTerms({ selectedTerm, onSelectTerm, disabled }) {
  const terms = [
    { value: '1 Year', label: '1 Year', description: 'Annual subscription' },
    { value: '3 Years', label: '3 Years', description: 'Best for mid-term planning' },
    { value: '5 Years', label: '5 Years', description: 'Maximum savings' },
  ];

  return (
    <section className={`${styles.section} ${disabled ? styles.disabled : ''}`}>
      <h2>Select Your License Term</h2>
      <p>
        Choose how long you want your security subscription to last. Longer terms offer better value and uninterrupted protection.
      </p>
      {disabled && (
        <div className={styles.disabledNotice}>
          <span>⚠️</span> License terms are not applicable when purchasing appliance only.
        </div>
      )}
      <div className={styles.termsGrid}>
        {terms.map((term) => (
          <button
            key={term.value}
            type="button"
            className={`${styles.termCard} ${selectedTerm === term.value ? styles.selected : ''}`}
            onClick={() => !disabled && onSelectTerm && onSelectTerm(term.value)}
            disabled={disabled}
          >
            <span className={styles.termLabel}>{term.label}</span>
            <span className={styles.termDesc}>{term.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default LicenseTerms;
