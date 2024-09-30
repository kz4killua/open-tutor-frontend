import { Highlight } from "@/types";


export type HighlightsAction = 
  | { type: "ADD", highlight: Highlight }
  | { type: "REMOVE", id: number }


export default function highlightsReducer(highlights: Highlight[], action: HighlightsAction) {
  switch (action.type) {

    case "ADD":
      return [...highlights, action.highlight]

    case "REMOVE":
      return highlights.filter(highlight => 
        highlight.id !== action.id
      )
      
    default:
      throw Error(`Unknown action type: ${action}`)
  }
}