import ReactDOM from 'react-dom/client';
import './index.css';
import { Header } from './components/Header';
import { Landing } from './pages/Landing';
import { RecoilRoot } from 'recoil';
import ReactModal from 'react-modal';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonTheme } from 'react-loading-skeleton';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Submission } from './pages/Submission';
import { Footer } from './components/Footer';
import styled from 'styled-components';

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
        <Header />
        <Landing />
        <Footer />
      </Wrapper>
    ),
  },
  {
    path: 'submission',
    element: (
      <Wrapper>
        <Header submission />
        <Submission />
        <Footer />
      </Wrapper>
    ),
  },
]);

root.render(
  <RecoilRoot>
    <SkeletonTheme
      borderRadius={0}
      baseColor="#e2e3eb"
      highlightColor="#ebedf5"
    >
      <RouterProvider router={router} />
    </SkeletonTheme>
  </RecoilRoot>
);
