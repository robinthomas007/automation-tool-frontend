import { useEffect } from "react";
import Step from "./Step";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchSteps, stepsSelector, selectSteps } from "../redux/Slice/stepsSlice";
import { TextInput } from "flowbite-react";
import { projectsSelector } from "../redux/Slice/projectsSlice";

const Steps = ({ showSelected }: { showSelected: boolean }) => {
    const dispatch = useAppDispatch();
    const { steps, selectedSteps } = useAppSelector(stepsSelector);
    const { selectedProjects } = useAppSelector(projectsSelector);

    useEffect(() => {
        if (selectedProjects)
            dispatch(fetchSteps({ projectId: selectedProjects?.id, searchTerm: '' }));
    }, [selectedProjects]);
    return (
        <div className="flex felx-row">
            <div className="flex-grow p-2">
                <TextInput placeholder="Search Step" className="w-full" />
                <ol className="flex flex-col divide-y border border-black">
                    {steps.map(step => <li className="cursor-pointer" onClick={(e) => { dispatch(selectSteps(step)) }}>{step.name}</li>)}
                </ol>
            </div>
            {showSelected && selectedSteps && <div>
                <Step step={selectedSteps} />
            </div>}
        </div>
    );
};

export default Steps;
