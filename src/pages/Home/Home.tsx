import { HandPalm, IconContext, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createContext, useContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./Home.styles";
import { CountDown } from "./components/CountDown/CountDown";
import { ZodUndefinedDef } from "zod";
import { NewCycleForm } from "./components/NewCycleForm/NewCycleForm";
import { CyclesContext } from "../../contexts/CycleContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(5, "Task?"),
  minutesAmount: zod
    .number()
    .min(5)
    .max(60, "The cycle must be between 5 and 60 minutes"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { createNewCycle, handleInterruptCycle, activeCycleId } =
    useContext(CyclesContext);
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 5,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task;

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    createNewCycle(data);
    reset();
  };

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <CountDown />

        {activeCycleId ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
