import React from 'react';
import { Container, Row, Col, Button, Image, InputGroup, FormControl } from 'react-bootstrap';
import { FaCog, FaArrowDown } from 'react-icons/fa';
import './SwapPage.css';

const SwapPage: React.FC = () => {
  return (
    <Container className="swap-page">
      <Row className="swap-header">
        <Col className="d-flex justify-content-between align-items-center">
          <span>Swap</span>
          <Button variant="link" className="settings-icon">
            <FaCog />
          </Button>
        </Col>
      </Row>

      <Row className="w-100 mb-3">
        <Col className="swap-box">
          <InputGroup className="d-flex justify-content-between align-items-center">
            <FormControl
              type="text"
              placeholder="0"
              className="amount-input"
              readOnly
            />
            <div className="text-end">
              <small className="text-muted">$0</small>
              <div className="eth-icon-container mt-1">
                <Image src="/path-to-eth-icon.png" alt="ETH" />
                <span>ETH</span>
                <Button variant="link" className="max-button">Max</Button>
              </div>
            </div>
          </InputGroup>
        </Col>
      </Row>

      <Button variant="dark" className="swap-arrow-button">
        <FaArrowDown />
      </Button>

      <Row className="w-100 mb-3">
        <Col className="swap-box">
          <FormControl
            type="text"
            placeholder="0"
            className="amount-input"
            readOnly
          />
          <Button variant="pink" className="select-token-button">Select token</Button>
        </Col>
      </Row>

      <Row className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map((item, index) => (
          <Button key={index} className="fs-3">
            {item}
          </Button>
        ))}
      </Row>

      <Button variant="link" className="footer-select-token">Select a token</Button>
    </Container>
  );
};

export default SwapPage;
