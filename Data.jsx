import { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import React from 'react';
import './Modal.css'; // Include the CSS for modal
import styles from './data_form/data_style.js';
// import {Sheet2} from './Sheet2'
import Form1 from './data_form/Form1';
import Form2 from './data_form/Form2';
import Form3 from './data_form/Form3';
import Form4 from './data_form/Form4';
import Form5 from './data_form/Form5';
import { formatTime, getLabelForScoreKey, calculateTotalScore } from './data_form/utils.js';


function Home() {
  const [activeForm, setActiveForm] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // filtered data
  const [data2, setData2] = useState([])
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // search query
  const [setActiveFormData] = useState(null);

 
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleOpenModal1 = (applicant) => {
    setSelectedApplicant(applicant); // ตั้งค่าผู้สมัครที่เลือก
    setIsModal1Open(true); // เปิด Modal
  };
  
  const handleCloseModal1 = () => {
    setIsModal1Open(false); // ปิด Modal
    // setSelectedApplicant(null); // ล้างค่า setSelectedApplicant
  };

  const [isModal2Open, setIsModal2Open] = useState(false);


  const handleOpenModal2 = () => {
    console.log("Selected Applicant:", selectedApplicant);
    setIsModal2Open(true); // Open Modal2
  };
  const handleCloseModal2 = () => setIsModal2Open(false);

  const [scores, setScores] = useState({
    honesty: 0,
    agility: 0,
    interpersonal: 0,
    wit: 0,
  }); // เก็บคะแนนแต่ละประเภท


  //สำหรับเก็บค่าจากฟอร์ม
  const [selectedTime, setSelectedTime] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [interviewerName, setInterviewerName] = React.useState("");
  const [testResult, setTestResult] = React.useState("pass");
  const [additionalComment, setAdditionalComment] = React.useState("");
  const [applicantList, setApplicantList] = React.useState([]); // เก็บข้อมูลผู้สมัคร
  const [interviewedData, setInterviewedData] = React.useState([]); // เก็บข้อมูลผู้สัมภาษณ์

  const [testObj, settestObj] = useState([]); 
    
    useEffect(() => {      
        fetch('/api/sheet1')
        .then(res => res.json())
        .then(data => settestObj(data))
        .catch(err => console.error(err));
    }, []);
  

  // Inline styles
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/get/ggdata');
        const result = await response.json();
        console.log('Fetched Data:', result.msg);
        setData(result.msg);
        setFilteredData(result.msg); // Initialize filtered data

        console.log("here")
        setData2(result.msg2)
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle search input change
  function handleSearchChange(event) {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterData(query);
  }


  // Function to filter data based on search query
  const filterData = (query) => {
    if (query === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter((row) =>
        Object.values(row).some((value) =>
          value.toString().toLowerCase().includes(query)
        )
      );
      setFilteredData(filtered);
    }
  };


  const handleButtonClick = (formName, applicantData = null) => {
    if (formName === 'sheet2') {
      ((prevState) => !prevState);
    } else {
      setActiveForm(formName);
      if (formName === 'form3Interview' && applicantData) {
        setActiveFormData(applicantData); // เก็บข้อมูลผู้สมัครที่ถูกเลือก
      }
    }
  };


  // ฟังก์ชันจัดการการเลือกคะแนน
  const handleScoreSelection = (value, key) => {
    setScores((prevScores) => ({
      ...prevScores,
      [key]: value,
    }));
  };

  const filterDataG = (formData) => {
    if (!searchQuery) return formData; // If no search, return original data
  
    return formData.filter((row) =>
      Object.values(row).some(
        (value) => value && value.toString().toLowerCase().includes(searchQuery)
      )
    );
  };
    
  const renderFormContent = () => {
    switch (activeForm) {
      case 'form1':
        return (
          <div>
            <h1 style={styles.tableHeader}>แบบฟอร์มลงทะเบียนสมัครงาน</h1>
            <Form1 filteredData={filteredData} setFilteredData={setFilteredData} />
          </div>
        );
      case 'form2':
        return (
          <div>
            <h1 style={styles.tableHeader}>ฟอร์มแบบทดสอบ</h1>
            <Form2 applicants={filterDataG(testObj)} handleOpenModal1={handleOpenModal1} />
          </div>
        );
      case 'form3':
        return (
          <div>
            <h1 style={styles.tableHeader}>กรอกผลสัมภาษณ์</h1>
            <Form3 
              interviewedData={filterDataG(interviewedData)} 
              setSelectedApplicant={setSelectedApplicant} 
              handleOpenModal2={handleOpenModal2} 
              formatTime={formatTime} 
            />
          </div>
        );
      case 'form4':
        return (
          <div>
            <h1 style={styles.tableHeader}>ฟอร์มรายงานตัว</h1>
            <Form4 applicationData={filterDataG(applicationData)} />
          </div>
        );
      case 'form5':
        return (
          <div>
            <h1 style={styles.tableHeader}>หน้ารวม</h1>
            <Form5 applicationData={filterDataG(applicationData)} />
          </div>
        );
      default:
        return <h1>Welcome! Please select a sheet.</h1>;
    }
  };

//เพื่อเก็บข้อมูลผู้สัมภาษณ์ที่กรอกในแบบฟอร์มadd
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!selectedDate) {
        alert("กรุณาเลือกวันนัดสัมภาษณ์");
        return;
      }
      if (!selectedTime) {
        alert("กรุณาเลือกเวลานัดสัมภาษณ์");
        return;
      }
      if (!interviewerName) {
        alert("กรุณากรอกชื่อผู้สัมภาษณ์");
        return;
      }
      if (!testResult) {
        alert("กรุณาเลือกผลแบบทดสอบ");
        return;
    }
      const formData = {
        date: selectedDate,
        time: selectedTime,
        name: selectedApplicant?.Firstname,
        surname: selectedApplicant?.Lastname,
        nickname: selectedApplicant?.Nickname,
        phone: selectedApplicant?.Phonenum,
        nameem: interviewerName,
        test: testResult,
        score: null,
        comment: additionalComment,
      };

      setInterviewedData([...interviewedData, formData]); // เพิ่มข้อมูลใหม่ใน interviewedData
      handleCloseModal1();
    };

    //เก็บข้อมูลคะแนน คอมเมนต์
    const handleScoreSubmit = (applicant) => {
      if (!applicant) {
        alert("กรุณาเลือกผู้สมัครก่อนให้คะแนน!");
        return;
      }
    
      if (!Object.values(scores).some((value) => value > 0)) {
        alert("กรุณาให้คะแนนก่อนส่ง!");
        return;
      }
    
      setInterviewedData((prevData) =>
        prevData.map((entry) =>
          entry.phone === applicant.phone 
            ? {
                ...entry,
                score: calculateTotalScore(scores), 
                comment: additionalComment, 
              }
            : entry
        )
      );
    
      handleCloseModal2(); // Close Modal2
    };
    
    


    return (
      <div style={styles.reset}>
        <Navbar />
        <div style={styles.container}>
          <aside style={styles.sidebar}>
            <h2 style={styles.sidebarTitle}>Sheets</h2>
            <div style={styles.sidebarButtons}>
              <button
                style={styles.button}
                onClick={() => handleButtonClick('form1')}
              >
                ฟอร์มสมัครงาน
                (ข้อมูลผู้สมัคร)
              </button>
              <button
                style={styles.button}
                onClick={() => handleButtonClick('form2')}
              >
                ฟอร์มแบบทดสอบ
              </button>
              <button
                style={styles.button}
                onClick={() => handleButtonClick('form3')}
              >
                กรอกผลสัมภาษณ์
              </button>

              <button
                style={styles.button}
                onClick={() => handleButtonClick('form4')}
              >
                ฟอร์มรายงานตัว
              </button>
              <button
                style={styles.button}
                onClick={() => handleButtonClick('form5')}
              >
                ข้อมูลรวม
              </button>
            </div>
        </aside>
        <main style={styles.mainContent}>
          <div style={styles.header}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={styles.searchBar}
            />
            <button style={styles.exportBtn}>Export to CSV</button>
          </div>


          <div style={styles.tableSection}>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading data.</p>
            ) : (
              console.log("Data loading Error!")
              // <Form3 
              //   interviewedData={interviewedData} 
              //   setSelectedApplicant={setSelectedApplicant} 
              //   handleOpenModal2={handleOpenModal2} 
              //   formatTime={formatTime} 
              // />
            )}
          </div>
                <div style={styles.mainContent}>
        {renderFormContent()}
        {/* Modal1 */}
        {isModal1Open && selectedApplicant && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-header">นัดสัมภาษณ์</h2>
              <div className="modal-body">
                {/* Left Section */}
                <div className="form-section">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'left', width: '100%' }}>
                    <div style={{ textAlign: 'left' }}>
                      <strong>ชื่อ:</strong> {selectedApplicant.Firstname}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <strong>นามสกุล:</strong> {selectedApplicant.Lastname}
                    </div>
                  </div>
                  <p><strong>ชื่อเล่น:</strong> {selectedApplicant.Nickname}</p>
                  <p><strong>เบอร์:</strong> {selectedApplicant.Phonenum}</p>
                  <p><strong>คะแนน:</strong> {selectedApplicant.Score}</p>
                  
                  {/* แบบทดสอบ */}
                  <p><strong>แบบทดสอบ:</strong></p>
                  <select value={testResult} onChange={(e) => setTestResult(e.target.value)}>
                    <option value="pass">ผ่าน</option>
                    <option value="fail">ไม่ผ่าน</option>
                  </select>

                  {/* วันนัดสัมภาษณ์ */}
                  <p><strong>วันนัดสัมภาษณ์:</strong></p>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]} // Set min to today                  
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }} 
                  />

                  {/* เวลา */}
                  <p><strong>เวลา:</strong></p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {/* Hour Selector */}
                      <select
                        value={selectedTime.split(":")[0] || "00"} // Default to "00"
                        onChange={(e) => {
                          const [hour, minute] = selectedTime.split(":");
                          setSelectedTime(`${e.target.value}:${minute || "00"}`); // If no minute, default to "00"
                        }}
                        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={String(i).padStart(2, "0")}>
                            {String(i).padStart(2, "0")}
                          </option>
                        ))}
                      </select>

                      {/* Minute Selector */}
                      <select
                        value={selectedTime.split(":")[1] || "00"} // Default to "00"
                        onChange={(e) => {
                          const [hour] = selectedTime.split(":");
                          setSelectedTime(`${hour}:${e.target.value}`);
                        }}
                        style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                      >
                        {["00", "15", "30", "45"].map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                    </div>

                  {/* ผู้สัมภาษณ์ */}
                  <p><strong>ผู้สัมภาษณ์:</strong></p>
                  <input 
                    type="text" 
                    placeholder="กรอกชื่อผู้สัมภาษณ์" 
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px", width: "100%" }}
                  />

                  {/* ปุ่ม */}
                  <div className="form-buttons">
                    <button type="submit" onClick={handleSubmit}>ส่งข้อมูล</button>
                    <button type="button" onClick={handleCloseModal1}>
                      ปิด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal2 */}
        {isModal2Open && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-header">คะแนนการสัมภาษณ์</h2>
              <div className="modal-body">
                {/* Left Section */}
                <div className="form-section">
                  <p><strong>ชื่อ:</strong> {selectedApplicant?.name}</p>
                  <p><strong>นามสกุล:</strong> {selectedApplicant?.surname}</p>
                  <form className="form-grid">
                    {["honesty", "agility", "interpersonal", "wit"].map((key) => (
                      <div className="form-field" key={key}>
                        <label>{getLabelForScoreKey(key)}</label>
                        <div className="button-group">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              className={`score-button ${
                                scores[key] === value ? "selected" : ""
                              }`}
                              onClick={() => setScores((prev) => ({ ...prev, [key]: value }))}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="form-field full-width">
                      <label>ความคิดเห็นเพิ่มเติม:</label>
                      <textarea
                        name="comments"
                        value={additionalComment}
                        onChange={(e) => setAdditionalComment(e.target.value)}
                        style={{ height: "100px" }}
                      ></textarea>
                    </div>
                    <div className="form-buttons">
                      <button
                        type="submit"
                        onClick={() => handleScoreSubmit(selectedApplicant)}
                      >
                        ส่งข้อมูล
                      </button>
                      <button type="button" onClick={handleCloseModal2}>
                        ปิด
                      </button>
                    </div>
                  </form>
                </div>
                {/* Right Section */}
                <div className="score-summary">
                  <h3>ผลคะแนนรวม</h3>
                  <div className="score-display">
                    {calculateTotalScore(scores)} คะแนน
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
        </main>
      </div>
    </div>
  );
}

export default Home;