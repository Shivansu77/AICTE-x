import React, { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Type, Minimize2, CheckCircle, Loader, Globe } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme, setFontSize, setLanguage, setCompactMode, syncThemeWithBackend } from '../../store/themeSlice';

const AppearanceSection = ({ onUpdate }) => {
  const dispatch = useDispatch();
  const { theme, fontSize, language, compactMode } = useSelector((state) => state.theme);
  
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = async (key, value) => {
    setLoading(true);
    setSaved(false);
    
    try {
      switch (key) {
        case 'theme':
          dispatch(setTheme(value));
          break;
        case 'fontSize':
          dispatch(setFontSize(value));
          break;
        case 'language':
          dispatch(setLanguage(value));
          break;
        case 'compactMode':
          dispatch(setCompactMode(value));
          break;
      }
      
      // Sync with backend
      dispatch(syncThemeWithBackend({ 
        theme: key === 'theme' ? value : theme,
        fontSize: key === 'fontSize' ? value : fontSize,
        language: key === 'language' ? value : language,
        compactMode: key === 'compactMode' ? value : compactMode
      }));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to update appearance preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const themes = [
    { value: 'light', icon: Sun, label: 'Light', description: 'Bright and clear' },
    { value: 'dark', icon: Moon, label: 'Dark', description: 'Easy on the eyes' },
    { value: 'system', icon: Monitor, label: 'System', description: 'Match device settings' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', preview: 'Aa', size: 'text-xs' },
    { value: 'medium', label: 'Medium', preview: 'Aa', size: 'text-sm' },
    { value: 'large', label: 'Large', preview: 'Aa', size: 'text-base' }
  ];

  const languages = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'hi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'zh', label: '中文', flag: '🇨🇳' }
  ];

  return (
    <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-primary">Appearance</h3>
            <p className="text-secondary text-sm">Customize how the app looks</p>
          </div>
        </div>
        
        {(loading || saved) && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            saved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {loading ? (
              <><Loader className="animate-spin" size={14} /> Saving...</>
            ) : (
              <><CheckCircle size={14} /> Saved</>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-bold text-primary mb-3">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.value;
              
              return (
                <button
                  key={themeOption.value}
                  onClick={() => handleChange('theme', themeOption.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    isSelected
                      ? 'border-accent-blue bg-accent-blue/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-2 ${
                    isSelected ? 'bg-accent-blue text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon size={24} />
                  </div>
                  <div className={`font-bold ${isSelected ? 'text-accent-blue' : 'text-primary'}`}>
                    {themeOption.label}
                  </div>
                  <div className="text-xs text-secondary">{themeOption.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <Type size={16} /> Font Size
          </label>
          <div className="grid grid-cols-3 gap-3">
            {fontSizes.map((size) => {
              const isSelected = fontSize === size.value;
              
              return (
                <button
                  key={size.value}
                  onClick={() => handleChange('fontSize', size.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-accent-blue bg-accent-blue/5'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`font-bold mb-1 ${size.size} ${isSelected ? 'text-accent-blue' : 'text-gray-600'}`}>
                    {size.preview}
                  </div>
                  <div className={`text-sm font-medium ${isSelected ? 'text-accent-blue' : 'text-primary'}`}>
                    {size.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <Globe size={16} /> Language
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {languages.map((lang) => {
              const isSelected = language === lang.value;
              
              return (
                <button
                  key={lang.value}
                  onClick={() => handleChange('language', lang.value)}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-accent-blue bg-accent-blue/5'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`font-medium ${isSelected ? 'text-accent-blue' : 'text-primary'}`}>
                    {lang.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact Mode */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Minimize2 size={18} className="text-gray-600" />
              </div>
              <div>
                <span className="font-bold text-primary block">Compact Mode</span>
                <span className="text-xs text-secondary">Reduce spacing for more content</span>
              </div>
            </div>
            
            {/* Toggle Switch */}
            <div className="relative">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={() => handleChange('compactMode', !compactMode)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${
                compactMode ? 'bg-accent-blue' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform absolute top-0.5 ${
                  compactMode ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};

export default AppearanceSection;
