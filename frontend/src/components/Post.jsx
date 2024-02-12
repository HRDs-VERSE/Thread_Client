import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns"
import usePostAPI from "../api/postAPI"
import { Button } from "@chakra-ui/react";
import { MdOutlineDelete } from "react-icons/md";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import useUserApi from "../api/userAPI";
import useCommentApi from "../api/commentAPI";


const Post = ({ post, postedBy }) => {
    const postId = post?._id
    const currentUser = useRecoilValue(userAtom)
    const { getUser } = useUserApi()
    const { deletePost } = usePostAPI();
    const { getPostComment } = useCommentApi()
    const [user, setUser] = useState()
    const [postComments, setPostComments] = useState([])
    const navigate = useNavigate()

    const customFormatDistanceToNow = (date) => {
        const distance = formatDistanceToNow(date, { addSuffix: true });

        const parts = distance.split(' ');

        if (parts[0] === 'about') {
            const value = parseInt(parts[1]);

            if (parts[2].startsWith('minute')) {
                return `${value}min`;
            }

            if (parts[2].startsWith('hour')) {
                return `${value}hr`;
            }
        }

        if (parts[1].startsWith('day')) {
            const value = parseInt(parts[0]);
            return `${value}d`;
        }

        return distance;
    };



    useEffect(() => {
        const username = postedBy
        
        getUser(username, setUser)


    }, [postedBy])

    useEffect(() => {
        (async () => {
            await getPostComment(postId, setPostComments)
        })()
        
    },[user])

    if (!user) return null
    if (!post) return null

    return (

        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size='md' name={user.username} src={user.avatar || "./nullAvatar.jpg"}
                    onClick={(e) => {
                        e.preventDefault()
                        navigate(`/${user.username}`)
                    }}
                />
                <Box w='1px' h={"full"} bg='#736c6c' my={2}></Box>
                <Box position={"relative"} w={"full"}>
                    {postComments?.length === 0 && <Text>🥱</Text>}
                    {postComments?.[0] && (
                        <Avatar
                            size='xs'
                            name={postComments[0].username}
                            src={postComments[0].userAvatar}
                            position={"absolute"}
                            top={"0px"}
                            left='15px'
                            padding={"2px"}
                        />
                    )}
                    {postComments?.[1] && postComments?.[1].username !== postComments?.[0].username && (
                        <Avatar
                            size='xs'
                            name={postComments[1].username}
                            src={postComments[1].userAvatar}
                            position={"absolute"}
                            bottom={"0px"}
                            right='-5px'
                            padding={"2px"}
                        />
                    )}

                    {postComments?.[2] && postComments?.[2].username !== postComments?.[0].username && postComments?.[2].username !== postComments?.[1].username &&(
                        <Avatar
                            size='xs'
                            name={postComments[2].username}
                            src={postComments[1].userAvatar}
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
                            cursor={"pointer"}
                            onClick={(e) => {
                                e.preventDefault()
                                navigate(`/${user.username}`)
                            }}
                        >
                            {post.owner}
                        </Text>
                        <Image src='/space.png' w={4} h={4} ml={3} />
                    </Flex>
                    <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xm"} w={"36"} textAlign={"right"} color={"#736c6c"}>
                            {customFormatDistanceToNow(new Date(post.createdAt))}
                        </Text>
                        {currentUser?.username === post?.owner && (
                            <Button onClick={() => deletePost(post._id)}>
                                <MdOutlineDelete />
                            </Button>
                        )}
                    </Flex>
                </Flex>
                <Link to={`/${user.username}/post/${post._id}`}>
                    <Text fontSize={"lg"} fontStyle={"bold"}>{post.content}</Text>
                </Link>
                {post.postFile && (
                    <Link to={`/${user.username}/post/${post._id}`}>
                        <Box borderRadius={6} overflow={"hidden"} navigate={`/${user.username}/post/${post._id}`}>
                            <Image loading={"lazy"} src={post.postFile.url} w={"full"} className="rounded-[20px]" />
                        </Box>
                    </Link>
                )}

                <Flex gap={3} my={1}>
                    <Actions post={post} postComments={postComments} setPostComments={setPostComments} />
                </Flex>

            </Flex>
        </Flex>

    );
};

export default Post;