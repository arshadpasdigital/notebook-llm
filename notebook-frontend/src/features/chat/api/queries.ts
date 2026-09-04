import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { listMessages, sendQuestion } from "@/lib/demo-database"
import type { ChatMessage } from "@/types/notebook"

export const messageKeys = {
  list: (collectionId: string) => ["messages", collectionId] as const,
}

export function useMessagesQuery(collectionId: string) {
  return useQuery({
    queryKey: messageKeys.list(collectionId),
    queryFn: () => listMessages(collectionId),
  })
}

export function useSendQuestionMutation(collectionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (question: string) => sendQuestion(collectionId, question),
    onMutate: async (question) => {
      await queryClient.cancelQueries({
        queryKey: messageKeys.list(collectionId),
      })
      const previous = queryClient.getQueryData<ChatMessage[]>(
        messageKeys.list(collectionId)
      )
      const optimistic: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        collectionId,
        role: "user",
        content: question,
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData(messageKeys.list(collectionId), [
        ...(previous ?? []),
        optimistic,
      ])
      return { previous }
    },
    onError: (_error, _question, context) => {
      queryClient.setQueryData(
        messageKeys.list(collectionId),
        context?.previous
      )
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: messageKeys.list(collectionId),
      }),
  })
}
