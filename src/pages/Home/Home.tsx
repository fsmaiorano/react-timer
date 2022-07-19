import { Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

import {
  CountdownContainer,
  Divider,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  StartCountdownButton,
  TaskInput,
} from "./Home.styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(5, "Task?"),
  minutes: zod
    .number()
    .min(5)
    .max(60, "The cycle must be between 5 and 60 minutes"),
});

// interface NewCycleFormData {
//   task: string;
//   minutes: number;
// }

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { register, handleSubmit, watch, formState, reset } =
    useForm<NewCycleFormData>({
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
        task: "",
        minutes: 5,
      },
    });

  function handleCreateNewCycle(data: NewCycleFormData) {
    console.log(data);
    reset();
  }

  console.log(formState.errors);

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="">Work in</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Give your project a name"
            list="task-suggestion"
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
            {...register("minutes", { required: true, valueAsNumber: true })}
          />

          <span>minutes</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Divider>:</Divider>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
