import { createActor } from "xstate";
import { testMachine } from "./testMachine";

export const testMachineService = createActor(testMachine).start()
