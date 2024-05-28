import { useState, useEffect } from "react";
import * as ProjectsService from "../services/ProjectsService";
import toast from "react-hot-toast";

const useProjects = (url) => {
    const [projects, setProjects] = useState([]);
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [projectCreationRequests, setProjectCreationRequests] = useState([]);

    const [isProjectsLoading, setIsLoading] = useState(true);
    const [projectData, setProjectData] = useState({});

    const handleProjectDataChange = (event, field) => {
        const value = event.target.value;

        setProjectData(data => ({ ...data, [field]: value }))
    }

    const handleProjectSelect = (project) => {
        setProjectData(project)
    }

    const handleProjectDataSave = async (project) => {
        try {
            const result = await ProjectsService.setProject(project);
            getAllProjects();

            return result;
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getAllProjects = async () => {
        const result = await ProjectsService.getProjects();
        setProjects(result);
    }

    const getProjectStatuses = async () => {
        const result = await ProjectsService.getProjectStatuses();
        setProjectStatuses(result);
    }

    const getProjectCreationRequests = async () => {
        const result = await ProjectsService.getProjectCreationRequests();
        setProjectCreationRequests(result);
    }

    const handleProjectCreationRequestSave = async (projectCreationRequest) => {
        try {
            const result = await ProjectsService.setProjectCreationRequest(projectCreationRequest);

            getProjectCreationRequests();

            return result;
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        }
    }

    const getData = async () => {
        setIsLoading(true);
        try {
            await getAllProjects();
            await getProjectStatuses();
            await getProjectCreationRequests();
        } catch (error) {
            toast.error(error?.message || 'Unknown error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return {
        isProjectsLoading, projects, projectStatuses, projectCreationRequests, projectData,
        handleProjectDataChange, handleProjectSelect, handleProjectDataSave, handleProjectCreationRequestSave
    };
};

export default useProjects;