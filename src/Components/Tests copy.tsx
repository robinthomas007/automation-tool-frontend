import { useEffect } from "react";
// import Test from "./Test";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchTests, testsSelector, selectTests } from "../redux/Slice/testsSlice";
import { TextInput } from "flowbite-react";
import { projectsSelector } from "../redux/Slice/projectsSlice";

const Tests = ({ showSelected }: { showSelected: boolean }) => {
    const dispatch = useAppDispatch();
    const { tests, selectedTests } = useAppSelector(testsSelector);
    const { selectedProjects } = useAppSelector(projectsSelector);

    useEffect(() => {
        if (selectedProjects)
            dispatch(fetchTests({ projectId: selectedProjects?.id, searchTerm: '' }));
    }, [selectedProjects]);
    return (
        <div className="flex felx-row">
            <div className="flex-grow p-2">
                <TextInput placeholder="Search Test" className="w-full" />
                <ol className="flex flex-col divide-y border border-black">
                    {tests.map(test => <li className="cursor-pointer" onClick={(e) => { dispatch(selectTests(test)) }}>{test.name}</li>)}
                </ol>
            </div>
            {showSelected && selectedTests && <div>
                {/* <Test test={selectedTests} /> */}
            </div>}
        </div>
    );
};

export default Tests;
