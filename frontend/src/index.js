import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import './index.css';

import reportWebVitals from './reportWebVitals';


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Home from "./pages/learninge2e/LearningE2E";
import Labeling from './pages/labeling/Labeling';
import Admin from "./pages/admin/Admin";
import MultiModal from "./pages/multiModal/multiModal";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Learning-e2e</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="admin">Admin</Nav.Link>
                        <Nav.Link href="re">Relation Extraction</Nav.Link>
                        <Nav.Link href="multi-modal">Multi Modal</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/re" element={<Labeling />}></Route>
                <Route path="/admin" element={<Admin />}></Route>
                <Route path='/multi-modal' element={<MultiModal />} ></Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
