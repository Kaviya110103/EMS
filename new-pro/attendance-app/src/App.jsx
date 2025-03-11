import './App.css'

import ListEmployeeComponent from './component/ListEmployeeComponent'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EmployeeComponent from './component/EmployeeComponent'

import Profile from './component/Profile';
import EmpProfile from './component/EmpProfile'
// import MarkAttendance from './component/MarkAttendance';
import AttendanceList from './component/AttendanceList';
import EmployeeAttendance from './component/EmployeeAttendance';
import AttendanceByAction from './component/AttendanceByAction';
import LocationTracker from './component/LocationTracker';
import  EmployeeAttendanceImages from './component/EmployeeAttendanceImages';
import ImageGallery from './component/ImageGallery';
import ImageDisplay from './component/ImageDisplay ';
import AdminDashboard from './component/AdminDashboard';
// import AddAttendance from './component/AddAttendance'
import Clock from './component/Clock';
import Markattendance from './component/Markattendance';
import EmployeeLogin from './component/EmployeeLogin';
import EmpProfilee from './component/EmployeePro';
import ForgotPassword from './component/ForgotPassword';
import AdminLogin from './component/AdminLogin';
import EmployeePage from './component/EmployeePage';
import Demo from './component/Demo';
import CheckAttendance from './component/CheckAttendance';
import Payroll from './component/Payroll';
import LeavePermissionManager from './component/LeavePermissionManager';
import EmployeeCalender from './component/EmployeeCalender';

import EnterAttendance from './component/EnterAttendance';
// import EmpProfile from './components/EmpProfile'

function App() {

  return (
    <>
      <BrowserRouter>
      
        <Routes>
        <Route path="/" element={<AdminLogin/>} />

          {/* <Route path='/' element={<ListEmployeeComponent />}></Route> */}
          <Route path='/emplist' element={<ListEmployeeComponent />}></Route>
          <Route path='/add-employee' element={<EmployeeComponent />}></Route>
          <Route path='/update-employee/:id' element={<EmployeeComponent />}></Route>
          {/* <Route path='/emppro' element={<EmpProfile />}></Route> */}
          <Route path="/employee-profile/:id" element={<EmpProfile />} /> {/* Add this route */}
          <Route path="/view-employee/:id" element={<Profile />} /> {/* Profile Route */}
          {/* <Route path="/markattendance" element={<MarkAttendance />} /> */}
          <Route path='/Attendancelist' element={<AttendanceList />}></Route>
          <Route path="/employee-attendance" element={<EmployeeAttendance />} />
          <Route path="/attendance-by-action" element={<AttendanceByAction />} />
          <Route path="/location" element={<LocationTracker />} />
           <Route path="/addimages" element={<EmployeeAttendanceImages />} />
          <Route path="/imggallery" element={<ImageGallery />} />
           <Route path="/imgdisplay" element={<ImageDisplay />} />
           <Route path="/admindashboard" element={<AdminDashboard />} />
           <Route path="/demo" element={<Demo />} />
           <Route path="/leave" element={<LeavePermissionManager />} />
           {/* <Route path="/markdemo" element={<Markdemo />} /> */}



           {/* <Route path="/add-attendance" element={<AddAttendance />} /> */}
           <Route path="/" exact component={Clock} />
    
           <Route path="/loginEmployee" element={<EmployeeLogin />} />
           <Route path="/profile/:id" element={<EmployeePage />} />
           <Route path="/mark-attendance" element={<Markattendance />} /> {/* Mark Attendance page */}
           <Route path="/forgetpassword"  element={<ForgotPassword/>} />
          {/* <Route path="/empprofile" element={<EmpProfile />} /> */}


          <Route path="/EmployeePage" element={<EmployeePage/>} />
          <Route path="/check" element={<CheckAttendance/>} />
          <Route path="/payroll" element={<Payroll/>}/>
          <Route path="/EmployeeCalender" element={<EmployeeCalender/>}/>

          <Route path="/enterattendance" element={<EnterAttendance/>}/>


        </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
