import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { VoiceSetup } from './screens/VoiceSetup';
import { Generate } from './screens/Generate';
import { BlogEditor } from './screens/BlogEditor';
import { Distribution } from './screens/Distribution';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<VoiceSetup />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/editor" element={<BlogEditor />} />
              <Route path="/distribution" element={<Distribution />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
