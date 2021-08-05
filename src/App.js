import React, { useState, useEffect } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';

import AuthService from "./services/auth.service";

const queryClient = new QueryClient()


const App = () => {
 // const [showModeratorBoard, setShowModeratorBoard] = useState(false);
 // const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
     // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
     // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeConfig>
        <ScrollToTop />
        <Router />
      </ThemeConfig>
    </QueryClientProvider>
  //   <div>
  //     <nav className="navbar navbar-expand navbar-dark bg-dark">
  //       <Link to={"/"} className="navbar-brand">
  //         bezKoder
  //       </Link>
  //       <div className="navbar-nav mr-auto">
  //         <li className="nav-item">
  //           <Link to={"/home"} className="nav-link">
  //             Home
  //           </Link>
  //         </li>

  //         {showModeratorBoard && (
  //           <li className="nav-item">
  //             <Link to={"/mod"} className="nav-link">
  //               Moderator Board
  //             </Link>
  //           </li>
  //         )}

  //         {showAdminBoard && (
  //           <li className="nav-item">
  //             <Link to={"/admin"} className="nav-link">
  //               Admin Board
  //             </Link>
  //           </li>
  //         )}

  //         {currentUser && (
  //           <li className="nav-item">
  //             <Link to={"/user"} className="nav-link">
  //               User
  //             </Link>
  //           </li>
  //         )}
  //       </div>

  //       {currentUser ? (
  //         <div className="navbar-nav ml-auto">
  //           <li className="nav-item">
  //             <Link to={"/profile"} className="nav-link">
  //               {currentUser.email}
  //             </Link>
  //           </li>
  //           <li className="nav-item">
  //             <a href="/login" className="nav-link" onClick={logOut}>
  //               LogOut
  //             </a>
  //           </li>
  //         </div>
  //       ) : (
  //         <div className="navbar-nav ml-auto">
  //           <li className="nav-item">
  //             <Link to={"/login"} className="nav-link">
  //               Login
  //             </Link>
  //           </li>

  //           <li className="nav-item">
  //             <Link to={"/register"} className="nav-link">
  //               Sign Up
  //             </Link>
  //           </li>
  //         </div>
  //       )}
  //     </nav>

  //     <div className="container mt-3">
  //       <Switch>
  //         <Route exact path={["/", "/home"]} component={Home} />
  //         <Route exact path="/login" component={Login} />
  //         <Route exact path="/register" component={Register} />
  //         <Route exact path="/profile" component={Profile} />
  //         <Route path="/user" component={BoardUser} />
  //       </Switch>
  //     </div>
  //   </div>
   );
};

export default App;