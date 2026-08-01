import React, { useState } from 'react';
import { CURRENCIES, THEMES } from '../../utils/constants';

const ProfileForm = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    preferences: {
      currency: user?.preferences?.currency || 'USD',
      theme: user?.preferences?.theme || 'light',
    },
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // This would call an API to update the profile
    // The actual API call is handled in the parent component (Profile page)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess(formData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.')) {
      const key = name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          minLength="2"
          maxLength="100"
          className="input-field"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Preferred Currency
        </label>
        <select
          name="preferences.currency"
          value={formData.preferences.currency}
          onChange={handleChange}
          className="input-field"
        >
          {CURRENCIES.map((curr) => (
            <option key={curr} value={curr}>{curr}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          This will be used as your default currency throughout the app
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Theme Preference
        </label>
        <select
          name="preferences.theme"
          value={formData.preferences.theme}
          onChange={handleChange}
          className="input-field"
        >
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;