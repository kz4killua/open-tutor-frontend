import { AiOutlineSend } from "react-icons/ai"
import { Tooltip } from "@chakra-ui/react"


export default function JourneySectionView() {

  const section = {
    "id": 1,
    "content": "Praesent auctor ornare ultricies. Sed ultrices arcu feugiat massa semper, non sagittis ex volutpat. Aliquam rhoncus elit magna, nec rutrum justo facilisis eu. Maecenas turpis nibh, maximus sit amet porta quis, volutpat non metus. Nullam aliquet ornare neque quis porta. Proin porttitor malesuada nunc et eleifend. Nulla venenatis dolor a tellus lacinia egestas. Morbi nec est gravida, luctus augue vel, pharetra justo. Cras vel elit auctor ipsum porttitor viverra. Donec congue magna non scelerisque ultricies. Nulla id neque eu nisl scelerisque suscipit non quis magna. Vivamus vel sodales diam."
  }

  const messages = [
    {"role": "user", "content": "Hello!"},
    {"role": "assistant", "content": "How can I help?"},
  ]

  return (
    <main className="w-screen h-screen flex flex-row">

      <div className="w-full p-3 flex items-center justify-center">
        { section.content }
      </div>

      <div className="w-full">

        <div className="w-full p-3 bg-blue-50 whitespace-pre-wrap">
          { messages.map((message, i) => <SectionChatMessage key={i} message={message} /> ) }
        </div>

        <ChatInputField />

      </div>
      
    </main>
  )
}


function ChatInputField() {
  return (
    <form className="bg-white px-5 py-5 rounded-t-xl shadow-lg text-center z-30">
      <div className="flex items-center justify-center">
        
        <textarea resize="none" className="rounded border-black border" rows={1} padding="5" placeholder="Need help? Ask me!" id="query" maxLength={4000} />

        <Tooltip hasArrow label="Send message">
          <div className="flex flex-col">
            <button type="submit">
              <AiOutlineSend />
            </button>
            <span className="text-orange-500">Submit</span>
          </div>
        </Tooltip>

      </div>
    </form>
  )
}


function SectionChatMessage({ message }) {
  return (
    <div className={`w-full p-3 ${message.role === "assistant" ? 'bg-blue-50' : ''} whitespace-pre-wrap`}>
      { message.content }
    </div>
  )
}