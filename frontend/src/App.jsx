import { useEffect, useState } from "react";
import "./App.css";

function App(){
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({company: "", role: "", status: "", applied_date: ""});

  useEffect(() =>{
    fetch("http://localhost:3001/applications")
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error("Error fetching jobs:", err));
  }, [])

  const handleAddJobs = async () =>{
    if (!newJob.company || !newJob.role || !newJob.status) return;

    const res = await fetch("http://localhost:3001/applications", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newJob),
    });
    const addedJob = await res.json();
    setJobs([...jobs, addedJob]);
    setNewJob({company: "", role: "", status: "", applied_date: ""});
  };

  return(
    <div>
      <h1>Job Tracker</h1>

      <h2>Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.role} at {job.company} ({job.status}) - Applied: {job.applied_date}
          </li>
        ))}
      </ul>
      
      <h2>Add a Job</h2>
      <input 
        placeholder="Role"
        value={newJob.role}
        onChange={(e) => setNewJob({...newJob, role: e.target.value})}
      />
      <input 
        placeholder="Company"
        value={newJob.company}
        onChange={(e) => setNewJob({...newJob, company: e.target.value})}
      />
      <input 
        placeholder="Status"
        value={newJob.status}
        onChange={(e) => setNewJob({...newJob, status: e.target.value})}
      />
      <input
        type="date"
        value={newJob.applied_date}
        onChange={(e) => setNewJob({...newJob, applied_date: e.target.value})}
      />
      <button onClick={handleAddJobs}>Add Job</button>
    </div>
  );
}

export default App;