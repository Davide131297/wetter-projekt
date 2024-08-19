import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/WeatherLogo.png';

export default function Root() {
  return (
    <>
      <Navbar fixed="top" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Wetter-App
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}