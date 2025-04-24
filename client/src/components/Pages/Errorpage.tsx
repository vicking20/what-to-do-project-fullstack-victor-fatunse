// ErrorPage.tsx
//in the case a random address is entered that the router does not recognize, it ues a wildcard to detect and render a basic 404 page
const ErrorPage = () => {
    return (
      <div className="container">
        <h1>404 - Page Not Found</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
      </div>
    );
  };
  
  export default ErrorPage;