import { createContext, useState } from "react";

interface CreateCycleFormData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  endDate?: Date;
}

interface ICyclesContext {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  handleEndCycle: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (cycle: CreateCycleFormData) => void;
  handleInterruptCycle: () => void;
}

interface CyclesContextProviderProps {
  children: React.ReactNode;
}

export const CyclesContext = createContext({} as ICyclesContext);

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

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

  const createNewCycle = (data: CreateCycleFormData) => {
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
  };

  const setSecondsPassed = (seconds: number) => {
    setAmountSecondsPassed(seconds);
  };

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        amountSecondsPassed,
        setSecondsPassed,
        handleEndCycle,
        createNewCycle,
        handleInterruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
