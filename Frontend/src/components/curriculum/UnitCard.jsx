import React, { useState } from 'react';
import { Clock, Plus, ChevronDown, Edit2, Trash2, X } from 'lucide-react';

const UnitCard = ({ unitNumber, title, topics, topicDetails = {}, hours, role, isEditing, onUpdateUnit, onAddTopic, onRemoveTopic, onUpdateTopic, onAddSubtopic, onRemoveSubtopic, onUpdateSubtopic, onUpdateTopicDetail, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState(null);

  return (
    <div className="bg-white rounded-[2rem] p-1 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 mb-4 overflow-hidden group">
      <div
        className={`w-full flex justify-between items-center p-6 text-left transition-colors ${isOpen ? 'bg-accent-blue/5' : 'bg-white group-hover:bg-gray-50'} rounded-[1.8rem]`}
      >
        <div className="flex items-center gap-5 flex-1">
          <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl transition-all ${isOpen ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/30 scale-110' : 'bg-accent-blue/10 text-accent-blue'
            }`}>
            {unitNumber}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onUpdateUnit('title', e.target.value)}
                  className="text-xl font-bold text-primary bg-white border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-accent-blue outline-none w-full"
                  placeholder="Unit Title"
                />
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-secondary" />
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => onUpdateUnit('hours', parseInt(e.target.value) || 0)}
                    className="text-xs font-bold text-secondary bg-white border border-gray-200 rounded-lg px-2 py-1 w-20 focus:ring-2 focus:ring-accent-blue outline-none"
                    placeholder="Hours"
                  />
                  <span className="text-xs font-bold text-secondary uppercase">Hours</span>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h3 className={`text-xl font-bold transition-colors ${isOpen ? 'text-accent-blue' : 'text-primary'} flex items-center gap-3`}>
                    {title}
                  </h3>
                  {(role === 'teacher' || role === 'faculty' || role === 'admin') && (
                    <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-gray-300 hover:text-accent-blue transition-colors p-1">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-secondary text-xs font-bold flex items-center gap-1 mt-1.5 uppercase tracking-wide">
                  <Clock size={12} /> {hours} Hours
                </p>
              </>
            )}
          </div>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white shadow-sm border border-gray-100 ${isOpen ? 'text-accent-blue rotate-180 border-accent-blue/20' : 'text-gray-400'}`}>
          <ChevronDown size={20} />
        </button>
      </div>

      {isOpen && (
        <div className="p-8 pt-2 pl-[5.5rem] animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
            <h4 className="text-xs font-black text-secondary/50 uppercase tracking-widest">Topics Covered</h4>
            {isEditing && (
              <button
                onClick={onAddTopic}
                className="text-accent-blue hover:bg-blue-50 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Plus size={14} /> Add Topic
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {topics.map((topic, idx) => (
              <li key={idx} className="group/topic relative">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => onUpdateTopic(idx, e.target.value)}
                          className="flex-1 font-bold text-primary/80 text-base bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-blue outline-none"
                          placeholder="Topic Name"
                        />
                        <button
                          onClick={() => onRemoveTopic(idx)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Topic"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setExpandedTopic(expandedTopic === topic ? null : topic)}
                        className="w-full flex items-start gap-3 hover:bg-gray-50 p-3 rounded-xl transition-colors text-left group/topicbtn"
                      >
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue/40 group-hover/topicbtn:bg-accent-blue group-hover/topicbtn:scale-150 transition-all shrink-0"></div>
                        <div className="flex-1">
                          <span className="font-bold text-primary/80 text-base leading-relaxed group-hover/topicbtn:text-primary transition-colors">
                            {topic}
                          </span>
                          {topicDetails[topic] && topicDetails[topic].length > 0 && (
                            <span className="ml-2 text-xs text-gray-400 font-medium">
                              ({topicDetails[topic].length} items)
                            </span>
                          )}
                        </div>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedTopic === topic ? 'rotate-180' : ''}`} />
                      </button>
                    )}

                    {(expandedTopic === topic || isEditing) && (
                      <div className={`ml-4 mt-2 pl-4 border-l-2 border-gray-100 ${!isEditing && 'animate-in slide-in-from-top-2 duration-200'}`}>
                        <div className="space-y-2">
                          {topicDetails[topic]?.map((subtopic, subIdx) => (
                            <div key={subIdx} className="flex items-center gap-2">
                              {isEditing ? (
                                <>
                                  <div className="w-1 h-1 rounded-full bg-blue-400 shrink-0"></div>
                                  <input
                                    type="text"
                                    value={subtopic}
                                    onChange={(e) => onUpdateSubtopic(topic, subIdx, e.target.value)}
                                    className="flex-1 text-sm text-gray-700 bg-white border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-accent-blue outline-none"
                                    placeholder="Detail / Subtopic"
                                  />
                                  <button
                                    onClick={() => onRemoveSubtopic(topic, subIdx)}
                                    className="text-gray-300 hover:text-red-500 p-1"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded-lg w-full">
                                  <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                    {subtopic}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <button
                              onClick={() => onAddSubtopic(topic)}
                              className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors w-full justify-center border border-dashed border-blue-200 hover:border-blue-300 mt-2"
                            >
                              <Plus size={12} /> Add Detail
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UnitCard;
