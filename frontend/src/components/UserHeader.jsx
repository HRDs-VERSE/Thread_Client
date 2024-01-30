import { Avatar, Box, Flex, Text, VStack, Menu, MenuButton, Portal, MenuList, MenuItem, useToast, Button, Image } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast"


function UserHeader({ user }) {
    const showToast = useShowToast
    const currentUser = useRecoilValue(userAtom)
    const toast = useToast();
    const [updating, setUpdating] = useState(false)
    const [following, setFollowing] = useState(user?.followers.includes(currentUser?.username))


    useEffect(() => {
        if (user) {
            setFollowing(user.followers.includes(currentUser?.username));
        }
    }, [user, currentUser]);
    const copyURL = () => {
        const currentURL = window.location.href
        navigator.clipboard.writeText(currentURL)
        toast({
            title: "Success.",
            status: "success",
            description: "Profile link copied.",
            duration: 3000,
            isClosable: true,
        });

    }
    const handleFollow = async () => {
        if (!currentUser) {
            showToast("Error", "Please Login to Follow", "error");
            return;
        }

        setUpdating(true);

        try {
            const res = await fetch(`api/v1/users/follow-un-follow/${user?._id}`, {
                method: "POST",
                "Content-Type": "application/json",
            });

            const data = await res.json();

            if (data.error) {
                showToast("Error", data.error.message, "error");
                return;
            }

            const updatedUserResponse = await fetch("api/v1/users/current-user");
            const updatedUserData = await updatedUserResponse.json();

            // Update the local storage or state with the updated user data
            localStorage.setItem("user-threads", JSON.stringify(updatedUserData));

            // Update your state or context with the updated user data if needed
            if (following) {
                user.followers.pop();
            } else {
                user.followers.push(currentUser?._id);
            }
            setFollowing(!following);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
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
                        <Image src='/verified.png' w={4} h={4} ml={1} position={"relative"} top={".8rem"} left={".5rem"} />
                    </Flex>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"md"}>{user?.fullName}</Text>
                        <Text fontSize={"sm"} bg={"#b5b5b5"} color={"#545353"} p={1} borderRadius={("full")}>threads.net</Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar name={user?.username} src={user?.avatar} size={{
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
                    <Button size={"sm"} onClick={handleFollow} isLoading={updating}>
                        {following ? "Unfollow" : "Follow"}
                    </Button>
                </Link>
            )}
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"} fontSize={"1.2rem"}>
                    <Text color={"#736c6c"}>{user?.followers.length} followers</Text>
                    <Box w="1" h="1" bg={"white"} borderRadius={"full"}></Box>
                    <Text color={"#736c6c"}>{user?.following.length} following</Text>
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
