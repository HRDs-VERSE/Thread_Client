import { Avatar, Box, Flex, Text, VStack, Menu, MenuButton, Portal, MenuList, MenuItem, useToast, Button, Image } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserApi from "../api/userAPI"
import useShowToast from "../hooks/useShowToast";


function UserHeader({ user }) {
    const { handelFollow, getUserFollowers, getUserFollowing  } = useUserApi()
    const currentUser = useRecoilValue(userAtom)
    const showToast = useShowToast();
    const [ fetching, setFetching ] = useState(false)
    const [ followers, setFollowers ] = useState([])
    const [ following, setFollowing ] = useState([])
    const [followBtn, setFollowBtn] = useState(followers.some((follower) => follower.userId === currentUser?._id));

    const copyURL = () => {
        const currentURL = window.location.href
        navigator.clipboard.writeText(currentURL);
        showToast("Success", "Like copied", "success")
    }
    
    useEffect(() => {
        if (user) {
            getUserFollowers(user, setFollowers);
            getUserFollowing(user, setFollowing)
        }
    }, [user])

    
    useEffect(() => {
        setFollowBtn(followers.some((follower) => follower.userId === currentUser?._id))
    }, [followers])


    const handleFollowClick = async () => {

        if (fetching) return 
        setFollowBtn((prev) => !prev)

        setFetching(true)
        try {

            await handelFollow(currentUser, user)
            getUserFollowers(user, setFollowers)

        } catch (error) {
            setFollowBtn((prev) => !prev)
        } finally{
            setFetching(false)
        }
    };


    return (
        <VStack gap={4} alignItems={"start"} fontSize={"25px"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Flex>
                        <Text fontSize={"2xl"} fontWeight={"bold"}>
                            {user?.username}
                        </Text>
                        <Image src='./space.png' w={4} h={4} ml={1} position={"relative"} top={".8rem"} left={".5rem"} />
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"md"}>{user?.fullName}</Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar name={user?.username} src={user?.avatar || "./nullAvatar.jpg"} size={{
                        base: "md",
                        md: "xl",
                    }} />
                </Box>
            </Flex>

            <Text>{user?.bio}</Text>

            {currentUser?._id === user?._id && (
                <Link to="/updateprofile">
                    <Button size={"sm"}>
                        Update Profile
                    </Button>
                </Link>
            )}
            {currentUser?._id !== user?._id && (
                <Link>
                    <Button size={"sm"} onClick={handleFollowClick}>
                        {followBtn ? "Unfollow" : "Follow"}
                    </Button>
                </Link>
            )}
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"} fontSize={"1.2rem"}>
                    <Text color={"#736c6c"}>{followers?.length} followers</Text>
                    <Box w="1" h="1" bg={"white"} borderRadius={"full"}></Box>
                    <Text color={"#736c6c"}>{following?.length} following</Text>
                </Flex>
                <Flex >
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton position={"absolute"}>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"black"}>
                                    <MenuItem bg={"black"} onClick={copyURL}>COPY LINK</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>

                </Flex>
            </Flex>

            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom={"1.5px solid gray"} justifyContent={"center"} pb="3" cursor={"pointer"}
                    color={"#736c6c"}>
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>

            </Flex>
        </VStack>
    )
}

export default UserHeader
