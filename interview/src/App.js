import { useState } from "react";
import axios from "axios";
import "./App.css";

const URL = "http://localhost:8000";

function App() {
  const [isActive, setActive] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  return (
    <div className="App">
      {!isActive ? (
        <PhoneRegiter
          setActive={setActive}
          setPhoneNumber={setPhoneNumber}
          phoneNumber={phoneNumber}
        />
      ) : (
        <PhoneVerify setActive={setActive} phoneNumber={phoneNumber} />
      )}
    </div>
  );
}

export default App;

const PhoneRegiter = ({ setActive, setPhoneNumber, phoneNumber }) => {
  const handleSubmit = async () => {
    const regexPhoneNumber = /(84|[3|5|7|8|9])+([0-9]{8})\b/g;

    const isRegex = phoneNumber.match(regexPhoneNumber) ? true : false;
    const PhoneNumber =
      phoneNumber.charAt(0) !== "+" ? `+${phoneNumber}` : phoneNumber;
    setPhoneNumber(PhoneNumber);
    if (isRegex) {
      setActive(true);
      await axios.post(`${URL}/api/register`, { phoneNumber: PhoneNumber });
    }
  };
  return (
    <div className="phone">
      <h3>Register</h3>
      <div className="input">
        <label htmlFor="phone-sms">Phone Number</label>
        <input
          type="text"
          id="phone-sms"
          placeholder="+84 369 282 686"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
};
const PhoneVerify = ({ setActive, phoneNumber }) => {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const regexCode = /^\d+$/;

    const isRegex = accessCode.match(regexCode) ? true : false;
    if (!isRegex) return;
    try {
      const res = await axios.post(`${URL}/api/valid`, {
        accessCode,
        phoneNumber,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  return (
    <>
      {!success ? (
        <div className="phone">
          <h3>Xác thực</h3>
          <p className="text">Mã OTP đã được gửi đến số điện thoại quý khách</p>
          <div className="input">
            <label htmlFor="phone-code">Enter code</label>
            <input
              type="text"
              id="phone-code"
              placeholder="586 582"
              maxLength={6}
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
            />
          </div>
          {error.length !== 0 && <p className="error">{error}</p>}
          <div className="btn">
            <p onClick={() => setActive(false)}>Quay lại</p>
            <button onClick={handleSubmit}>Xác nhận</button>
          </div>
        </div>
      ) : (
        <div
          className="phone"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <h3>Success</h3>
          <p className="text">Đăng ký thành công</p>
        </div>
      )}
    </>
  );
};
