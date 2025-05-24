import { createActor } from "xstate";
import { clipboardMachine } from "./clipboard";

export const clipboardService = createActor(clipboardMachine).start()
