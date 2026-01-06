import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App(){
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    company: "", 
    role: "", 
    status: "", 
    applied_date: ""
  });
  const [editId, setEditId] = useState(null);
  const [editJob, setEditJob] = useState({
    company: "",
    role: "",
    status: "",
    applied_date: "",
  });

  useEffect(() =>{
    axios
      .get("http://localhost:3001/applications")
      .then((res) => setJobs(res.data))
      .catch((err) => console.error("Error fetching jobs", err));
  }, [])

  const handleAddJobs = async () =>{
    if (!newJob.company || !newJob.role || !newJob.status) return;

    try{
      const {data} = await axios.post(
        "http://localhost:3001/applications",
        newJob
      );
      setJobs([...jobs, data]);
      setNewJob({company: "", role: "", status: "", applied_date: ""});
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try{
      const {data} = await axios.delete(`http://localhost:3001/applications/${id}`);
      if (data.success) setJobs(jobs.filter((job) => job.id !== id));
    } catch (err){
      console.error("Failed to delete job:", err);
    }
  };

  const startEdit = (job) => {
    setEditId(job.id);
    setEditJob(job);
  };

  const handleUpdate = async () =>{
    try{
      const {data} = await axios.put(`http://localhost:3001/applications/${editId}`,
        editJob
      );
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === editId ? { ...job, ...data } : job
        )
      );
      setEditId(null);
      setEditJob({
        company: "",
        role: "",
        status: "",
        applied_date: "",
      });

    } catch(err){
      console.error("Failed to update job", err);
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";
      case "Interview":
        return "status-interview";
      case "Offer":
        return "status-offer";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  }

  return(
    <div>
      <h1>Job Tracker</h1>

      <h2>Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {editId === job.id ? (
              <>
                <input
                  value={editJob.role}
                  onChange={(e) => setEditJob({ ...editJob, role: e.target.value })}
                />
                <input
                  value={editJob.company}
                  onChange={(e) => setEditJob({ ...editJob, company: e.target.value })}
                />

                <select
                  value={editJob.status}
                  onChange={(e) => setEditJob({ ...editJob, status: e.target.value })}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <input
                  type="date"
                  value={editJob.applied_date}
                  onChange={(e) =>
                    setEditJob({ ...editJob, applied_date: e.target.value })
                  }
                />

                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {job.role} at {job.company} (
                  <span className={getStatusClass(job.status)}>
                    {job.status}
                  </span>
                ) – {job.applied_date}
                <button onClick={() => startEdit(job)}>Edit</button>
                <button onClick={() => handleDelete(job.id)}>Delete</button>
              </>
            )}
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
      <select
        value={newJob.status}
        onChange={(e) => setNewJob({ ...newJob, status: e.target.value})}
      >
        <option value="">Select status</option>
        <option value="Applied">Applied</option>
        <option value="Interview">Interview</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>

      </select>
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