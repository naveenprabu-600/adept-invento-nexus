import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard - the app handles auth routing
  return <Navigate to="/dashboard" replace />;
};

export default Index;
