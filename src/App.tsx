import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DetailPage } from './pages/DetailPage';
import { ListPage } from './pages/ListPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ListPage />} />
        <Route path="item/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
