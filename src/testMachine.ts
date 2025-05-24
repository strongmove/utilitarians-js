import { assign, setup } from 'xstate'


export type TestMachineContext = {
  value: number
}


export const TestMachineConfig = setup({
  types: {} as {
    context: TestMachineContext
  }
})


export const testMachine = TestMachineConfig.createMachine({
  initial: 'idle',
  context: {
    value: 0,
  },
  states: {
    idle: {
      on: {
        DECREMENT: {
          actions: assign({
            value: ({ context }) => context.value - 1
          })
        },
        INCREMENT: {
          actions: assign({
            value: ({ context }) => context.value + 1
          })
        }
      }
    },
    processing: {}
  }
})
