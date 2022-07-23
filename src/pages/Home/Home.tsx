import { HandPalm, IconContext, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { createContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./Home.styles";
import { CountDown } from "./components/CountDown/CountDown";
import { ZodUndefinedDef } from "zod";
import { NewCycleForm } from "./components/NewCycleForm/NewCycleForm";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(5, "Task?"),
  minutesAmount: zod
    .number()
    .min(5)
    .max(60, "The cycle must be between 5 and 60 minutes"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  endDate?: Date;
}

interface ICyclesContext {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  handleEndCycle: () => void;
  setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as ICyclesContext);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

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
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const handleCreateNewCycle = (data: NewCycleFormData) => {
    const cycleId = Math.random().toString() + String(new Date().getTime());
    const newCycle: Cycle = {
      id: cycleId,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles([...cycles, newCycle]);
    setActiveCycleId(cycleId);
    setAmountSecondsPassed(0);

    reset();
  };

  const handleEndCycle = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            endDate: new Date(),
          };
        }

        return cycle;
      })
    );

    setActiveCycleId(null);
    setAmountSecondsPassed(0);
  };

  const handleInterruptCycle = () => {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interruptedDate: new Date(),
          };
        }

        return cycle;
      })
    );

    setActiveCycleId(null);
    setAmountSecondsPassed(0);
  };

  const setSecondsPassed = (seconds: number) => {
    setAmountSecondsPassed(seconds);
  };

  // console.log(formState.errors);
  // console.log(cycles);
  // console.log(activeCycle);

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            handleEndCycle,
            amountSecondsPassed,
            setSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <CountDown />
        </CyclesContext.Provider>

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
