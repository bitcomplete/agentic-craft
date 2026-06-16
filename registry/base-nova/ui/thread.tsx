import {
  ThreadEmpty,
  ThreadMessage,
  ThreadRoot,
  ThreadStatus,
  ThreadToolCall,
} from "@/components/ui/thread-client"
import type {
  ThreadMessageProps,
  ThreadMessageRole,
  ThreadRootProps,
  ThreadStatusProps,
  ThreadStatusState,
  ThreadStreamChunk,
  ThreadToolCallProps,
  ThreadToolCallState,
} from "@/components/ui/thread-client"

const Thread = Object.assign(
  function Thread(props: ThreadRootProps) {
    return <ThreadRoot {...props} />
  },
  {
    Message: ThreadMessage,
    Status: ThreadStatus,
    ToolCall: ThreadToolCall,
    Empty: ThreadEmpty,
  }
)

export {
  Thread,
  ThreadRoot,
  ThreadMessage,
  ThreadStatus,
  ThreadToolCall,
  ThreadEmpty,
}
export type {
  ThreadMessageProps,
  ThreadMessageRole,
  ThreadRootProps,
  ThreadStatusProps,
  ThreadStatusState,
  ThreadStreamChunk,
  ThreadToolCallProps,
  ThreadToolCallState,
}
