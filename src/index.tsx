import ReactDOM from 'react-dom/client';
import './index.css';
import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { RecoilRoot } from 'recoil';
import ReactModal from 'react-modal';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { Submission } from './pages/Submission';
import { Footer } from './components/Footer';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { Error } from './pages/Error';
import { Effect } from './components/Effect';

const Wrapper = styled.div`
  min-height: 100vh;

  position: relative;
  padding-bottom: 80px;
`;

ReactModal.setAppElement('#root');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Wrapper>
        <Effect />
        <Header />
        <Outlet />
        <Footer />
      </Wrapper>
    ),
    errorElement: (
      <Wrapper>
        <Header />
        <Error />
        <Footer />
      </Wrapper>
    ),
    children: [
      {
        path: '',
        element: <Landing />,
      },
      {
        path: 'submission',
        element: <Submission />,
      },
    ],
  },
]);

root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
    <Toaster
      toastOptions={{
        style: {
          height: '42px',
          maxWidth: 'none',

          padding: '0 2px',

          backgroundColor: 'var(--brightness-100)',
          border: '1px solid var(--brightness-300)',
          borderRadius: '6px',
        },
        success: {
          style: {
            color: 'var(--purple-300)',
            backgroundColor: 'var(--purple-100)',
            border: '1px solid var(--purple-200)',
          },
        },
        error: {
          style: {
            color: 'var(--red-300)',
            backgroundColor: 'var(--red-100)',
            border: '1px solid var(--red-200)',
          },
        },
      }}
    />
  </RecoilRoot>
);
