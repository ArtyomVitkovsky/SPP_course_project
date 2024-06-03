import { useEffect, useState } from "react";
import Table from "../components/Table";
import Avatar from "../components/Avatar"

import useProjects from "../hooks/useProjects";

function ProjectsPage({ user }) {

    const {
        isProjectsLoading, projects, projectStatuses, projectCreationRequests, projectData,
        handleProjectDataChange, handleProjectSelect, handleProjectDataSave, handleProjectCreationRequestSave
    } = useProjects();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(isProjectsLoading);
    }, [isProjectsLoading])

    const columns = [
        "id", "content", "creationDate", "name"
    ]

    const extraColumns = ["participants"];

    const columnsToExclude = [
        "id", "content", "participants"
    ]

    const getExtraColumns = () => {
        const extraColumnsData = {};

        extraColumnsData["participants"] = participantsColumns();

        return extraColumnsData;
    }

    const participantsColumns = () => {
        const participantAvatars = {};

        projects.forEach((project) => {
            if (checkUserIsManager(project)) {
                let otherUsersCount = 0;
                participantAvatars[project.id] =
                    <div key={project.id} className="flex flex-row gap-1">
                        {
                            project.employees.map((participant, i) => {
                                if (participant) {
                                    if (i < 2) return <Avatar
                                        key={i}
                                        firstName={participant.employeeUser.firstName}
                                        lastName={participant.employeeUser.lastName}
                                    ></Avatar>
                                    else otherUsersCount++
                                }
                            })

                        }
                        {
                            otherUsersCount > 1
                                ? <Avatar key={project.id} firstName="+" lastName={`${otherUsersCount}`}></Avatar>
                                : otherUsersCount == 1
                                    ? <Avatar key={project.id}
                                        firstName={project.employees[project.employees.length - 1]?.employeeUser.firstName}
                                        lastName={project.employees[project.employees.length - 1]?.employeeUser.lastName}>
                                    </Avatar>
                                    : null
                        }
                    </div>
            }
        })

        return participantAvatars;
    }

    const getProjects = () => {
        return projects.filter((project) => checkUserIsManager(project))
    }

    const checkUserIsManager = (project) => {
        return project.manager.employeeUser.id == user.id;
    }

    return (
        isLoading
            ? <div className='flex w-full h-full items-center justify-center'>
                <span>Loading...</span>
            </div>
            : <div className="w-full h-full">
                <div className="bg-sky-900 p-6 rounded-b-3xl"></div>
                <div className="px-2 mt-3">
                    <Table data={getProjects()}
                        columns={columns}
                        extraColumns={extraColumns}
                        extraColumnsData={getExtraColumns()}
                        columnsToExclude={columnsToExclude}>
                    </Table>
                </div>
            </div >
    )
}

export default ProjectsPage