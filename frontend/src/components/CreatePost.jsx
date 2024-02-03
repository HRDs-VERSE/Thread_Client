import {Button , FormControl, ModalBody, ModalContent, ModalFooter, ModalOverlay, useColorModeValue, Text, useDisclosure, Modal, Input, Flex, Image, CloseButton } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import useShowToast from "../hooks/useShowToast"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { PiImagesSquare } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux"
import { setPost } from "../store/postSlice"

const maxtChar = 500

function CreatePost() {
    const dispatch = useDispatch()
    const mode = useSelector((state) => state.mode.mode)
    const showToast = useShowToast()
    const user = useRecoilValue(userAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState()
    const [remainingCharater, setReamaningCharacter] = useState(maxtChar)
    
    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg()
    const [loading, setLoading] = useState(false)
    const imageRef = useRef(null)
    const apiURL = import.meta.env.VITE_API_URL;


    const handleTextChange = (e) => {
        const inputText = e.target.value

        if (inputText.length > maxtChar) {
            const truncatedText = inputText.slice(0, maxtChar)
            setPostText(truncatedText)
        }else{
            setPostText(inputText)
            setReamaningCharacter(maxtChar - inputText.length)
        }
    }

    const handleCreatePost = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${apiURL}/api/v1/post`, {
                method: "POST", 
                headers:{
        
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({postFileLocalPath: imgUrl ? imgUrl : null, content: postText, userId: user?._id})
            })
            const data = await res.json()
            if (data.error) {
              showToast('Error', data.error, "error")  
            }

            dispatch(setPost(data))
            showToast('Success', "Post Created Successfully 🫡🚀", "success")
        
            onClose()
            setPostText("")
            setImgUrl("")
            
        } catch (error) {
            showToast('Error', "Something went wrong while posting", "error")  
        }finally{
            setLoading(false)
        }
    }
  
  return (
    <>
      <Button
        position={"fixed"}
        bottom={"10px"}
        right={"10px"}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("white", "black")}
        onClick={onOpen}
      >
        POST
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"transparent"} border={"1px solid #212120"}> 
          <ModalBody pb={6} pt={5} className={`rounded-t-lg shadow-lg
                                              ${mode ? "bg-[#0a0a0a]" : "bg-white"}`}>
            <FormControl>
                <textarea 
                placeholder="Write something here..."
                onChange={handleTextChange}
                value={postText}
                className={`border-none w-[25rem] p-4 rounded-md outline-none h-[8rem] ${mode ? "bg-[#0a0a0a]" : "bg-white"}`}
                />
            <Text
            fontWeight={"bold"}
            textAlign={"right"}
            m={1}
            color={"gray.800"}
            >
                {remainingCharater}/{maxtChar}
            </Text>
            <Input
            type="file"
            hidden
            ref={imageRef}
            onChange={handleImageChange}
             />
            <button
                className={`ml-[5px]  cursor-pointer bg-[none] hover:scale-[1.2] duration-[.2s] hover:rotate-12`}
                onClick={() => imageRef.current.click()}>
                    <PiImagesSquare size={40}/>
                </button>
                <Text className={`${mode ? "text-[#363636]" : "text-[#b7b7b7]"}`}>Limit 4.5mb due to vercel</Text>
            </FormControl>

            {imgUrl && (
                <Flex
                mt={5}
                w={"full"}
                position={"relative"}
                >
                    <Image src={imgUrl} alt="Selectd image" className="rounded-lg" />
                    <CloseButton onClick={() => setImgUrl("")}
                        bg={"transparent"}
                        color={"white"}
                        position={"absolute"}
                        top={2}
                        right={2}
                     />

                </Flex>
            )}
          </ModalBody>

          <ModalFooter className={`${mode ? "bg-[#0a0a0a]" : "bg-white"} rounded-b-lg`}>
            
            <button className={"bg-gradient-to-r from-slate-500 to-slate-800 relative py-2 px-8 text-white text-base font-bold nded-full overflow-hidden bg-zinc-700 rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-zinc-900 before:to-gray-900 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-full hover:before:left-0"} onClick={handleCreatePost} >
              POST
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
