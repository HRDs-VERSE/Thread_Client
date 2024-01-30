import { Button, FormControl, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useColorModeValue, Text, useDisclosure, Modal, Input, Flex, Image, CloseButton } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import useShowToast from "../hooks/useShowToast"
// import { BsFillImageFill } from "react-icons/bs"
const maxtChar = 500

function CreatePost() {
    const showToast = useShowToast()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [postText, setPostText] = useState()
    const [remainingCharater, setReamaningCharacter] = useState(maxtChar)

    const {handleImageChange, imgUrl, setImgUrl} = usePreviewImg()
    const [loading, setLoading] = useState(false)

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
            const res = await fetch("api/v1/post/", {
                method: "POST", 
                headers:{
        
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({postFileLocalPath: imgUrl ? imgUrl : null, content: postText})
            })
            const data = res.json()
            if (data.error) {
              showToast('Error', data.error, "error")  
            }
            showToast('Success', "Post Created Successfully 🫡🚀", "success")
            onClose()
            setPostText("")
            setImgUrl(" ")
            
        } catch (error) {
            showToast('Error', "Something went wrong while posting", "error")  
        }finally{
            setLoading(false)
        }
    }
    const imageRef = useRef(null)
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
        <ModalContent> 
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
                <Textarea 
                placeholder="Post content"
                onChange={handleTextChange}
                value={postText}
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
            <Button
                style={{marginLeft: "5px", cursor: "pointer"}} size={16} 
                onClick={() => imageRef.current.click()}>
                    Choose post
                </Button>
            </FormControl>

            {imgUrl && (
                <Flex
                mt={5}
                w={"full"}
                position={"relative"}
                >
                    <Image src={imgUrl} alt="Selectd image" />
                    <CloseButton onClick={() => setImgUrl("")}
                        bg={"gray.500"}
                        position={"absolute"}
                        top={2}
                        right={2}
                     />

                </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
              POST
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
