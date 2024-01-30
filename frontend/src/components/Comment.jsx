import { Avatar, Button, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
// import Actions from "./Actions"
import useShowToast from "../hooks/useShowToast"


function Comment({
    commentId,
    postId,
    comment,
    avatar,
    likes,
    username,
    createdAt,
    setComments
}) {

    const showToast = useShowToast()

    const deleteComment = async () => {
        try {
            console.log('Deleting comment:', postId, commentId);
            const res = await fetch(`https://mern-thread-hrd.vercel.app/api/v1/post/comment/${postId}/${commentId}`, {
                method: "PATCH",
                headers: {
					"Content-Type": "application/json"
				},
            })

            const data = await res.json()
            console.log(data)
            showToast("Success", "Comment deleted successfully", "success")
            setComments(data)
            
            
        } catch (error) {
            showToast("Error", "Something went worng while deleting post", "error")
        }
    }
    // const [liked, setLiked ] = useState(false)
  return (
    <>
     <Flex gap={4} my={2} py={2} w={"full"}>
        <Avatar src={avatar} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
            <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                    {username}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"} color={"#736c6c"}>{createdAt}</Text>
                    {/* <BsThreeDots /> */}
                    <Button onClick={deleteComment}>Delete</Button>
                </Flex>
            </Flex>
            <Text>{comment}</Text>
            {/* <Actions liked={liked} setLiked={setLiked} /> */}
            {/* <Text fontSize={"sm"} color={"#736c6c"}>
                {likes + (liked ? 1 : 0)} likes
            </Text> */}
        </Flex>
    </Flex>
    <Divider /> 
    </>
  )
}

export default Comment
