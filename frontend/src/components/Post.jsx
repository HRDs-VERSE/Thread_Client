import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast"
import { formatDistanceToNow } from "date-fns"

const Post = ({ post, postedBy }) => {
    const showToast = useShowToast()
    const [user, setUser] = useState()
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate()
    // console.log(postedBy)
    useEffect(() => {
        const userData = async () => {
            try {
                const res = await fetch(`https://mern-thread-hrd.vercel.app/api/v1/users/${postedBy}`)
                const data = await res.json()
                if (data.error) {
                    showToast("Error", data.error, "error")
                }
                setUser(data)
            } catch (error) {
                showToast("Error", error, "error")
            }
        }
        userData()

    }, [postedBy])
    if (!user) return null
    if (!post) return null
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar size='md' name={user.username} src={user.avatar}
                        onClick={(e) => {
                            e.preventDefault()
                            navigate(`/${user.username}`)
                        }}
                    />
                    <Box w='1px' h={"full"} bg='#736c6c' my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.comments?.length === 0 && <Text>🥱</Text>}
                        {post.comments?.[0] && (
                            <Avatar
                                size='xs'
                                name={post.comments[0].owner}
                                src={post.comments[0].userAvatar}
                                position={"absolute"}
                                top={"0px"}
                                left='15px'
                                padding={"2px"}
                            />
                        )}
                        {post.comments?.[1] && post?.comments?.[1].owner !== post.comments?.[0].owner && (
                            <Avatar
                                size='xs'
                                name={post.comments[1].owner}
                                src={post.comments[1].userAvatar}
                                position={"absolute"}
                                bottom={"0px"}
                                right='-5px'
                                padding={"2px"}
                            />
                        )}

                        {post.comments?.[2] && post.comments?.[2].owner !== post.comments?.[0].owner && post.comments?.[2].owner !== post.comments?.[1].owner (
                            <Avatar
                                size='xs'
                                name={post.comments[2].owner}
                                src={post.comments[1].userAvatar}
                                position={"absolute"}
                                bottom={"0px"}
                                right='-5px'
                                padding={"2px"}
                            />
                        )}

                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text fontSize={"sm"} fontWeight={"bold"}
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/${user.username}`)
                                }}
                            >
                                {post.owner}
                            </Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"xm"} w={"36"} textAlign={"right"} color={"#736c6c"}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                        </Flex>
                    </Flex>

                    <Text fontSize={"lg"} fontStyle={"bold"}>{post.content}</Text>
                    {post.postFile && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid #736c6c"}>
                            <Image src={post.postFile.url} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>

                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;