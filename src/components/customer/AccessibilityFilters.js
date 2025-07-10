import React from 'react';

const AccessibilityFilters = ({ filters, onChange }) => (
  <div style={{ margin: '1rem 0' }}>
    <h3>Accessibility Options</h3>
    <label>
      <input type="checkbox" name="wheelchair" checked={filters.wheelchair} onChange={onChange} />
      Wheelchair Access
    </label>
    <label style={{ marginLeft: '1rem' }}>
      <input type="checkbox" name="largeText" checked={filters.largeText} onChange={onChange} />
      Large Text
    </label>
    <label style={{ marginLeft: '1rem' }}>
      <input type="checkbox" name="audioAssistance" checked={filters.audioAssistance} onChange={onChange} />
      Audio Assistance
    </label>
    {/* Add more filters as needed */}
  </div>
);

export default AccessibilityFilters; 