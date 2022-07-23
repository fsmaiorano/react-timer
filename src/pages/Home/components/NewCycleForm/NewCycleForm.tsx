import { useContext } from "react";
import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../Home";
import {
  FormContainer,
  TaskInput,
  MinutesAmountInput,
} from "./NewCycleForm.styles";

export function NewCycleForm() {
  const { activeCycle, activeCycleId, handleEndCycle } =
    useContext(CyclesContext);
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="">Work in</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Give your project a name"
        list="task-suggestion"
        disabled={!!activeCycleId}
        {...register("task", { required: true })}
      />

      <datalist id="task-suggestion">
        <option value="Project 1">Project 1</option>
        <option value="Project 2">Project 2</option>
      </datalist>

      <label htmlFor="">for</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycleId}
        {...register("minutesAmount", {
          required: true,
          valueAsNumber: true,
        })}
      />

      <span>minutes</span>
    </FormContainer>
  );
}
