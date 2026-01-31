import React from 'react';

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

  const renderTopics = (topics = []) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {topics.map((t) => (
        <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
          {t}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`p-6 lg:p-8 grid grid-cols-1 ${aiSyllabus?.units?.length ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-black text-gray-900">Current Curriculum</h5>
          <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Baseline</span>
        </div>
        <div className="space-y-3 text-sm text-gray-700">
          {currentUnits.length === 0 ? (
            <div className="text-xs text-gray-400">Baseline not available.</div>
          ) : (
            currentUnits.map((unit) => (
              <div key={unit._id || unit.title} className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                <div className="font-bold text-gray-900">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                {renderTopics(unit.topics)}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-black text-gray-900">Proposed Changes</h5>
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">Diff</span>
        </div>

        <div className="space-y-5">
          {newUnits.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-2">New Units</div>
              <div className="space-y-3">
                {newUnits.map((unit) => (
                  <div key={unit._id || unit.title} className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-emerald-900">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600">New</span>
                    </div>
                    {renderTopics(unit.topics)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {updatedUnits.length > 0 && (
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2">Updated Units</div>
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
                    <div key={unit._id || unit.title} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="font-bold text-blue-900">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                      {titleChanged && (
                        <div className="text-xs text-blue-700 mt-2">
                          Title changed from <span className="font-bold">{current?.title}</span>
                        </div>
                      )}
                      {hoursChanged && (
                        <div className="text-xs text-blue-700 mt-1">
                          Hours changed from <span className="font-bold">{current?.hours || 0}</span> to <span className="font-bold">{unit.hours}</span>
                        </div>
                      )}
                      {(hasTopicDelta || hasDetailDelta) ? (
                        <div className="mt-2 space-y-3">
                          {addedTopics.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-blue-700 uppercase">Added Topics</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {addedTopics.map((t) => (
                                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    + {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {removedTopics.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-red-600 uppercase">Removed Topics</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {removedTopics.map((t) => (
                                  <span key={t} className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                    - {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {addedDetails.length > 0 && (
                            <div>
                              <div className="text-xs font-bold text-emerald-700 uppercase">Added Topic Details</div>
                              <div className="mt-2 space-y-2">
                                {addedDetails.map((detail) => (
                                  <div key={detail.topic} className="rounded-lg bg-emerald-50 border border-emerald-100 p-2">
                                    <div className="text-xs font-bold text-emerald-800">{detail.topic}</div>
                                    <ul className="mt-1 text-xs text-emerald-800 list-disc list-inside space-y-1">
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
                        <div className="text-xs text-blue-700 mt-2">No topic-level changes detected.</div>
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
            <div className="text-sm text-gray-500">No meaningful changes detected.</div>
          )}
        </div>
      </div>

      {aiSyllabus?.units?.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-black text-gray-900">AI Recommended Syllabus</h5>
            <span className="text-[10px] uppercase font-black tracking-widest text-blue-600">AI</span>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            {aiSyllabus.units.map((unit) => (
              <div key={`${unit.unitNumber}-${unit.title}`} className="p-3 rounded-xl border border-blue-100 bg-blue-50/60">
                <div className="font-bold text-blue-900">Unit {unit.unitNumber || '-'}: {unit.title}</div>
                {renderTopics(unit.topics)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiffPanel;
