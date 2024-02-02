import { Avatar, Button, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
// import Actions from "./Actions"
import useShowToast from "../hooks/useShowToast"
import { useRecoilValue } from 'recoil'
import userAtom from "../atoms/userAtom"


function Comment({
    commentId,
    postId,
    comment,
    avatar,
    likes,
    username,
    createdAt,
    setComments,
    owner
}) {
    const currentUser = useRecoilValue(userAtom)
    const apiURL = import.meta.env.VITE_API_URL;
    const showToast = useShowToast()

    const deleteComment = async () => {
        try {
            const res = await fetch(`${apiURL}/api/v1/post/comment/${postId}/${commentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = await res.json()
            showToast("Success", "Comment deleted successfully", "success")
            setComments(data)


        } catch (error) {
            showToast("Error", "Something went worng while deleting post", "error")
        }
    }

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
                            {currentUser?._id === owner && (
                                <Button onClick={deleteComment}>Delete</Button>
                            )}
                        </Flex>
                    </Flex>
                    <Text>{comment}</Text>
                </Flex>
            </Flex>
            <Divider />
        </>
    )
}

export default Comment
