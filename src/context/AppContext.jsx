import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getVoiceProfile } from '../services/firebaseService';

const AppContext = createContext();

const initialState = {
  voiceProfile: null,
  blog: null,         // current blog being worked on
  scores: {
    rankScore: 0,
    readabilityGrade: 0,
    aiDetectionScore: 0
  },
  demoMode: true,     // Default to true for hackathon reliability
  isGlobalLoading: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VOICE_PROFILE':
      return { ...state, voiceProfile: action.payload };
    case 'SET_BLOG':
      return { ...state, blog: action.payload };
    case 'SET_SCORES':
      return { ...state, scores: { ...state.scores, ...action.payload } };
    case 'TOGGLE_DEMO_MODE':
      return { ...state, demoMode: !state.demoMode };
    case 'SET_LOADING':
      return { ...state, isGlobalLoading: action.payload };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Attempt to load existing profile on mount
  useEffect(() => {
    const initProfile = async () => {
      try {
        const profile = await getVoiceProfile();
        if (profile) {
          dispatch({ type: 'SET_VOICE_PROFILE', payload: profile });
        }
      } catch (err) {
        console.warn("Could not load profile on init", err);
      }
    };
    initProfile();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
