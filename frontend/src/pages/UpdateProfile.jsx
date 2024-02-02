'use client'

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from "../atoms/userAtom"
import usePreviewImg from '../hooks/usePreviewImg'
import useShowToast from '../hooks/useShowToast'

export default function UserProfileEdit() {
  const fileRef = useRef(null)
  const showToast = useShowToast()
  const [user, setUser] = useRecoilState(userAtom)
  const currentUser = useRecoilValue(userAtom)
  const apiURL = import.meta.env.VITE_API_URL;

  const [input, setInput] = useState({
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    bio: user.bio,
    newPassword: ""
  })
  const { handleImageChange, imgUrl } = usePreviewImg()

  const handelSubmit = async (e) => {
    e.preventDefault()

    try {
       const res = await fetch(`${apiURL}/api/v1/users/update-account-details`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({...input, avatar: imgUrl, userId : currentUser?._id})
       })

       const data = await res.json()
       if (data.error) {
        showToast("Error", data.error, "error")
       }
       showToast("Success", "Profile updated successfully", "success")
       setUser(data)
       localStorage.setItem("user-threads", JSON.stringify(data));
      
    } catch (error) {
      showToast("Error", error, "error")
    }
    
  }

  return (
    <form onSubmit={handelSubmit}>
      <Flex
        minH={'50vh'}
        align={'center'}
        justify={'center'}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', '#0f0f0f')}
          rounded={'xl'}
          boxShadow={'lg'}
          position={"absolute"}
          top={"2rem"}
          p={6}
          mt={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center>
                <Avatar size="xl" src={imgUrl || user.avatar} />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>Change Avatar</Button>
                <Input
                  type='file'
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}

                />
              </Center>
            </Stack>
          </FormControl>
          <Flex justifyContent={"space-between"}>

            <FormControl isRequired mr={"2px"}>
              <FormLabel>username</FormLabel>
              <Input
                placeholder="userName"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                onChange={(e) => setInput({ ...input, username: e.target.value })}
                value={input.username}

              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                placeholder="your-email@example.com"
                _placeholder={{ color: 'gray.500' }}
                type="email"
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                value={input.email}
              />
            </FormControl>
          </Flex>
          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="full Name"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              onChange={(e) => setInput({ ...input, fullName: e.target.value })}
              value={input.fullName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Bio"
              _placeholder={{ color: 'gray.500' }}
              type="text"
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              value={input.bio}
            />
          </FormControl>
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
              onChange={(e) => setInput({ ...input, newPassword: e.target.value })}
              value={input.newPassword}
            />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
            <Button
              bg={'red.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'red.500',
              }}>
              Cancel
            </Button>
            <Button
              bg={'blue.400'}
              color={'white'}
              w="full"
              _hover={{
                bg: 'blue.500',
              }}
              type='submit'
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  )
}