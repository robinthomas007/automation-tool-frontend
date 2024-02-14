import { Step as StepModel} from "../redux/Slice/stepsSlice";

const Step = ({step}:{step:StepModel}) => {
  return (
    <div>
      <div>{step.name}</div>
    </div>
  );
};

export default Step;
