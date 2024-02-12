import { Avatar, Button, Divider, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs"
// import Actions from "./Actions"
import useShowToast from "../hooks/useShowToast"
import { useRecoilValue } from 'recoil'
import userAtom from "../atoms/userAtom"
import useCommentApi from "../api/commentAPI"


function Comment({
    commentId,
    comment,
    avatar,
    likes,
    username,
    createdAt,
    setComments,
    owner
}) {
    const { deleteComment } = useCommentApi()
    const currentUser = useRecoilValue(userAtom)

    const handleDelete = () => {
        deleteComment(commentId, setComments)

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
                                <Button onClick={handleDelete}>Delete</Button>
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
