// src/pages/OTPPage.js
import React, { useState, useRef } from 'react';
import '../assets/OTPPage.css'; // Import CSS

const OTPPage = () => {
  const [otp, setOtp] = useState(new Array(6).fill('')); // Array of 6 empty strings
  const inputsRef = useRef([]); // Ref for input elements

  // Handle OTP input
  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ''); // Only allow numeric input

    if (value.length === 1) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Automatically focus the next input if available
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  // Handle backspace to move focus to the previous input and clear the current one
  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      const updatedOtp = [...otp];

      if (otp[index]) {
        // Clear the current input if it has a value
        updatedOtp[index] = '';
        setOtp(updatedOtp);
      } else if (index > 0) {
        // Move focus to the previous input if current input is empty
        inputsRef.current[index - 1].focus();
      }
    }
  };

  // Combine the OTP values when submitting the form
  const handleOTPSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    alert(`Mã OTP của bạn là: ${otpCode}`);
    // Add logic for OTP verification here
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h2>Nhập mã OTP</h2>
        <p>Vui lòng nhập mã OTP gồm 6 chữ số đã được gửi đến điện thoại của bạn.</p>
        <form onSubmit={handleOTPSubmit}>
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={otp[index]}
                onChange={(e) => handleChange(e.target, index)}
                ref={(el) => (inputsRef.current[index] = el)} // Store ref for each input
                onFocus={(e) => e.target.select()} // Automatically select input content on focus
                onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
              />
            ))}
          </div>
          <button type="submit" className="otp-button">Xác nhận OTP</button>
        </form>
        <div className="resend-otp">
          <p>Không nhận được mã?</p>
          <button className="resend-button">Gửi lại mã OTP</button>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
