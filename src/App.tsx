import React from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { HistoryRouter } from 'redux-first-history/rr6'

import './features/Counter/index.module.css'
import Counter from './features/Counter/index'
import DocumentList from './features/DocumentList'
import { history, store } from './store'
import DXFEditor from './features/DocumentList/DXFEditor'

const App: React.FC = () => {
  return (
    <ReduxStoreProvider store={store}>
      <HistoryRouter history={history}>
        <Routes>
          <Route path="/" element={<DXFEditor />} />
          <Route path="/js-approach" element={<DocumentList />} />
        </Routes>
      </HistoryRouter>
    </ReduxStoreProvider>
  )
}

export default App
