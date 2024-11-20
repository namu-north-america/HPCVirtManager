import { BreadcrumbProvider } from './contexts/BreadcrumbContext';

function App() {
  return (
    <BreadcrumbProvider>
      <Layout>
        <Router>
          <Routes>
            {/* Your routes */}
          </Routes>
        </Router>
      </Layout>
    </BreadcrumbProvider>
  );
} 