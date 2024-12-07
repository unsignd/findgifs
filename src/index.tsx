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
      {
        path: 'test',
        element: (
          <>
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5188419011494703"
              crossOrigin="anonymous"
            ></script>
            <ins
              className="adsbygoogle"
              style={{
                display: 'block',
              }}
              data-ad-client="ca-pub-5188419011494703"
              data-ad-slot="4390596796"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </>
        ),
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
