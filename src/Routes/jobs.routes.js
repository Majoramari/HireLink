import { Router } from "express";
import verifyToken  from "../Middlewares/verifyToken.js";
import { createJob, deleteJob, getAllJobs, getJobById, updateJobById } from "../Controllers/jobs.controller.js";

const router = Router();

// create job _ input: token + job data in body => DONE
router.post("/", verifyToken, createJob); // Employer only


// DELETE job by id  _ input: token + job id => DONE
router.delete("/:id", verifyToken,deleteJob);// Employer only


// UPDATE job by id  _ input: token + job id + updated job data in body => DONE 
router.put("/:id", verifyToken, updateJobById);// Employer only


// GET all jobs _ input:optional => page, limit [default = 10], search, filter => DONE
router.get("/",  getAllJobs);


// GET job by id _input: job id => DONE
router.get("/:id", getJobById);


export default router;