import React from 'react';
import { FileText, GitCompare, Bot, Sparkles } from 'lucide-react';

const DiffPanel = ({ selectedReq, baseline, aiSyllabus }) => {
  const proposedUnits = selectedReq?.proposedChanges?.units || [];
  const currentUnits = baseline?.units || [];

  const findCurrentUnit = (unit) => {
    if (!unit) return null;
    if (unit._id) {
      const match = currentUnits.find((c) => c._id === unit._id);
      if (match) return match;
    }
    return currentUnits.find(
      (c) => (c.unitNumber && c.unitNumber === unit.unitNumber) || (c.title && c.title === unit.title)
    );
  };

  const newUnits = proposedUnits.filter((u) => !findCurrentUnit(u));
  const updatedUnits = proposedUnits
    .map((u) => ({ unit: u, current: findCurrentUnit(u) }))
    .filter(({ current }) => current);

  const normalize = (value = '') => String(value).trim().toLowerCase();
  const normalizeArray = (arr = []) => arr.map((item) => normalize(item)).filter(Boolean);

  const getTopicDelta = (unit, current) => {
    const currentTopics = current?.topics || [];
    const proposedTopics = unit?.topics || [];
    const currentNormalized = new Set(normalizeArray(currentTopics));
    const proposedNormalized = new Set(normalizeArray(proposedTopics));

    const addedTopics = proposedTopics.filter((topic) => !currentNormalized.has(normalize(topic)));
    const removedTopics = currentTopics.filter((topic) => !proposedNormalized.has(normalize(topic)));

    return { addedTopics, removedTopics };
  };

  const getTopicDetailsDelta = (unit, current) => {
    const proposedDetails = unit?.topicDetails || {};
    const currentDetails = current?.topicDetails || {};

    const normalizeKey = (key) => normalize(key);
    const currentKeyMap = Object.keys(currentDetails).reduce((map, key) => {
      map[normalizeKey(key)] = key;
      return map;
    }, {});

    return Object.keys(proposedDetails).reduce((acc, key) => {
      const normalizedKey = normalizeKey(key);
      const currentKey = currentKeyMap[normalizedKey];
      const proposedItems = Array.isArray(proposedDetails[key]) ? proposedDetails[key] : [];
      const currentItems = currentKey && Array.isArray(currentDetails[currentKey]) ? currentDetails[currentKey] : [];

      const currentNormalized = new Set(normalizeArray(currentItems));
      const addedItems = proposedItems.filter((item) => !currentNormalized.has(normalize(item)));

      if (addedItems.length > 0) {
        acc.push({ topic: key, items: addedItems });
      }

      return acc;
    }, []);
  };

  const renderTopics = (topics = [], variant = 'default') => {
    const variants = {
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
      green: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
    };
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {topics.map((t) => (
          <span key={t} className={`px-2.5 py-1 rounded-full text-xs font-bold ${variants[variant]}`}>
            {t}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`p-6 lg:p-8 grid grid-cols-1 ${aiSyllabus?.units?.length ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
      {/* Current Curriculum Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-gray-500 dark:text-gray-400" />
            <h5 className="font-black text-gray-900 dark:text-gray-100">Current Curriculum</h5>
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">Baseline</span>
        </div>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          {currentUnits.length === 0 ? (
            <div className="text-xs text-gray-400 dark:text-gray-500 italic">Baseline not available.</div>
          ) : (
            currentUnits.map((unit) => (
              <div key={unit._id || unit.title} className="p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="font-bold text-gray-900 dark:text-gray-100">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                {renderTopics(unit.topics)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Proposed Changes Panel */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitCompare size={16} className="text-emerald-500" />
            <h5 className="font-black text-gray-900 dark:text-gray-100">Proposed Changes</h5>
          </div>
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">Diff</span>
        </div>

        <div className="space-y-5">
          {newUnits.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                <Sparkles size={12} /> New Units
              </div>
              <div className="space-y-3">
                {newUnits.map((unit) => (
                  <div key={unit._id || unit.title} className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400">New</span>
                    </div>
                    {renderTopics(unit.topics, 'green')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {updatedUnits.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2">Updated Units</div>
              <div className="space-y-3">
                {updatedUnits.map(({ unit, current }) => {
                  const { addedTopics, removedTopics } = getTopicDelta(unit, current);
                  const addedDetails = getTopicDetailsDelta(unit, current);
                  const hasTopicDelta = addedTopics.length > 0 || removedTopics.length > 0;
                  const hasDetailDelta = addedDetails.length > 0;
                  const hoursChanged = typeof unit.hours === 'number' && unit.hours !== current?.hours;
                  const titleChanged = unit.title && current?.title && unit.title !== current.title;

                  if (!hasTopicDelta && !hasDetailDelta && !hoursChanged && !titleChanged) {
                    return null;
                  }

                  return (
                    <div key={unit._id || unit.title} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                      <div className="font-bold text-blue-900 dark:text-blue-300">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                      {titleChanged && (
                        <div className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                          Title changed from <span className="font-bold">{current?.title}</span>
                        </div>
                      )}
                      {hoursChanged && (
                        <div className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                          Hours changed from <span className="font-bold">{current?.hours || 0}</span> to <span className="font-bold">{unit.hours}</span>
                        </div>
                      )}
                      {(hasTopicDelta || hasDetailDelta) ? (
                        <div className="mt-2 space-y-3">
                          {addedTopics.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">Added Topics</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {addedTopics.map((t) => (
                                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                                    + {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {removedTopics.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Removed Topics</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {removedTopics.map((t) => (
                                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                                    - {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {addedDetails.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Added Topic Details</div>
                              <div className="mt-2 space-y-2">
                                {addedDetails.map((detail) => (
                                  <div key={detail.topic} className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-2">
                                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{detail.topic}</div>
                                    <ul className="mt-1 text-xs text-emerald-800 dark:text-emerald-300 list-disc list-inside space-y-1">
                                      {detail.items.map((item) => (
                                        <li key={item}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-blue-700 dark:text-blue-400 mt-2">No topic-level changes detected.</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {newUnits.length === 0 && updatedUnits.filter(({ unit, current }) => {
            const { addedTopics, removedTopics } = getTopicDelta(unit, current);
            const addedDetails = getTopicDetailsDelta(unit, current);
            const hoursChanged = typeof unit.hours === 'number' && unit.hours !== current?.hours;
            const titleChanged = unit.title && current?.title && unit.title !== current.title;
            return addedTopics.length > 0 || removedTopics.length > 0 || addedDetails.length > 0 || hoursChanged || titleChanged;
          }).length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">No meaningful changes detected.</div>
          )}
        </div>
      </div>

      {/* AI Recommended Syllabus Panel */}
      {aiSyllabus?.units?.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-indigo-500" />
              <h5 className="font-black text-gray-900 dark:text-gray-100">AI Recommended Syllabus</h5>
            </div>
            <span className="text-[10px] uppercase font-black tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={10} /> AI
            </span>
          </div>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            {aiSyllabus.units.map((unit) => (
              <div key={`${unit.unitNumber}-${unit.title}`} className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/50 bg-white/60 dark:bg-indigo-900/30">
                <div className="font-bold text-indigo-900 dark:text-indigo-300">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                {renderTopics(unit.topics, 'blue')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiffPanel;
