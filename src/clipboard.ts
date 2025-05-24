import { fromPromise, setup } from "xstate";
import { retry, handleWhen, ConstantBackoff } from 'cockatiel';

const retryPolicy = retry(
  handleWhen((err) => {
    return true
  }),
  {
    maxAttempts: 3,
    backoff: new ConstantBackoff(100)
  }
);

export type ClipboardEvents =
  | { type: 'COPY'; value: string }

export const clipboardMachine = setup({
  types: {} as {
    context: {},
    events: ClipboardEvents
  },
  actors: {
    tryCopyToClipboard: fromPromise(async ({ input }: { input: { value: string } }) => {
      try {
        await retryPolicy.execute(async () => {
          console.debug('trying to copy')
          await navigator.clipboard.writeText(input.value)
        })
      } catch (e) {
        const tempInput = document.createElement('input')
        tempInput.value = input.value
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
      }
    })
  }
}).createMachine({
  initial: 'idle',
  context: {},
  states: {
    idle: {
      entry: () => console.debug('idle'),
      on: {
        COPY: {
          target: 'copying',
        }
      }
    },
    copying: {
      entry: () => console.debug('copying'),
      invoke: {
        src: 'tryCopyToClipboard',
        input: ({ event }) => ({
          value: event.value
        }),
        onDone: {
          target: 'idle',
          actions: () => console.debug('done copying'),
        },
        onError: {
          target: 'idle',
          actions: () => console.error('on error'),
        }
      },
    }
  }
})
