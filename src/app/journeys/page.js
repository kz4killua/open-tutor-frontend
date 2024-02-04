"use client"


import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createJourneyRequest, getJourneysRequest } from "../../../api/journeys"

import { FaPlus } from "react-icons/fa6"
import { IoBookSharp } from "react-icons/io5"
import { FiUpload } from "react-icons/fi"
import { IoCloudUploadOutline } from "react-icons/io5"
import { FaSpinner } from "react-icons/fa"
import { MdOutlineUploadFile } from "react-icons/md"
import { RiFileUploadFill } from "react-icons/ri";

import SectionHeading from "@/components/SectionHeading"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Spinner,
} from '@chakra-ui/react'

import { Button } from "@chakra-ui/react"


export default function JourneysListPage() {

  const [journeys, setJourneys] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Fetch the list of journeys from the backend
  useEffect(() => {
    getJourneysRequest().then(response => {
      setJourneys(response.data)
    })
  }, [])

  return (
    <main className="w-screen flex flex-col items-center justify-center">

      <div className="w-full max-w-3xl px-5 py-10 grid grid-cols-2 gap-y-5 gap-x-3 justify-items-center">

        <div className="col-span-2 mt-7">
          <SectionHeading>
            Learn something new...
          </SectionHeading>
        </div>

        <CreateJourneyButton onClick={onOpen} />

        <div className="col-span-2 mt-7">
          <SectionHeading>
            ... or pick up where you left off.
          </SectionHeading>
        </div>

        {
          journeys.map(
            journey => <JourneyLink key={journey.id} journey={journey} />
          )
        }
        
      </div>

      <CreateJourneyModal isOpen={isOpen} onClose={onClose} journeys={journeys} setJourneys={setJourneys} />

    </main>
  )
}


function JourneyLink({ journey }) {
  return (
    <Link className="w-full h-16 p-2 max-w-full rounded-lg bg-blue-500 hover:bg-blue-700 flex items-center justify-center gap-x-2" href={`/journeys/${journey.id}`}>
      
      <IoBookSharp className="fill-white" />

      <div className="text-white text-center font-semibold lg:text-lg">
        { journey.title }
      </div>
    </Link>
  )
}


function CreateJourneyButton({ onClick }) {
  return (
    <button className="col-span-2 w-full h-16 max-w-full rounded-lg bg-blue-500 hover:bg-blue-700 flex items-center justify-center" onClick={onClick}>
      <div className="text-white text-center font-semibold lg:text-lg flex items-center justify-center gap-x-3">
        <FaPlus /> Create a new learning journey.
      </div>
    </button>
    )
}


function CreateJourneyModal({ isOpen, onClose, journeys, setJourneys }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Create your learning experience.
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FileUploadForm handleFileSelect={null}  onClose={onClose} journeys={journeys} setJourneys={setJourneys} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}


function FileUploadForm({ handleFileSelect, onClose, journeys, setJourneys }) {

  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()
  const toast = useToast()

  
  async function handleUploadFile(e) {

    e.preventDefault()

    if (uploading) {
      return
    }

    setUploading(true)

    const title = document.querySelector("input#title").value
    const baseFile = inputRef.current.files[0]
    const response = await createJourneyRequest(title, baseFile)

    setUploading(false)

    if (!response.ok) {
      toast({
        title: "Failed to upload the file.",
        description: "Ensure the file is of a valid type.",
        status: "error",
      })
      return
    }

    // Update the list of journeys
    setJourneys([...journeys, response.data])

    toast({
      title: "Your journey is being created.",
      description: "You can keep working while you wait.",
      status: "success",
    })
    onClose()

  }
  
  return (
    <form className="" onSubmit={handleUploadFile}>

      <div className="mb-7">
        <label className="block text-sm font-semibold leading-6 text-gray-900">
          What do you want to name your learning experience?
        </label>
        <div className="mt-2">
          <input
            id="title" name="title" type="text" required
            className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 font-semibold shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 outline-none sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="">
        <label className="block text-sm font-semibold leading-6 text-gray-900">
          Now upload a document to start learning.
        </label>
        <div className="flex gap-x-4">
          <div className="shrink-0">
            <RiFileUploadFill className='fill-blue-300' size={32} />
          </div>
          <label className="block">
            <span className="sr-only">Upload a File</span>
            <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer" accept='.docx,.pptx,.pdf,' onChange={handleFileSelect} ref={inputRef} />
          </label>
        </div>
      </div>

      <div className="flex gap-3 my-5 justify-end">
        <button className="py-2 px-3 rounded bg-blue-500 hover:bg-blue-700 text-white font-semibold flex items-center">
          { uploading && <Spinner size={"sm"} className="mr-4" /> } Create
        </button>
        <button className="py-2 px-3 rounded bg-gray-500 hover:bg-gray-700 text-white font-semibold" onClick={onClose}>
          Close
        </button>
      </div>

    </form>
  )
}