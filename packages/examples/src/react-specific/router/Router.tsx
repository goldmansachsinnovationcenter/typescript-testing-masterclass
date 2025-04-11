/**
 * Example component that uses react-router
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';

const Home = () => (
  <div data-testid="home-page">
    <h1>Home Page</h1>
    <Link to="/users" data-testid="users-link">Users</Link>
  </div>
);

const Users = () => {
  const navigate = useNavigate();
  
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];
  
  return (
    <div data-testid="users-page">
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id} data-testid={`user-${user.id}`}>
            <Link to={`/users/${user.id}`}>{user.name}</Link>
          </li>
        ))}
      </ul>
      <button 
        data-testid="back-button"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
};

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  
  return (
    <div data-testid="user-detail-page">
      <h1>User Detail</h1>
      <p data-testid="user-id">User ID: {userId}</p>
      <p data-testid="location-pathname">Path: {location.pathname}</p>
      <Link to="/users" data-testid="back-to-users">Back to Users</Link>
    </div>
  );
};

const NotFound = () => (
  <div data-testid="not-found-page">
    <h1>404 - Not Found</h1>
    <Link to="/">Go Home</Link>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export { Home, Users, UserDetail, NotFound };
export default AppRouter;
